# Broadcasting deshabilitado (`BROADCAST_CONNECTION=null`)

> Estado: deshabilitado intencionalmente · Última revisión: 2026-05-21

## TL;DR

En el `.env` y `.env.example` está fijado:

```env
BROADCAST_CONNECTION=null
```

La app **funciona normal** — solo los eventos en tiempo real (transcripción en vivo, resumen post-sesión) **no se emiten al frontend**. El usuario tiene que refrescar para verlos.

---

## Por qué está a `null`

### El síntoma

En Railway, los logs del worker mostraban en bucle:

```
production.ERROR: Failed to create broadcaster for connection "reverb" with error:
Pusher\Pusher::__construct(): Argument #1 ($auth_key) must be of type string, null given
```

Cualquier `event(new ShouldBroadcast…)` (p. ej. [`TranscriptionSegmentCreated`](../app/Events/TranscriptionSegmentCreated.php), [`SessionSummarized`](../app/Events/SessionSummarized.php)) instancia el broadcaster `reverb` en runtime y revienta porque las variables `REVERB_APP_KEY` / `REVERB_APP_SECRET` / `REVERB_APP_ID` están vacías en el entorno Railway.

### La causa raíz

El proyecto está configurado para usar **Laravel Reverb** como WebSocket server (ver [`config/broadcasting.php:33-47`](../config/broadcasting.php) y la entrada en [`composer.json`](../composer.json) → `laravel/reverb`). Reverb es un servidor que tienes que correr tú: necesita su propio proceso (`php artisan reverb:start`), su propio host:puerto, y credenciales generadas con `php artisan reverb:install`.

Railway **no tiene un servicio Reverb desplegado**, por eso las variables están vacías. El [`docker-entrypoint.sh`](../docker-entrypoint.sh) ya tiene el rol `reverb` preparado, pero nunca se levantó ese servicio en producción.

### La decisión provisional

Mientras no se resuelva el deploy de Reverb (o se migre a un proveedor gestionado), se deja `BROADCAST_CONNECTION=null` para que:

1. Los eventos `ShouldBroadcast` no rompan nada — el `null` driver los acepta y los descarta silenciosamente.
2. La app funcione end-to-end sin tiempo real. La transcripción se sigue guardando en BD, el resumen se sigue generando; solo no hay push al cliente.
3. Los logs queden limpios para detectar otros errores reales.

---

## Funcionalidad afectada

Estos flujos **dependen** de broadcasting y se degradan a "refresca para ver":

| Evento | Disparado por | Consumidor frontend |
|---|---|---|
| [`TranscriptionSegmentCreated`](../app/Events/TranscriptionSegmentCreated.php) | Cada segmento transcrito por Whisper durante una videoconsulta | Panel de transcripción en vivo ([`live-transcript-panel.tsx`](../resources/js/components/live-transcript-panel.tsx)) |
| [`SessionSummarized`](../app/Events/SessionSummarized.php) | Al terminar el resumen IA tras cerrar una cita | Pantalla post-sesión ([`post-session.tsx`](../resources/js/pages/professional/patients/post-session.tsx)) |

El resto de la app (citas, pacientes, facturas, notas, mensajería persistente, Stripe, RGPD…) no usa broadcasting y no se ve afectada.

---

## Cómo reactivarlo

Hay dos caminos. Elige uno; no hace falta hacer ambos.

### Opción A — Reverb self-hosted en Railway (sin coste adicional, más infra)

**Qué supone:** mantener el stack actual (`laravel/reverb` ya está en `composer.json`) y desplegar un tercer servicio en Railway que corra el WebSocket server.

1. **En Railway:** crea un servicio nuevo a partir del mismo repo. Variables:
   ```
   CONTAINER_ROLE=reverb
   PORT=8080
   REVERB_APP_ID=<valor>
   REVERB_APP_KEY=<valor>
   REVERB_APP_SECRET=<valor>
   ```
   Genera los tres valores con `php artisan reverb:install` en local y cópialos.

2. **Habilita TCP Proxy** en ese servicio (Settings → Networking → TCP Proxy). Railway te dará un host tipo `roundhouse.proxy.rlwy.net:XXXXX`.

3. **En los servicios `app` y `worker`** (y en cualquier otro que emita eventos):
   ```
   BROADCAST_CONNECTION=reverb
   REVERB_APP_ID=<mismo>
   REVERB_APP_KEY=<mismo>
   REVERB_APP_SECRET=<mismo>
   REVERB_HOST=roundhouse.proxy.rlwy.net    # host del TCP proxy
   REVERB_PORT=XXXXX                         # puerto del TCP proxy
   REVERB_SCHEME=https
   ```

4. **En el servicio `app`** (build con Vite), además:
   ```
   VITE_REVERB_APP_KEY=<el mismo public key>
   VITE_REVERB_HOST=roundhouse.proxy.rlwy.net
   VITE_REVERB_PORT=XXXXX
   VITE_REVERB_SCHEME=https
   ```
   Y vuelve a desplegar (las `VITE_*` se hornean en el bundle JS, requieren rebuild).

5. **CSP:** revisa [`SecurityHeaders.php`](../app/Http/Middleware/SecurityHeaders.php) — el `connect-src` ya incluye el host de Reverb leído de `config('broadcasting.connections.reverb.options.host')`, así que con las env vars correctas no hay que tocar nada.

**Pros:** cero vendor lock-in, sin coste extra significativo. **Contras:** un servicio más que mantener; el TCP proxy de Railway no es WebSocket nativo y puede tener latencias o cortes ocasionales.

### Opción B — Proveedor gestionado (Ably / Pusher)

**Qué supone:** dejar de usar Reverb y delegar el WebSocket a un servicio externo.

Cambios en el repo (no aplicados todavía):

1. **`composer.json`:** quitar `laravel/reverb`, añadir `ably/ably-php` (si Ably) o `pusher/pusher-php-server` (si Pusher).
2. **`resources/js/app.tsx`:** cambiar `configureEcho({ broadcaster: 'reverb', … })` a la config del proveedor (Ably en modo Pusher-compatibility apunta a `realtime-pusher.ably.io:443`).
3. **`.env`:** sustituir las `REVERB_*` por `ABLY_KEY` (server) + `VITE_ABLY_PUBLIC_KEY` (client), o las `PUSHER_*` equivalentes.
4. **`SecurityHeaders.php`:** ajustar `connect-src` al host del proveedor (`wss://realtime-pusher.ably.io` para Ably).
5. **Dockerfile + entrypoint:** quitar los `VITE_REVERB_*` ARG/ENV y el rol `reverb`.
6. **Dashboard del proveedor:** Ably → Settings → "Protocol Adapter Settings" → activar **Pusher protocol support**. Sin esto el cliente JS no conecta.
7. **Railway:** poner las env vars del proveedor en los servicios `app` y `worker`. Borrar las `REVERB_*` y `VITE_REVERB_*` antiguas.

**Pros:** infra gestionada, sin servicio extra que mantener, WS profesionales con SLA. **Contras:** dependencia externa; planes gratis tienen límites (Ably: 6M msgs/mes, 200 conexiones; Pusher sandbox: 200k msgs/día, 100 conexiones).

---

## Verificación tras reactivar

Independientemente del camino elegido, comprueba:

1. Logs del `worker` en Railway no muestran más `Failed to create broadcaster`.
2. Abre una videoconsulta de prueba; el panel de transcripción debería actualizarse en vivo sin recargar.
3. DevTools → Network → WS: debería verse una conexión WebSocket activa al endpoint configurado.
4. Si usas proveedor gestionado, su dashboard de Stats debería marcar mensajes/conexiones cuando alguien usa la app.

---

## Referencias

- [ADR-0009 — Laravel Reverb broadcaster live transcription](adr/0009-laravel-reverb-broadcaster-live-transcription.md) (decisión original).
- [docs/deploy/railway-multiservice.md](deploy/railway-multiservice.md) (split `app` / `worker` / `init`).
- [Laravel docs · Broadcasting](https://laravel.com/docs/12.x/broadcasting).
