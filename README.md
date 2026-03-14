# Flowly

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

**Flowly** es una plataforma web freemium pensada para **freelancers que gestionan varios clientes a la vez**. Cada cliente tiene su propia ficha con tareas, notas, recursos y contexto, de modo que al cambiar de cliente retomas justo donde lo dejaste.

### Que problema resuelve

La fragmentacion de herramientas (una app para tareas, otra para notas, otra para enlaces) genera:
- **Perdida de contexto**: al saltar de un cliente a otro se pierden detalles cruciales.
- **Informacion dispersa**: notas sueltas, enlaces en marcadores, tareas sin vincular a quien pertenecen.
- **Falta de vision diaria**: no hay un lugar que muestre "que tengo que hacer hoy y para quien".

Flowly unifica estas necesidades en fichas de cliente con:

- **Clientes** como unidad central: cada cliente agrupa tareas, notas e ideas, y recursos
- **Tareas** con prioridades, fechas de vencimiento y vinculacion a cliente
- **Notas e ideas** para captura rapida, ligadas a un cliente
- **Recursos** (enlaces, documentos, videos) organizados dentro de cada ficha *(Solo)*
- **IA contextual** con 3 acciones inteligentes: resumen de cliente, sugerencia de siguientes pasos y redaccion de emails *(Solo)*
- **Panel Hoy** que muestra todas las tareas del dia agrupadas por cliente

---

## Modelo Freemium

| Plan | Precio | Clientes | Tareas | Notas | Recursos | IA |
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
- Gestor de notas/ideas sin limite — CRUD + resolver/reactivar
- Panel Hoy con tareas del dia agrupadas por cliente
- Checkout y suscripcion simulada (80% exito / 20% fallo)
- Dashboard personal con datos reales condicional por plan
- Tutorial interactivo con tour guiado (spotlight + chatbot) para nuevos usuarios
- Landing page completa (hero, features, pricing, footer)
- Modo oscuro/claro con persistencia

### Solo (Premium)
- Clientes ilimitados
- Tareas ilimitadas
- Recursos por cliente (enlaces, documentos, videos, imagenes)
- IA contextual — 3 acciones por cliente:
  - `planDay`: planifica tu dia con la informacion de todos tus clientes
  - `clientSummary`: resume el estado actual de un cliente
  - `clientUpdate`: redacta un email de seguimiento para un cliente

### Admin
- Dashboard con estadisticas globales
- Gestion de usuarios (lista paginada + detalle + eliminacion)
- Historial de pagos con resumen de ingresos
- Control de suscripciones con distribucion por plan

---

## Fases del Desarrollo

El proyecto se desarrollo en 4 fases incrementales:

| Fase | Descripcion | Estado |
|------|-------------|--------|
| **Fase 1** | Restructuracion backend: "Proyectos" → "Clientes", eliminacion de Cajas/Voz/Chat, limpieza de rutas y modelos | ✅ |
| **Fase 2** | Ficha de cliente completa (tareas + notas + recursos en una sola vista) y dashboard "Panel Hoy" | ✅ |
| **Fase 3** | IA contextual con 3 endpoints: plan-day, client-summary, client-update (Groq/OpenAI) | ✅ |
| **Fase 4** | Pulido, landing page, precios actualizados (11,99/119 €), datos demo en seeders, README | ✅ |

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
Groq API Key (gratuita) o OpenAI API Key — para IA contextual
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

Esto crea 3 usuarios de prueba con datos demo: clientes, tareas, notas y recursos.

### 5. Variables de entorno opcionales (IA contextual)
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

| Rol | Email | Password | Datos demo |
|-----|-------|----------|------------|
| Admin | admin@flowly.test | password | — |
| Premium (Solo) | premium@flowly.test | password | 3 clientes, tareas, notas, recursos |
| Free | free@flowly.test | password | 1 cliente, 3 tareas, 1 nota |

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
| openai-php/client | 0.19 | Integracion IA contextual (Groq/OpenAI) |
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

| Entorno | Motor |
|---------|-------|
| Desarrollo / Tests | SQLite (cero configuracion) |
| Produccion | TiDB Cloud Serverless (MySQL-compatible, port 4000, SSL) |

### Integraciones IA

| Servicio | Uso | Plan gratuito |
|---------|-----|---------------|
| Groq (recomendado) | IA contextual — Llama 3.3 70B | 14.400 req/dia |
| OpenAI GPT | IA contextual alternativa | De pago |

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
- **Clientes = Projects**: internamente el modelo se llama `Project`, las URLs usan `/clients` y la UI dice "Clientes"
- **Hard delete** en Task e Idea (SoftDeletes eliminado)
- **Limite de tareas free**: `User::canAddTask()` cuenta tareas con `status='pending'`
- **Pago simulado**: `Payment::process()` con 80% exito, almacena solo ultimos 4 digitos de tarjeta
- **IA contextual**: 3 endpoints que leen tareas, notas y recursos del cliente para generar respuestas utiles
- **Ruta home**: `inertia('welcome')` sin redirect a login (requerido por tests)

---

## Estructura del Proyecto

```
flowly/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── TaskController.php
│   │   │   ├── IdeaController.php
│   │   │   ├── ProjectController.php         ← Fichas de cliente
│   │   │   ├── ResourceController.php        ← Recursos por cliente
│   │   │   ├── AiController.php              ← IA contextual (3 acciones)
│   │   │   ├── DashboardController.php       ← Panel Hoy
│   │   │   ├── SubscriptionController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── TutorialController.php
│   │   │   └── Admin/
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── AdminUserController.php
│   │   │       ├── AdminPaymentController.php
│   │   │       └── AdminSubscriptionController.php
│   │   └── Requests/                          ← Form Requests
│   ├── Models/
│   │   ├── User.php           ← canAddTask(), getDashboardData(), roles
│   │   ├── Task.php           ← scopes, prioridades, hard delete
│   │   ├── Idea.php           ← resolve/reactivate, convertToTask()
│   │   ├── Project.php        ← getProgressPercentage(), "cliente"
│   │   ├── Resource.php       ← Recursos vinculados a cliente
│   │   ├── Subscription.php   ← upgradeToPremium(), hasExpired()
│   │   ├── Payment.php        ← process() simula 80%/20%
│   │   └── AiLog.php          ← Registro de uso de IA
│   └── Policies/              ← 4 policies (ownership)
├── database/
│   ├── migrations/
│   └── seeders/               ← RoleSeeder + UserSeeder (3 usuarios con datos demo)
├── resources/
│   ├── css/app.css            ← Design system Flowly (tokens, animaciones)
│   └── js/
│       ├── pages/
│       │   ├── welcome.tsx         ← Landing page
│       │   ├── dashboard.tsx       ← Panel Hoy condicional free/premium
│       │   ├── tasks/              ← index, create, edit
│       │   ├── ideas/              ← index, create, edit (notas)
│       │   ├── projects/           ← index, show, create, edit (clientes)
│       │   ├── resources/          ← create, edit
│       │   ├── subscription/       ← Planes
│       │   ├── checkout/           ← Pago
│       │   ├── admin/              ← Panel admin (4 vistas)
│       │   ├── auth/               ← Login, registro, 2FA, etc.
│       │   └── settings/           ← Perfil, contrasena, apariencia, 2FA
│       ├── components/
│       │   ├── ui/                 ← Componentes shadcn/ui
│       │   └── tutorial-chatbot.tsx ← Tour con spotlight
│       ├── types/                  ← TypeScript types
│       ├── hooks/                  ← Custom hooks
│       └── layouts/                ← App (sidebar) + Auth (centered)
├── routes/
│   ├── web.php                ← Todas las rutas
│   └── settings.php           ← Rutas de configuracion
├── tests/Feature/             ← 156 test cases
├── docs/
│   ├── manual-usuario.md
│   ├── decisiones-tecnicas.md
│   ├── necesidad-y-justificacion.md
│   └── guia-estilos.md
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

**`premium_user`** — Acceso completo (plan Solo)
- Clientes ilimitados, tareas ilimitadas, recursos, IA contextual

**`free_user`** — Acceso limitado
- 1 cliente, maximo 5 tareas pendientes, notas ilimitadas
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
GET/POST/PUT/DELETE  /notes           Notas e ideas
PATCH                /notes/{id}/resolve | /reactivate
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

**156 test cases — 100% pasando**

| Area | Cobertura |
|------|-----------|
| Auth | Registro, login, verificacion email, reset password, 2FA |
| Tasks | CRUD, completar/reabrir, limite free, autorizacion |
| Notes | CRUD, resolver/reactivar, autorizacion |
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

# IA contextual (Groq gratuito, recomendado)
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

---

## Documentacion

| Documento | Descripcion |
|-----------|-------------|
| [docs/manual-usuario.md](docs/manual-usuario.md) | Manual de uso para el usuario final |
| [docs/decisiones-tecnicas.md](docs/decisiones-tecnicas.md) | Justificacion tecnica de cada decision |
| [docs/contexto-proyecto.md](docs/contexto-proyecto.md) | Contexto completo y estado del proyecto |
| [docs/guia-estilos.md](docs/guia-estilos.md) | Guia de estilos y design system |
| [docs/necesidad-y-justificacion.md](docs/necesidad-y-justificacion.md) | Necesidad y justificacion del proyecto |

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para mas detalles.

---

**Samuel Ayllon** — Proyecto Intermodular 2o DAM
