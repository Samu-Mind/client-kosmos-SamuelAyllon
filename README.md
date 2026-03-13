# Flowly

> **Plataforma de Productividad Personal — Tu Centro de Mando Integrado**

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.4+-777BB4?style=flat-square&logo=php)](https://www.php.net)
[![Tests](https://img.shields.io/badge/Tests-191%20cases-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Modelo Freemium](#modelo-freemium)
- [Features](#features)
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

**Flowly** es una plataforma web de productividad personal freemium que actua como un **centro de mando integrado**. Nace de la necesidad de los estudiantes y profesionales jovenes de tener un unico lugar donde gestionar tareas, capturar ideas, organizar recursos y recibir asistencia inteligente, sin saltar entre multiples herramientas.

### Que problema resuelve

La fragmentacion de herramientas de productividad (una app para tareas, otra para notas, otra para enlaces, otra para IA) genera:
- **Friccion cognitiva**: cambiar constantemente de contexto reduce la concentracion.
- **Perdida de informacion**: las ideas se quedan en notas sueltas, los enlaces utiles se pierden en marcadores.
- **Barrera de entrada**: muchas herramientas son de pago o demasiado complejas para un uso personal.

Flowly unifica estas necesidades en una sola plataforma con un modelo freemium accesible:

- **Tareas** con prioridades, fechas de vencimiento y asignacion a proyectos
- **Ideas** para captura rapida de inspiraciones
- **Proyectos** que agrupan tareas con seguimiento de progreso *(Premium)*
- **Cajas de Recursos** para centralizar enlaces, documentos y videos *(Premium)*
- **Dictado por Voz** para crear tareas e ideas hablando *(Premium)*
- **Asistente IA** conversacional con contexto real del usuario *(Premium)*

---

## Modelo Freemium

| Plan | Precio | Tareas | Ideas | Proyectos | Voz | IA |
|------|--------|--------|-------|-----------|-----|-----|
| **Free** | 0 EUR | 5 max pendientes | Ilimitadas | -- | -- | -- |
| **Premium Mensual** | 9,99 EUR/mes | Ilimitadas | Ilimitadas | Si | Si | Si |
| **Premium Anual** | 99,99 EUR/ano | Ilimitadas | Ilimitadas | Si | Si | Si |

---

## Features

### Core (Todos los Usuarios)
- Autenticacion completa: registro, login, recuperacion de contrasena, verificacion email, 2FA (Fortify)
- Gestor de tareas con limite free (5 pendientes max) — CRUD completo + completar/reabrir
- Gestor de ideas sin limite — CRUD completo + resolver/reactivar
- Checkout y suscripcion simulada (80% exito / 20% fallo)
- Dashboard personal con datos reales condicional por plan
- Tutorial interactivo con tour guiado (spotlight + chatbot) para nuevos usuarios
- Landing page completa (hero, features, pricing, footer)
- Modo oscuro/claro con persistencia

### Premium
- Proyectos con agrupacion de tareas, colores y barra de progreso
- Cajas de recursos (enlaces, documentos, videos, imagenes)
- Transcripcion de voz con OpenAI Whisper (quick-create + dictado en formulario)
- Asistente IA conversacional con contexto real del usuario (Groq Llama 3.3 / OpenAI GPT)

### Admin
- Dashboard con estadisticas globales
- Gestion de usuarios (lista paginada + detalle + eliminacion con AlertDialog)
- Historial de pagos con resumen de ingresos
- Control de suscripciones con distribucion por plan

---

## Requisitos

```
PHP 8.4+
Composer 2.x
Node.js 18+
npm
Git
SQLite (incluido con PHP) — para desarrollo local
```

**Opcional:**
```
OpenAI API Key o Groq API Key (gratuita) — para Whisper y asistente IA
```

---

## Instalacion Rapida

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd flowly-samuel-ayllon
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Base de datos (SQLite para desarrollo)
```bash
touch database/database.sqlite
php artisan migrate:fresh --seed
```

### 5. Variables de entorno opcionales (IA y voz)
```env
# Groq (gratuito, recomendado)
OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile

# O con OpenAI directamente
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

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

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@flowly.test | password |
| Premium User | premium@flowly.test | password |
| Free User | free@flowly.test | password |

---

## Stack Tecnologico

### Backend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| Laravel | 12 | Framework principal |
| Eloquent | (Laravel 12) | ORM |
| Laravel Fortify | 1.x | Autenticacion (login, registro, 2FA, verificacion) |
| Spatie Permission | 7.x | Roles y permisos (admin, premium_user, free_user) |
| Pest | 3.x | Testing (191 test cases) |
| openai-php/client | 0.19 | Integracion OpenAI Whisper + Chat IA |
| Laravel Wayfinder | 0.1.9 | Generacion de rutas tipadas para TypeScript |

### Frontend

| Tecnologia | Version | Proposito |
|-----------|---------|----------|
| React | 19 | UI interactiva |
| TypeScript | 5.7 | Tipado estatico |
| Inertia.js | 2.3 | Puente Laravel-React (SPA monolitica sin API REST) |
| shadcn/ui | -- | 28 componentes UI (Radix UI + Tailwind) |
| Tailwind CSS | 4.0 | Estilos utility-first con tokens custom |
| Lucide React | 0.475 | Iconos |
| Vite | 7 | Bundler con React Compiler |

### Base de Datos

| Entorno | Motor |
|---------|-------|
| Desarrollo / Tests | SQLite (cero configuracion) |
| Produccion | TiDB Cloud Serverless (MySQL-compatible, port 4000, SSL) |

### Integraciones IA

| Servicio | Uso | Plan gratuito |
|---------|-----|---------------|
| Groq (recomendado) | Chat IA — Llama 3.3 70B | 14.400 req/dia |
| OpenAI Whisper | Transcripcion de voz | De pago |
| OpenAI GPT | Chat IA alternativo | De pago |

---

## Arquitectura

### Patron general
Flowly sigue el patron **SPA monolitica** con Inertia.js: el backend Laravel renderiza paginas React directamente sin necesidad de una API REST separada. Esto simplifica autenticacion, validacion y navegacion.

### Capas de la aplicacion

```
[Browser] <--Inertia--> [Laravel Controllers] <--Eloquent--> [Database]
                              |
                         [Policies]     → Autorizacion por ownership
                         [Middleware]   → Roles (Spatie)
                         [FormRequests] → Validacion de entrada
                         [Models]       → Logica de negocio
```

### Decisiones clave
- **Hard delete** en Task e Idea (SoftDeletes eliminado en sesion 2; columna `deleted_at` existe pero Eloquent no la usa)
- **Limite de tareas free**: `User::canAddTask()` cuenta tareas con `status='pending'`
- **Pago simulado**: `Payment::process()` con 80% exito, almacena solo ultimos 4 digitos de tarjeta
- **IA context-aware**: el system prompt incluye tareas pendientes, ideas activas y estadisticas del usuario
- **AiConversation** usa `$timestamps = false` (solo `created_at`)
- **Ruta home**: `inertia('welcome')` sin redirect a login (requerido por tests)

---

## Estructura del Proyecto

```
flowly/
├── app/
│   ├── Http/
│   │   ├── Controllers/          ← 20 controllers
│   │   │   ├── TaskController.php
│   │   │   ├── IdeaController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── BoxController.php
│   │   │   ├── ResourceController.php
│   │   │   ├── SubscriptionController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── VoiceRecordingController.php   ← Whisper API
│   │   │   ├── AiChatController.php           ← Chat IA (Groq/OpenAI)
│   │   │   ├── TutorialController.php         ← Tour guiado
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminPaymentController.php
│   │   │       └── AdminSubscriptionController.php
│   │   └── Requests/                          ← 17 Form Requests
│   ├── Models/                                ← 10 modelos
│   │   ├── User.php           ← canAddTask(), getDashboardData(), roles
│   │   ├── Task.php           ← scopes, prioridades, hard delete
│   │   ├── Idea.php           ← resolve/reactivate, convertToTask()
│   │   ├── Project.php        ← getProgressPercentage()
│   │   ├── Box.php / Resource.php
│   │   ├── Subscription.php   ← upgradeToPremium(), hasExpired()
│   │   ├── Payment.php        ← process() simula 80%/20%
│   │   ├── AiConversation.php ← $timestamps = false
│   │   └── VoiceRecording.php
│   └── Policies/                              ← 5 policies (ownership)
├── database/
│   ├── migrations/            ← 16 migraciones
│   └── seeders/               ← RoleSeeder + UserSeeder (3 usuarios)
├── resources/
│   ├── css/app.css            ← Design system Flowly (tokens, animaciones)
│   ├── views/app.blade.php    ← Entrada HTML (fuentes bunny.net)
│   └── js/
│       ├── pages/             ← 36 paginas React
│       │   ├── welcome.tsx         ← Landing page (1100+ lineas)
│       │   ├── dashboard.tsx       ← Dashboard condicional free/premium
│       │   ├── tasks/              ← index, create, edit
│       │   ├── ideas/              ← index, create, edit
│       │   ├── projects/           ← index, show, create, edit
│       │   ├── boxes/              ← index, show, create, edit
│       │   ├── resources/          ← create, edit
│       │   ├── ai-chats/           ← Chat IA
│       │   ├── subscription/       ← Planes
│       │   ├── checkout/           ← Pago
│       │   ├── admin/              ← Panel admin (4 vistas)
│       │   ├── auth/               ← Login, registro, 2FA, etc.
│       │   └── settings/           ← Perfil, contrasena, apariencia, 2FA
│       ├── components/
│       │   ├── ui/                 ← 28 componentes shadcn/ui
│       │   ├── tutorial-chatbot.tsx ← Tour con spotlight
│       │   └── voice-recorder.tsx   ← MediaRecorder + Whisper
│       ├── types/                  ← TypeScript types (models, pages, admin)
│       ├── hooks/                  ← 7 custom hooks
│       └── layouts/                ← App (sidebar) + Auth (centered)
├── routes/
│   ├── web.php                ← Todas las rutas
│   └── settings.php           ← Rutas de configuracion
├── tests/Feature/             ← 27 archivos, 191 test cases
├── docs/
│   ├── manual-usuario.md
│   └── decisiones-tecnicas.md
├── Dockerfile                 ← Multi-stage build (Node + PHP)
├── docker-compose.yml
└── docker-entrypoint.sh       ← Migraciones + seed automaticos
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
php artisan test --filter=TaskControllerTest # Test especifico
php artisan test --coverage                  # Con cobertura
composer test                                # Lint + tests
```

### Cache
```bash
php artisan optimize:clear    # Limpia config, cache, vistas
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
- NO accede a /projects, /boxes, /resources, /ai-chats

**`premium_user`** — Acceso completo de usuario
- Tareas ilimitadas, proyectos, cajas, voz, IA

**`free_user`** — Acceso limitado
- Ideas ilimitadas, maximo 5 tareas pendientes simultaneas
- Sin proyectos, voz ni IA

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
GET/POST/PUT/DELETE  /tasks           Gestion de tareas
PATCH                /tasks/{id}/complete | /reopen
GET/POST/PUT/DELETE  /ideas           Gestion de ideas
PATCH                /ideas/{id}/resolve | /reactivate
GET                  /subscription    Ver suscripcion
GET/POST             /checkout        Pago simulado
POST                 /tutorial/complete  Marcar tutorial completado
```

### Premium (solo `premium_user`)
```
GET/POST/PUT/DELETE  /projects                    Proyectos
PATCH                /projects/{id}/complete
GET/POST/PUT/DELETE  /boxes                       Cajas
GET/POST             /boxes/{box}/resources       Recursos en cajas
GET/PUT/DELETE       /resources/{resource}        Editar/eliminar recurso
POST                 /voice/transcribe            Transcripcion Whisper
GET/POST/DELETE      /ai-chats                    Chat con IA
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

**191 test cases — 100% pasando**

| Area | Cobertura |
|------|-----------|
| Auth | Registro, login, verificacion email, reset password, 2FA |
| Tasks | CRUD, completar/reabrir, limite free, autorizacion |
| Ideas | CRUD, resolver/reactivar, autorizacion |
| Projects | CRUD, completar, ownership |
| Boxes/Resources | CRUD anidado, autorizacion |
| Checkout | Flujo exito/fallo, validacion tarjeta |
| Voice | Transcripcion, errores |
| AI Chat | Store, destroy, historial, control de roles |
| Admin | Dashboard, usuarios, pagos, suscripciones |
| Settings | Perfil, contrasena, 2FA |

Framework: **Pest 3** con helpers custom (`createAdmin()`, `createPremiumUser()`, `createFreeUser()`).

---

## Docker

```bash
docker compose build
docker compose up
# Acceder en http://localhost:8000
```

- **Multi-stage build**: Node 20 (frontend) + PHP 8.2 (backend)
- `docker-entrypoint.sh` ejecuta migraciones y seeders automaticamente
- Produccion conecta a TiDB Cloud Serverless via SSL

---

## Configuracion

### Variables de entorno principales (.env)

```env
APP_NAME=Flowly
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos (SQLite para dev)
DB_CONNECTION=sqlite

# Produccion: TiDB Cloud
# DB_CONNECTION=mysql
# DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
# DB_PORT=4000
# MYSQL_ATTR_SSL_CA=storage/app/tidb-ca.pem

# Sesion
SESSION_DRIVER=file

# IA (Groq gratuito, recomendado)
OPENAI_API_KEY=gsk_xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| Error 419 en formularios | `php artisan config:clear` + borrar cookies |
| SSL en OpenAI/Groq (Windows) | Configurar `curl.cainfo` y `openssl.cafile` en php.ini |
| RoleDoesNotExist | `php artisan migrate:fresh --seed` |
| database.sqlite no existe | `touch database/database.sqlite && php artisan migrate --seed` |
| Frontend no actualiza | Reiniciar `npm run dev` o Ctrl+Shift+R |
| Rate limit en chat IA | Verificar creditos de API key o usar Groq |

---

## Documentacion

| Documento | Descripcion |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificacion tecnica de cada decision |
| [docs/contexto-proyecto.md](docs/contexto-proyecto.md) | Contexto completo y estado del proyecto |
| [docs/guia-estilos.md](docs/guia-estilos.md) | Guia de estilos y design system |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para mas detalles.

---

**Samuel Ayllon** — Proyecto Intermodular 2o DAM
