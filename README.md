# ClientKosmos

> **Tu memoria operativa por cliente — Gestiona freelance sin perder contexto**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![Tests](https://img.shields.io/badge/Tests-156%20cases-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Modelo Freemium](#modelo-freemium)
- [Features](#features)
- [Fases del Desarrollo](#fases-del-desarrollo)
- [Requisitos](#requisitos)
- [Instalacion Rapida](#instalacion-rapida)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Utiles](#comandos-utiles)
- [Roles y Permisos](#roles-y-permisos)
- [Rutas de la Aplicacion](#rutas-de-la-aplicacion)
- [Testing](#testing)
- [Docker](#docker)
- [Configuracion](#configuracion)
- [Troubleshooting](#troubleshooting)
- [Documentacion](#documentacion)
- [Licencia](#licencia)

---

## Acerca de

**ClientKosmos** es una plataforma web freemium pensada para **freelancers que gestionan varios clientes a la vez**. Cada cliente tiene su propia ficha con tareas, ideas, recursos y contexto, de modo que al cambiar de cliente retomas justo donde lo dejaste.

### Que problema resuelve

La fragmentacion de herramientas (una app para tareas, otra para ideas, otra para enlaces) genera:
- **Perdida de contexto**: al saltar de un cliente a otro se pierden detalles cruciales.
- **Informacion dispersa**: ideas sueltas, enlaces en marcadores, tareas sin vincular a quien pertenecen.
- **Falta de vision diaria**: no hay un lugar que muestre "que tengo que hacer hoy y para quien".

ClientKosmos unifica estas necesidades en fichas de cliente con:

- **Clientes** como unidad central: cada cliente agrupa tareas, ideas y recursos
- **Tareas** con prioridades, fechas de vencimiento y vinculacion a cliente
- **Ideas** para captura rapida, ligadas a un cliente
- **Recursos** (enlaces, documentos, videos) organizados dentro de cada ficha *(Solo Premium)*
- **IA contextual con Kosmo** (asistente IA): planificar el dia, resumen de cliente y parte semanal *(Solo)*
- **Panel Hoy** que muestra tareas del dia agrupadas por cliente con badges de riesgo
- **Nudges contextuales de Kosmo** que sugieren acciones cuando hay tareas vencidas *(Solo)*
- **Upgrade prompts contextuales** que explican el valor de Solo donde el usuario siente el limite

---

## Modelo Freemium

| Plan | Precio | Clientes | Tareas | Ideas | Recursos | IA |
|------|--------|----------|--------|-------|----------|-----|
| **Gratuito** | 0 € | 1 | 5 max pendientes | Ilimitadas | — | — |
| **Solo Mensual** | 11,99 €/mes | Ilimitados | Ilimitadas | Ilimitadas | Si | 3 acciones |
| **Solo Anual** | 119 €/ano | Ilimitados | Ilimitadas | Ilimitadas | Si | 3 acciones |

---

## Features

### Core (Todos los Usuarios)
- Autenticacion completa: registro, login, recuperacion de contrasena, verificacion email, 2FA (Fortify)
- Fichas de cliente con nombre, descripcion, color y estado (activo/inactivo/completado)
- Gestor de tareas vinculadas a cliente con limite free (5 pendientes max) — CRUD + completar/reabrir
- Gestor de ideas sin limite — CRUD + resolver/reactivar
- Panel Hoy con tareas del dia agrupadas por cliente + badges de riesgo (vencidas/proximas)
- Header de contexto en ficha de cliente: tareas pendientes, urgentes, vencidas, proxima entrega, ideas activas
- Badges de riesgo en lista de clientes (vencidas en rojo, proximas en ambar)
- Upgrade prompts contextuales (copy refinado en limites de clientes, tareas e IA)
- Checkout y suscripcion simulada (80% exito / 20% fallo)
- Tutorial interactivo con tour guiado (spotlight + Kosmo chatbot) para nuevos usuarios
- Landing page completa (hero, features, pricing, footer)
- Modo oscuro/claro con persistencia

### Solo (Premium)
- Clientes ilimitados
- Tareas ilimitadas
- Recursos por cliente (enlaces, documentos, videos, imagenes)
- Nudges contextuales de Kosmo (dismissable, reset diario) en Panel Hoy y ficha de cliente
- IA contextual con Kosmo — 3 acciones:
  - `planDay`: planifica tu dia con la informacion de todos tus clientes
  - `clientSummary`: resume el estado actual de un cliente
  - `clientUpdate`: genera un parte semanal detallado para un cliente

### Admin
- Dashboard con estadisticas globales
- Gestion de usuarios (lista paginada + detalle + eliminacion)
- Historial de pagos con resumen de ingresos
- Control de suscripciones con distribucion por plan

---

## Fases del Desarrollo

El proyecto se desarrollo en 5 fases incrementales:

| Fase | Descripcion | Estado |
|------|-------------|--------|
| **Fase 1** | Restructuracion backend: "Proyectos" → "Clientes", eliminacion de Cajas/Voz/Chat, limpieza de rutas y modelos | Completada |
| **Fase 2** | Ficha de cliente completa (tareas + ideas + recursos en una sola vista) y dashboard "Panel Hoy" | Completada |
| **Fase 3** | IA contextual con 3 endpoints: plan-day, client-summary, client-update (Groq) | Completada |
| **Fase 4** | Pulido, landing page, precios actualizados (11,99/119 €), datos demo en seeders, README | Completada |
| **Fase 5** | Rebrand ClientKosmos/Kosmo, Panel Hoy reestructurado, header de contexto por cliente, badges de riesgo, nudges de Kosmo (dismissable), upgrade prompts contextuales, documentación actualizada | Completada |

---

## Requisitos

```
PHP 8.4+
Composer 2.x
Node.js 18+
npm
Git
```

**Para la base de datos (TiDB Cloud):**
```
Certificado SSL ISRG Root X1 (Let's Encrypt)
```

**Para la IA contextual (Groq):**
```
Cuenta gratuita en Groq (https://console.groq.com)
Certificado CA bundle de Mozilla (para Windows)
```

---

## Instalacion Rapida

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd clientkosmos-samuel-ayllon
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar certificados SSL (Windows)

> **IMPORTANTE:** En Windows, PHP/cURL no incluye certificados SSL por defecto. Necesitas descargarlos manualmente para que funcione tanto la conexion a la base de datos (TiDB Cloud) como la IA contextual (Groq).

Abre **PowerShell como administrador** y ejecuta:

```powershell
# Crear directorio de certificados
mkdir C:\certs

# Descargar certificado ISRG Root X1 (necesario para TiDB Cloud)
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"

# Descargar CA bundle de Mozilla (necesario para Groq/IA contextual)
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

Esto descarga:
- `C:\certs\isrgrootx1.pem` — Certificado raiz de Let's Encrypt, requerido para la conexion SSL a TiDB Cloud Serverless.
- `C:\certs\cacert.pem` — Bundle completo de autoridades certificadoras de Mozilla, requerido para que cURL/PHP pueda verificar el certificado SSL de la API de Groq (y cualquier otro servicio HTTPS).

> **Linux/macOS:** Estos sistemas ya incluyen los certificados CA del sistema. No es necesario descargarlos manualmente.

### 4. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` con tus credenciales:

```env
# ── Base de datos (TiDB Cloud) ─────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem

# ── IA contextual (Groq — gratuito) ────────────────────────────
GROQ_API_KEY=gsk_tu_clave_aqui
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem
```

> **Obtener la API key de Groq:** Registrate gratis en [console.groq.com](https://console.groq.com), ve a "API Keys" y genera una nueva clave. El plan gratuito permite 14.400 peticiones/dia.

### 5. Migrar base de datos con datos de prueba
```bash
php artisan migrate:fresh --seed
```

Esto crea 3 usuarios de prueba con datos demo: clientes, tareas, ideas y recursos.

### 6. Iniciar servidor
```bash
# Terminal 1 — Backend
php artisan serve

# Terminal 2 — Frontend (Vite)
npm run dev
```

### 7. Acceder
```
http://localhost:8000
```

---

## Credenciales de Prueba

Despues de `php artisan migrate:fresh --seed`:

| Rol | Email | Password | Datos demo |
|-----|-------|----------|------------|
| Admin | admin@clientkosmos.test | password | — |
| Premium (Solo) | premium@clientkosmos.test | password | 3 clientes, tareas, ideas, recursos |
| Free | free@clientkosmos.test | password | 1 cliente, 3 tareas, 1 idea |

---

## Stack Tecnologico

### Backend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Laravel | 12 | Framework principal |
| Eloquent | (Laravel 12) | ORM |
| Laravel Fortify | 1.x | Autenticacion (login, registro, 2FA, verificacion) |
| Spatie Permission | 7.x | Roles y permisos (admin, premium_user, free_user) |
| Pest | 3.x | Testing (156 test cases) |
| openai-php/client | 0.19 | Cliente SDK para IA (Groq via API OpenAI-compatible) |
| Laravel Wayfinder | 0.1.9 | Generacion de rutas tipadas para TypeScript |

### Frontend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| React | 19 | UI interactiva |
| TypeScript | 5.7 | Tipado estatico |
| Inertia.js | 2.3 | Puente Laravel-React (SPA monolitica sin API REST) |
| shadcn/ui | — | Componentes UI (Radix UI + Tailwind) |
| Tailwind CSS | 4.0 | Estilos utility-first con tokens custom |
| Lucide React | 0.475 | Iconos |
| Vite | 7 | Bundler con React Compiler |

### Base de Datos

| Entorno | Motor | Conexion |
|---------|-------|----------|
| Produccion / Desarrollo | TiDB Cloud Serverless (MySQL-compatible) | Puerto 4000, SSL obligatorio (ISRG Root X1) |
| Tests | SQLite (in-memory) | Cero configuracion |

### Integraciones IA

| Servicio | Uso | Plan gratuito | Configuracion |
|---------|-----|---------------|---------------|
| **Groq** (usado) | IA contextual — Llama 3.3 70B | 14.400 req/dia | `GROQ_API_KEY` + `GROQ_CA_BUNDLE` |
| OpenAI GPT | Alternativa compatible | De pago | Cambiar `GROQ_BASE_URL` y `GROQ_API_KEY` |

---

## Arquitectura

### Patron general
ClientKosmos sigue el patron **SPA monolitica** con Inertia.js: el backend Laravel renderiza paginas React directamente sin necesidad de una API REST separada. Esto simplifica autenticacion, validacion y navegacion.

### Capas de la aplicacion

```
[Browser] <--Inertia--> [Laravel Controllers] <--Eloquent--> [TiDB Cloud (MySQL)]
                              |
                         [Policies]     → Autorizacion por ownership
                         [Middleware]   → Roles (Spatie)
                         [FormRequests] → Validacion de entrada
                         [Models]       → Logica de negocio
                              |
                    [OpenAI PHP Client] → Groq API (IA contextual)
```

### Integracion IA — Groq via OpenAI SDK

El cliente de IA se registra como **singleton** en `AppServiceProvider`:

```php
$this->app->singleton(OpenAIClient::class, function () {
    return OpenAI::factory()
        ->withApiKey(config('services.groq.api_key'))
        ->withBaseUri(config('services.groq.base_url'))
        ->withHttpClient(new GuzzleClient(['verify' => config('services.groq.ca_bundle')]))
        ->make();
});
```

Las acciones `Ai\PlanDayAction`, `Ai\ClientSummaryAction` y `Ai\ClientUpdateAction` reciben el cliente por inyeccion de dependencias. Toda la configuracion esta en `config/services.php` bajo la clave `groq`.

### Decisiones clave
- **Patron Single-Action**: cada controlador tiene un unico metodo `__invoke`. Esto facilita la lectura, el testing y la navegacion → cada archivo = una responsabilidad
- **Clientes = Projects**: internamente el modelo se llama `Project`, las URLs usan `/clients` y la UI dice "Clientes"
- **Ideas**: el modelo se llama `Idea`, las URLs usan `/ideas` y la UI dice "Ideas"
- **Hard delete** en Task e Idea (SoftDeletes eliminado tras Fase 2; columna `deleted_at` permanece en BD pero Eloquent la ignora)
- **Limite de tareas free**: `User::canAddTask()` cuenta tareas con `status='pending'` — se aplica tanto al crear como al reabrir
- **Limite de clientes free**: `User::canAddProject()` — 1 cliente maximo en plan gratuito
- **Pago simulado**: `Payment::process()` con 80% exito, almacena solo ultimos 4 digitos (PCI-DSS); transaction ID: `TXN_` + 16 chars aleatorios
- **IA contextual**: 3 endpoints que inyectan datos reales (tareas, ideas, recursos) en el prompt de Groq
- **Ruta home**: `inertia('welcome')` sin redirect a login (requerido por tests de landing page)

---

## Estructura del Proyecto

```
clientkosmos/
├── app/
│   ├── Http/
│   │   ├── Controllers/          ← Patron Single-Action (una clase, un metodo __invoke)
│   │   │   ├── Dashboard/
│   │   │   │   └── IndexAction.php       ← Panel Hoy
│   │   │   ├── Project/                  ← Fichas de cliente (Index, Show, Create, Store, Edit, Update, Destroy, Complete)
│   │   │   ├── Task/                     ← Tareas (Index, Create, Store, Edit, Update, Destroy, Complete, Reopen)
│   │   │   ├── Idea/                     ← Ideas (Index, Create, Store, Edit, Update, Destroy, Resolve, Reactivate)
│   │   │   ├── Resource/                 ← Recursos por cliente (Create, Store, Update, Destroy)
│   │   │   ├── Ai/                       ← IA contextual: PlanDayAction, ClientSummaryAction, ClientUpdateAction
│   │   │   ├── Subscription/
│   │   │   ├── Checkout/
│   │   │   ├── Tutorial/
│   │   │   └── Admin/                    ← AdminDashboard, AdminUser, AdminPayment, AdminSubscription
│   │   └── Requests/                     ← Form Requests de validacion
│   ├── Models/
│   │   ├── User.php           ← canAddTask(), canAddProject(), getDashboardData(), roles
│   │   ├── Task.php           ← scopes, prioridades, markAsCompleted(), hard delete
│   │   ├── Idea.php           ← resolve/reactivate, status (active/resolved), hard delete
│   │   ├── Project.php        ← scopes, color, brand_tone, ficha de "cliente"
│   │   ├── Resource.php       ← Recursos vinculados a cliente (link/document/video/image/other)
│   │   ├── Subscription.php   ← plan (free/premium_monthly/premium_yearly), getPrice()
│   │   ├── Payment.php        ← process() simula 80%/20%, generateTransactionId()
│   │   └── AiLog.php          ← Registro de uso de IA (plan_day/summary/update)
│   ├── Providers/
│   │   └── AppServiceProvider.php ← Singleton OpenAI\Client apuntando a Groq
│   └── Policies/              ← 4 policies de ownership (Project, Task, Idea, Resource)
├── config/
│   └── services.php           ← Configuracion Groq (api_key, base_url, model, ca_bundle)
├── database/
│   ├── migrations/            ← 14 migraciones
│   └── seeders/               ← RoleSeeder (3 roles) + UserSeeder (3 usuarios con datos demo)
├── resources/
│   ├── css/app.css            ← Design system ClientKosmos (tokens, animaciones, dark mode)
│   └── js/
│       ├── pages/
│       │   ├── welcome.tsx         ← Landing page publica
│       │   ├── dashboard.tsx       ← Panel Hoy con IA inline (Solo) y badges de riesgo
│       │   ├── tasks/              ← index, create, edit
│       │   ├── ideas/              ← index, create, edit
│       │   ├── projects/           ← index, show, create, edit (fichas de cliente)
│       │   ├── resources/          ← create, edit (Solo)
│       │   ├── subscription/       ← Comparativa de planes
│       │   ├── checkout/           ← Formulario de pago simulado
│       │   ├── admin/              ← Panel admin: dashboard, users, payments, subscriptions
│       │   ├── auth/               ← Login, registro, 2FA, reset password, etc.
│       │   └── settings/           ← Perfil, contrasena, apariencia, 2FA
│       ├── components/
│       │   ├── ui/                 ← 25+ componentes shadcn/ui (Button, Card, Dialog, …)
│       │   ├── tutorial-chatbot.tsx ← Tour interactivo con spotlight y Kosmo
│       │   └── ...                 ← App shell, sidebar, header, breadcrumbs, etc.
│       ├── types/                  ← TypeScript types (models/, pages/, admin/, shared/)
│       ├── hooks/                  ← Custom hooks (appearance, clipboard, 2FA, mobile…)
│       ├── routes/                 ← Rutas tipadas generadas por Laravel Wayfinder
│       └── layouts/                ← App (sidebar) + Auth (centrado)
├── routes/
│   ├── web.php                ← Todas las rutas (publica + auth + premium + admin)
│   └── settings.php           ← Rutas de configuracion de cuenta
├── tests/Feature/             ← 156 test cases (Pest)
├── docs/
│   ├── manual-usuario.md
│   ├── decisiones-tecnicas.md
│   ├── contexto-proyecto.md
│   ├── necesidad-y-justificacion.md
│   └── clientkosmos-style-guide.md.md
├── Dockerfile                 ← Multi-stage build (deps + frontend + final)
├── docker-compose.yml         ← 3 servicios: app, db (MySQL 8), mailpit
└── docker-entrypoint.sh       ← Migraciones, seed y arranque automaticos
```

---

## Comandos Utiles

### Desarrollo
```bash
php artisan serve          # Servidor Laravel (puerto 8000)
npm run dev                # Frontend con hot reload (Vite)
npm run build              # Build de produccion
composer dev               # Todo junto (serve + queue + vite)
```

### Base de Datos
```bash
php artisan migrate:fresh --seed    # Resetear BD con datos de prueba
php artisan migrate                 # Aplicar nuevas migraciones
```

### Testing
```bash
php artisan test                             # Todos los tests
php artisan test --filter=TaskIndex          # Test especifico (nombre de clase action)
php artisan test --coverage                  # Con cobertura
composer test                                # Lint + tests
```

### Cache
```bash
php artisan optimize:clear    # Limpia config, cache, vistas
php artisan config:clear      # Solo limpia cache de configuracion
```

### Lint y formato
```bash
npm run lint               # ESLint
npm run format             # Prettier
composer lint              # Laravel Pint
```

---

## Roles y Permisos

### Tres roles (Spatie Permission)

**`admin`** — Solo panel de administracion
- /admin/dashboard, /admin/users, /admin/payments, /admin/subscriptions

**`premium_user`** — Acceso completo (plan Solo)
- Clientes ilimitados, tareas ilimitadas, recursos, IA contextual

**`free_user`** — Acceso limitado
- 1 cliente, maximo 5 tareas pendientes, ideas ilimitadas
- Sin recursos ni IA contextual

### Capas de proteccion

| Nivel | Mecanismo |
|-------|-----------|
| **Rutas** | Middleware `role:premium_user` / `role:admin` (Spatie) |
| **Recursos** | Policies — solo el propietario puede ver/modificar |
| **Logica** | `User::canAddTask()` — valida limite de 5 tareas free |
| **Autenticacion** | Fortify + bloqueo si usuario sin rol asignado |

---

## Rutas de la Aplicacion

### Publicas
```
GET  /          Landing page
GET  /login     Login
GET  /register  Registro
```

### Autenticadas (todos los roles)
```
GET/POST/PUT/DELETE  /clients         Fichas de cliente (CRUD)
PATCH                /clients/{id}/complete
GET/POST/PUT/DELETE  /tasks           Tareas vinculadas a cliente
PATCH                /tasks/{id}/complete | /reopen
GET/POST/PUT/DELETE  /ideas           Ideas
PATCH                /ideas/{id}/resolve | /reactivate
GET                  /subscription    Ver suscripcion
GET/POST             /checkout        Pago simulado
POST                 /tutorial/complete  Marcar tutorial completado
```

### Solo / Premium (solo `premium_user`)
```
POST  /ai/plan-day                    Planificar el dia con IA
POST  /ai/client-summary/{project}    Resumen de cliente con IA
POST  /ai/client-update/{project}     Email de seguimiento con IA
GET/POST      /clients/{project}/resources    Recursos del cliente
PUT/DELETE    /resources/{resource}            Editar/eliminar recurso
```

### Admin (solo `admin`)
```
GET         /admin/dashboard
GET         /admin/users
GET/DELETE  /admin/users/{user}
GET         /admin/payments
GET         /admin/subscriptions
```

---

## Testing

```bash
php artisan test
```

**156 test cases** distribuidos en:

| Area | Cobertura |
|------|-----------|
| Auth | Registro, login, verificacion email, reset password, 2FA |
| Tasks | CRUD, completar/reabrir, limite free, autorizacion |
| Ideas | CRUD, resolver/reactivar, autorizacion |
| Clients | CRUD, completar, ownership |
| Resources | CRUD anidado bajo cliente, autorizacion |
| Checkout | Flujo exito/fallo, validacion tarjeta |
| IA contextual | plan-day, client-summary, client-update, control de roles |
| Admin | Dashboard, usuarios, pagos, suscripciones |
| Settings | Perfil, contrasena, 2FA |

Framework: **Pest 3** con helpers custom (`createAdmin()`, `createPremiumUser()`, `createFreeUser()`).

---

## Docker

```bash
docker compose up --build   # Primera vez (construye la imagen)
docker compose up           # Arranque normal
# Acceder en http://localhost:8000
# Bandeja de correo (Mailpit) en http://localhost:8025
```

### Contenedores

| Contenedor | Imagen | Puerto(s) | Descripcion |
|------------|--------|-----------|-------------|
| `clientkosmos_app` | Custom (Dockerfile) | `8000` | Aplicacion Laravel |
| `clientkosmos_db` | `mysql:8.0` | `3306` | Base de datos MySQL |
| `clientkosmos_mailpit` | `axllent/mailpit` | `1025` (SMTP), `8025` (UI) | Servidor de correo de prueba |

### Build multi-stage (Dockerfile)

1. **Stage `deps`** (`php:8.4-cli-alpine`): instala dependencias PHP via Composer (`--no-scripts`)
2. **Stage `frontend`** (`node:20-alpine`): instala dependencias npm, ejecuta `npm run build` (Vite)
3. **Stage `final`** (`php:8.4-fpm-alpine`): copia vendor + assets compilados; imagen de produccion minima

### `docker-entrypoint.sh`
- Copia `.env.example` → `.env` si no existe
- Escribe variables de entorno del compose al `.env`
- Genera `APP_KEY` automaticamente si esta vacio
- Espera a que MySQL este lista (mysqladmin ping)
- Limpia caches (config, route, app)
- Ejecuta `migrate --force`
- Ejecuta `db:seed` solo si la tabla `users` esta vacia (consulta MySQL directamente)
- Cachea config/routes/vistas en produccion
- Arranca `php artisan serve`

### Variables de entorno Docker
- Credenciales DB por defecto: usuario `clientkosmos` / pass `clientkosmos_secret`
- `APP_KEY` se genera automaticamente al primer arranque (copiar al `docker-compose.yml` para persistirla)
- Los emails capturados por Mailpit se visualizan en [http://localhost:8025](http://localhost:8025)
- Usuarios de prueba creados automaticamente: `admin@clientkosmos.test`, `premium@clientkosmos.test`, `free@clientkosmos.test` (password: `password`)

---

## Configuracion

### Variables de entorno principales (.env)

```env
APP_NAME=ClientKosmos
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# ── Base de datos (TiDB Cloud Serverless) ──────────────────────
DB_CONNECTION=mysql
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_DATABASE=test
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_SSL_CA=C:\certs\isrgrootx1.pem

# ── Sesion ──────────────────────────────────────────────────────
SESSION_DRIVER=database

# ── IA contextual (Groq — gratuito, recomendado) ───────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_CA_BUNDLE=C:/certs/cacert.pem
```

### Configuracion de certificados SSL

La aplicacion requiere certificados SSL para dos servicios externos:

| Servicio | Certificado | Ruta por defecto | Variable de entorno |
|----------|-------------|------------------|---------------------|
| **TiDB Cloud** (BD) | ISRG Root X1 (Let's Encrypt) | `C:\certs\isrgrootx1.pem` | `DB_SSL_CA` |
| **Groq** (IA) | CA bundle Mozilla | `C:\certs\cacert.pem` | `GROQ_CA_BUNDLE` |

**Comandos para descargarlos (PowerShell):**
```powershell
mkdir C:\certs
Invoke-WebRequest -Uri "https://letsencrypt.org/certs/isrgrootx1.pem" -OutFile "C:\certs\isrgrootx1.pem"
Invoke-WebRequest -Uri "https://curl.se/ca/cacert.pem" -OutFile "C:\certs\cacert.pem"
```

**En Linux/macOS** estos certificados ya vienen preinstalados en el sistema. Solo necesitas asegurarte de que `php` tenga acceso a ellos (normalmente via `openssl.cafile` en `php.ini`) y puedes omitir `GROQ_CA_BUNDLE` del `.env`.

---

## Troubleshooting

| Problema | Causa | Solucion |
|----------|-------|----------|
| `cURL error 60: SSL peer certificate...` en IA | PHP/cURL no encuentra certificados CA (comun en Windows) | Descargar `cacert.pem` y configurar `GROQ_CA_BUNDLE` en `.env` (ver seccion Configuracion) |
| `cURL error 60` en base de datos | Falta el certificado ISRG Root X1 para TiDB Cloud | Descargar `isrgrootx1.pem` y configurar `DB_SSL_CA` en `.env` |
| Error 419 en formularios | Token CSRF expirado | `php artisan config:clear` + borrar cookies del navegador |
| RoleDoesNotExist | Seeders no ejecutados | `php artisan migrate:fresh --seed` |
| Frontend no actualiza | Cache de Vite | Reiniciar `npm run dev` o Ctrl+Shift+R en el navegador |
| `SQLSTATE[HY000]` en conexion BD | Credenciales incorrectas o cert SSL faltante | Verificar `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` y que `DB_SSL_CA` apunte al certificado correcto |
| IA no responde / timeout | API key invalida o servicio caido | Verificar `GROQ_API_KEY` en `.env` y que Groq este operativo en [status.groq.com](https://status.groq.com) |

---

## Documentacion

| Documento | Descripcion |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificacion tecnica de cada decision |
| [docs/contexto-proyecto.md](docs/contexto-proyecto.md) | Contexto completo y estado del proyecto |
| [docs/clientkosmos-style-guide.md.md](docs/clientkosmos-style-guide.md.md) | Guia de estilos y design system |
| [docs/necesidad-y-justificacion.md](docs/necesidad-y-justificacion.md) | Necesidad y justificacion del proyecto |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para mas detalles.

---

**Samuel Ayllon** — Proyecto Intermodular 2º DAM
