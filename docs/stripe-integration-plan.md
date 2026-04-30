# Plan — Integración real de pago con Stripe (test mode)

## Contexto

**Problema detectado en auditoría:** el requisito de "control de pagos por sesión" está cumplido en su capa de UI (listado de pacientes, filtros pagado/pendiente, importes visibles, marcado manual + observer), pero **falta la integración real con pasarela de pago**. La estructura DB ya tiene columnas `stripe_payment_id` y `payment_method enum('stripe', ...)` preparadas, pero ningún código las usa: no hay SDK instalado, ni endpoint webhook, ni sincronización automática de estado, ni tests de pago electrónico.

**Decisiones del usuario (Phase 1):**
- Pasarela: **Stripe** (alineado con la columna `stripe_payment_id` ya existente).
- Entorno: **solo test mode** (`sk_test_*`) — apto para TFG/desarrollo, sin riesgo financiero.
- Orden de ejecución: **Pasarela → Webhook → Tests → Docs**. Una tarea de cada vez, con Gate (Pint, Pest, lint, types, build) entre tareas.

**Resultado esperado:** la psicóloga genera un enlace de pago Stripe Checkout para una factura `sent`; el paciente paga; Stripe notifica vía webhook; el sistema marca la factura `paid` con `stripe_payment_id`, `paid_at` y `payment_method='stripe'` automáticamente, sin intervención manual.

---

## Tarea 1 — Instalación y configuración de Stripe SDK

**Objetivo:** dejar Stripe disponible en el contenedor de Laravel sin tocar lógica de negocio aún.

### Pasos
1. **ADR previo** en [decision-log.md](decision-log.md) — `ADR-00XX: Integración Stripe (test mode) para cobro de sesiones`. Justificación: requisito de pasarela, test mode únicamente, fuera de scope: producción/KYC.
2. `composer require stripe/stripe-php` (rama `feat/stripe-integration`, **no** `main`).
3. Añadir a [config/services.php](../config/services.php):
   ```php
   'stripe' => [
       'key'            => env('STRIPE_KEY'),
       'secret'         => env('STRIPE_SECRET'),
       'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
   ],
   ```
4. Añadir a [.env.example](../.env.example) las tres variables vacías con comentario `# test mode only`.
5. Crear `app/Services/Payments/StripeGateway.php` (constructor recibe `config('services.stripe.secret')`). Métodos:
   - `createCheckoutSession(Invoice $invoice): string` — devuelve URL de Stripe Checkout.
   - `verifyWebhookSignature(string $payload, string $signature): \Stripe\Event` — usa `Webhook::constructEvent()` del SDK.
6. **Gate:** `composer dump-autoload` + `php artisan test --compact` (debe seguir verde).

### Archivos a crear/modificar
- ✏️ [composer.json](../composer.json) (dependencia)
- ✏️ [config/services.php](../config/services.php)
- ✏️ [.env.example](../.env.example)
- ➕ `app/Services/Payments/StripeGateway.php`
- ✏️ [decision-log.md](decision-log.md) (ADR)

### Reutilización
- [BillingService.php](../app/Services/BillingService.php) ya expone `markAsPaid(Invoice, string)` — la integración Stripe lo llamará en Tarea 2, no se duplica lógica.

---

## Tarea 2 — Endpoint de checkout + Webhook

**Objetivo:** la profesional dispara cobro Stripe; Stripe notifica el resultado y el sistema sincroniza estado automáticamente.

### Pasos
1. **Action: crear sesión Checkout** — `app/Http/Controllers/Invoice/CreateCheckoutAction.php` (single-action). Flujo:
   - Autoriza vía `InvoicePolicy::pay($user, $invoice)` (crear policy si no existe; reusar patrón de [app/Policies/](../app/Policies/)).
   - Llama `StripeGateway::createCheckoutSession($invoice)` con `success_url` y `cancel_url` (Wayfinder).
   - Persiste `stripe_checkout_session_id` en invoice (nueva columna nullable, ver migración).
   - Devuelve redirect Inertia a la URL de Stripe.
2. **Migración aditiva:** añadir `stripe_checkout_session_id` (string, nullable, indexed) a tabla `invoices`. **No** romper datos existentes.
3. **Webhook controller** — `app/Http/Controllers/Webhook/StripeWebhookAction.php`. Flujo:
   - Lee header `Stripe-Signature`.
   - Verifica con `StripeGateway::verifyWebhookSignature()`.
   - Para evento `checkout.session.completed`:
     - Localiza `Invoice` por `stripe_checkout_session_id`.
     - Llama `BillingService::markAsPaid($invoice, 'stripe')`.
     - Persiste `stripe_payment_id` desde el `payment_intent` del evento.
   - Devuelve 200 (Stripe reintenta si no es 2xx).
4. **Ruta del webhook** en [routes/web.php](../routes/web.php) **fuera** de los grupos auth/professional:
   ```php
   Route::post('/webhooks/stripe', StripeWebhookAction::class)->name('webhooks.stripe');
   ```
5. **Excluir de CSRF** en [bootstrap/app.php](../bootstrap/app.php) → `validateCsrfTokens(except: ['webhooks/stripe'])`.
6. **Botón "Cobrar con Stripe"** en [resources/js/pages/professional/invoices/review.tsx](../resources/js/pages/professional/invoices/review.tsx) — visible solo si `status === 'sent'`. Usa Wayfinder action generada. Chakra UI v3 (consultar MCP `mcp__chakra-ui__*` antes).
7. **Indicador de pendiente Stripe** en [invoices/index.tsx](../resources/js/pages/professional/invoices/index.tsx) — badge cuando `stripe_checkout_session_id` está set y status sigue `sent`.
8. **Gate completo.**

### Archivos a crear/modificar
- ➕ `app/Http/Controllers/Invoice/CreateCheckoutAction.php`
- ➕ `app/Http/Controllers/Webhook/StripeWebhookAction.php`
- ➕ `database/migrations/{timestamp}_add_stripe_checkout_session_id_to_invoices_table.php`
- ➕ `app/Policies/InvoicePolicy.php` (si no existe)
- ✏️ [routes/web.php](../routes/web.php)
- ✏️ [bootstrap/app.php](../bootstrap/app.php) (CSRF except)
- ✏️ [app/Models/Invoice.php](../app/Models/Invoice.php) (`$fillable` + casts si aplica)
- ✏️ [resources/js/pages/professional/invoices/review.tsx](../resources/js/pages/professional/invoices/review.tsx)
- ✏️ [resources/js/pages/professional/invoices/index.tsx](../resources/js/pages/professional/invoices/index.tsx)

### Reutilización
- `BillingService::markAsPaid()` — punto único de transición a `paid`.
- [PaymentObserver.php](../app/Observers/PaymentObserver.php) sella `paid_at` automáticamente — no duplicar.
- Wayfinder genera la action TS automáticamente tras `php artisan wayfinder:generate`.

---

## Tarea 3 — Cobertura de tests

**Objetivo:** test real (sin mockear DB, según feedback memory) del flujo end-to-end Stripe.

### Pasos
1. `php artisan make:test --pest StripeCheckoutTest` (Feature).
   - `professional can create checkout session for sent invoice` — mockea **solo** el cliente HTTP de Stripe (`Http::fake()` o stub del `StripeGateway` con interface), no la DB.
   - `cannot create checkout for already-paid invoice` — 403/422.
   - `cannot create checkout for another professional's invoice` — policy.
2. `php artisan make:test --pest StripeWebhookTest` (Feature).
   - `webhook with valid signature marks invoice as paid` — fuente de payload: fixture JSON real de Stripe (`tests/Fixtures/stripe/checkout-session-completed.json`).
   - `webhook with invalid signature returns 400` — verificación de firma.
   - `webhook is idempotent — processing same event twice does not duplicate state` — Stripe reintenta.
   - `webhook ignores unknown event types` — devuelve 200 sin tocar DB.
3. **Estrategia de aislamiento del SDK** — extraer interface `PaymentGateway` y bindear `StripeGateway` en `AppServiceProvider`. En tests, swap por `FakeStripeGateway`. Esto permite tests sin tocar red.
4. **Gate completo** — `php artisan test --compact` debe sumar 4 tests más como mínimo, todos verdes.

### Archivos a crear
- ➕ `tests/Feature/StripeCheckoutTest.php`
- ➕ `tests/Feature/StripeWebhookTest.php`
- ➕ `tests/Fixtures/stripe/checkout-session-completed.json`
- ➕ `app/Contracts/PaymentGateway.php` (interface)
- ➕ `tests/Support/FakeStripeGateway.php`

### Reutilización
- Patrón de feature test existente en [tests/Feature/BillingControllerTest.php](../tests/Feature/BillingControllerTest.php) — copiar setup de actor/factory.
- [Sprint2/BillingTest.php](../tests/Feature/Sprint2/BillingTest.php) muestra cómo testear PDF + Job — análogo.

---

## Tarea 4 — Documentación

**Objetivo:** dejar trazabilidad RGPD + AI usage + onboarding para futuros desarrolladores.

### Pasos
1. **Cerrar el ADR** abierto en Tarea 1 marcándolo "Implemented" en [decision-log.md](decision-log.md) con commit hashes.
2. **Actualizar** [ai-usage-declaration.md](ai-usage-declaration.md) con la entrada de este PR (asistido por IA).
3. **README de Stripe local-dev:** sección en `docs/` (sólo si el usuario lo pide explícitamente — recordar prohibición CLAUDE.md de crear `.md` sin petición). Cubrir:
   - Cómo obtener `sk_test_*` y `whsec_*`.
   - Cómo arrancar `stripe listen --forward-to localhost:8000/webhooks/stripe` para desarrollo.
   - Tarjetas de prueba (`4242 4242 4242 4242`).
4. **Gate completo final.**

### Archivos a modificar
- ✏️ [decision-log.md](decision-log.md)
- ✏️ [ai-usage-declaration.md](ai-usage-declaration.md)
- ✏️ docs sobre Stripe-dev — **solo bajo petición explícita**.

---

## Verificación end-to-end

Tras completar las 4 tareas:

```bash
# 1. Gate de calidad
vendor/bin/pint --dirty --format agent
php artisan test --compact
npm run lint && npm run types && npm run build

# 2. Test manual con Stripe CLI (test mode)
stripe login
stripe listen --forward-to localhost:8000/webhooks/stripe
# en otra terminal:
php artisan serve
npm run dev

# 3. Flujo manual:
# - Login como profesional → /professional/invoices → factura status='sent'
# - Click "Cobrar con Stripe" → redirige a Checkout
# - Pagar con 4242 4242 4242 4242, cualquier fecha futura, cualquier CVC
# - Verificar:
#   * Stripe CLI muestra evento checkout.session.completed
#   * /professional/invoices muestra factura en 'paid'
#   * DB: invoices.stripe_payment_id, paid_at, payment_method='stripe' rellenos
```

## Restricciones críticas (CLAUDE.md)

- ❌ No commits a `main`. Cada tarea → commit separado en rama `feat/stripe-integration` → PR.
- ❌ No `--no-verify` ni `--no-gpg-sign`.
- ❌ No clases Tailwind. UI 100% Chakra UI v3 vía MCP.
- ❌ No URLs hardcoded. Wayfinder en TS, `route()` en Blade/PHP.
- ✅ ADR antes de añadir dependencia (`stripe/stripe-php`).
- ✅ Tests reales contra DB (memoria de feedback: no mockear DB).
- ✅ Skill `chakra-ui-v3` cargada antes de tocar el botón "Cobrar".

## Orden de ejecución

Tareas estrictamente secuenciales — el usuario validará Gate verde antes de proceder a la siguiente:

1. **Tarea 1** (SDK + ADR) → commit → Gate → 🛑 esperar OK del usuario.
2. **Tarea 2** (Checkout + Webhook + UI) → commit → Gate → 🛑 esperar OK.
3. **Tarea 3** (Tests) → commit → Gate → 🛑 esperar OK.
4. **Tarea 4** (Docs + cierre ADR) → commit → Gate → PR a `main`.
