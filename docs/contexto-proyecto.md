# Flowly — Contexto Completo y Estado del Proyecto

> Documento de referencia con todo el contexto necesario para entender Flowly, su estado actual y las decisiones tomadas durante el desarrollo.

---

## 1. Que es Flowly

Flowly es una **plataforma web de productividad personal freemium** desarrollada como **Proyecto Intermodular de 2o DAM** por Samuel Ayllon. Actua como un centro de mando integrado donde el usuario gestiona tareas, ideas, proyectos, recursos y recibe asistencia de IA, todo desde una unica interfaz.

### Publico objetivo
- Estudiantes universitarios y de FP que necesitan organizar su carga academica
- Profesionales jovenes que quieren un hub de productividad sencillo y accesible
- Usuarios que prefieren una herramienta todo-en-uno frente a multiples apps separadas

### Propuesta de valor
Una plataforma que unifica gestion de tareas, captura de ideas, organizacion de recursos y asistencia IA en un solo lugar, con un modelo freemium que permite empezar gratis y escalar a premium cuando se necesite.

---

## 2. Estado Actual del Proyecto

### Resumen
- **Estado**: Proyecto completado y funcional
- **Tests**: 191 test cases — 100% pasando
- **Features**: Todas las features planificadas estan implementadas
- **Despliegue**: Docker multi-stage build listo para produccion con TiDB Cloud

### Features implementadas

| Feature | Estado | Plan |
|---------|--------|------|
| Autenticacion (login, registro, 2FA, verificacion email) | Completo | Todos |
| Gestion de tareas (CRUD + completar/reabrir) | Completo | Todos (5 max free) |
| Gestion de ideas (CRUD + resolver/reactivar) | Completo | Todos |
| Dashboard personal condicional | Completo | Todos |
| Tutorial interactivo (spotlight + chatbot) | Completo | Todos |
| Landing page | Completo | Publico |
| Checkout simulado (80/20) | Completo | Todos |
| Modo oscuro/claro | Completo | Todos |
| Proyectos con barra de progreso | Completo | Premium |
| Cajas de recursos | Completo | Premium |
| Transcripcion de voz (Whisper) | Completo | Premium |
| Asistente IA conversacional | Completo | Premium |
| Panel de administracion | Completo | Admin |

---

## 3. Arquitectura Tecnica

### Stack
- **Backend**: Laravel 12 + PHP 8.4 + Eloquent ORM
- **Frontend**: React 19 + TypeScript 5.7 + Inertia.js 2.3
- **UI**: shadcn/ui (28 componentes) + Tailwind CSS 4.0 + Lucide icons
- **Testing**: Pest 3
- **Build**: Vite 7 con React Compiler
- **Auth**: Laravel Fortify + Spatie Permission
- **IA**: openai-php/client (compatible con Groq y OpenAI)
- **BD**: SQLite (dev) / TiDB Cloud Serverless (prod)

### Patron SPA monolitica
Flowly usa **Inertia.js** como puente entre Laravel y React. No hay API REST: Laravel renderiza paginas React directamente. Esto simplifica:
- Autenticacion (sesiones nativas de Laravel)
- Validacion (Form Requests con errores automaticos en el frontend)
- Navegacion (sin router de cliente, Inertia maneja las transiciones)

### Modelos de datos (10)
- **User**: Hub central con relaciones a todo. Roles via Spatie. Metodos: `canAddTask()`, `getDashboardData()`, `isFreeUser()`, `isPremiumUser()`, `isAdmin()`
- **Task**: Prioridades (low/medium/high), status (pending/completed), due_date obligatoria, asignacion opcional a proyecto. Hard delete.
- **Idea**: Captura rapida. Status (active/resolved), source (manual/voice/ai_suggestion). Hard delete.
- **Project**: Agrupa tareas. Status (active/inactive/completed). Color personalizable. `getProgressPercentage()`.
- **Box**: Contenedor de recursos. Categoria opcional.
- **Resource**: Dentro de una Box. Tipos: link/document/video/image/other.
- **Subscription**: Plan del usuario (free/premium_monthly/premium_yearly). Control de expiracion.
- **Payment**: Transacciones simuladas. Solo almacena ultimos 4 digitos de tarjeta.
- **AiConversation**: Historial de chat IA. Role (user/assistant). Metadata con tokens usados.
- **VoiceRecording**: Grabaciones de voz. Ciclo: pending -> processing -> completed/failed.

### Seguridad (4 capas)
1. **Middleware de rutas**: `role:premium_user` y `role:admin` (Spatie)
2. **Policies**: TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy — solo el owner puede modificar
3. **Form Requests**: 17 clases de validacion para toda entrada de usuario
4. **Logica de negocio**: `canAddTask()` para limite free, bloqueo login sin rol asignado

---

## 4. Decisiones Tecnicas Clave

### SoftDeletes eliminado (Sesion 2)
Task e Idea usaban SoftDeletes inicialmente. Se elimino el trait porque:
- El proyecto no necesita papelera ni recuperacion de datos
- Simplifica las queries y el conteo de tareas
- La columna `deleted_at` permanece en la BD pero Eloquent la ignora

### Hard delete en frontend
Se usa `router.delete(url)` de `@inertiajs/react` que genera un HTTP DELETE real. No es un soft delete camuflado.

### Ruta home sin redirect
`GET /` renderiza `welcome` via Inertia, sin redirect a `/login`. Esto era necesario porque los tests de la landing page fallaban con redirect.

### AiConversation sin timestamps
`$timestamps = false` porque solo necesitamos `created_at` (se gestiona manualmente). No tiene `updated_at` porque los mensajes de chat son inmutables.

### Pago simulado
`Payment::process()` simula un gateway con 80% exito. Solo almacena ultimos 4 digitos (PCI-DSS). Transaction ID formato: `TXN_` + 16 caracteres aleatorios.

### IA context-aware
El system prompt del chat IA se genera dinamicamente con:
- Tareas pendientes del usuario
- Ideas activas
- Proyectos activos
- Estadisticas mensuales
Esto hace que la IA de respuestas personalizadas y relevantes.

### Groq como alternativa gratuita
La integracion IA soporta tanto OpenAI como Groq (14.400 req/dia gratis). El cambio es transparente: solo se cambian las variables `OPENAI_BASE_URL` y `OPENAI_API_KEY` en `.env`.

---

## 5. Enums del Sistema

Referencia rapida de todos los valores enum validos:

| Modelo | Campo | Valores |
|--------|-------|---------|
| Task | status | `pending`, `completed` |
| Task | priority | `low`, `medium`, `high` |
| Project | status | `active`, `inactive`, `completed` |
| Idea | status | `active`, `resolved` |
| Idea | source | `manual`, `voice`, `ai_suggestion` |
| Idea | priority | `low`, `medium`, `high` |
| Subscription | plan | `free`, `premium_monthly`, `premium_yearly` |
| Resource | type | `link`, `document`, `video`, `image`, `other` |
| Payment | status | `pending`, `completed`, `failed` |
| VoiceRecording | status | `pending`, `processing`, `completed`, `failed` |
| AiConversation | role | `user`, `assistant` |

---

## 6. Base de Datos

### Desarrollo y tests
- **Motor**: SQLite
- **Archivo**: `database/database.sqlite`
- **Migraciones**: 16 archivos
- **Seeders**: RoleSeeder (3 roles) + UserSeeder (3 usuarios de prueba)

### Produccion
- **Motor**: TiDB Cloud Serverless (MySQL-compatible)
- **Region**: EU Central 1 (Frankfurt)
- **Puerto**: 4000
- **SSL**: Certificado ISRG Root X1 en `storage/app/tidb-ca.pem` (en .gitignore)
- **Conexion**: `DB_CONNECTION=mysql` + `MYSQL_ATTR_SSL_CA`

### Migraciones principales
1. users (base + 2FA + tutorial_completed_at + user_modified_at)
2. permission_tables (Spatie roles/permissions)
3. subscriptions (plan, status, started_at, expires_at)
4. payments (plan, amount, status, payment_method, transaction_id)
5. projects (name, description, status, color)
6. tasks (name, priority, status, due_date, completed_at, project_id, deleted_at)
7. ideas (name, priority, status, source)
8. boxes (name, description, category)
9. resources (name, url, type, box_id)
10. ai_conversations (role, message, metadata, created_at)
11. voice_recordings (file_path, transcription, status, duration, error_message)

---

## 7. Testing

### Framework
Pest 3 con plugin Laravel. Cada test usa `RefreshDatabase` y helpers custom:
- `createAdmin()`: Usuario admin con rol
- `createPremiumUser()`: Usuario premium con suscripcion de 30 dias
- `createFreeUser()`: Usuario free con suscripcion gratuita
- `ensureRolesExist()`: Garantiza que los roles Spatie existen

### Estructura (27 archivos, 191 test cases)
- **Auth**: Login, registro, verificacion email, reset password, 2FA, confirmacion
- **CRUD**: Tasks, Ideas, Projects, Boxes, Resources
- **Autorizacion**: Roles, ownership, limites free
- **Funcionalidades**: Checkout, voz, IA, tutorial
- **Admin**: Dashboard, usuarios, pagos, suscripciones
- **Settings**: Perfil, contrasena, 2FA

### Ejecucion
```bash
php artisan test                    # Todos
php artisan test --filter=TaskC...  # Especifico
composer test                       # Lint + tests
```

---

## 8. Despliegue

### Docker
Multi-stage build:
1. **Stage 1 (Node 20)**: `npm ci && npm run build` — genera assets en `/app/public/build`
2. **Stage 2 (PHP 8.2)**: Instala extensiones PHP, copia Composer deps y assets del Stage 1

`docker-entrypoint.sh`:
- Copia `.env.example` si no existe `.env`
- Genera `APP_KEY` si esta vacio
- Ejecuta `migrate --force` y `db:seed`
- Imprime credenciales de prueba en consola

### Produccion
- BD: TiDB Cloud Serverless con SSL
- Cert: `storage/app/tidb-ca.pem` (no commiteado)
- Variables sensibles: `OPENAI_API_KEY`, credenciales BD

---

## 9. Archivos Criticos

| Archivo | Proposito |
|---------|-----------|
| `resources/css/app.css` | Design system completo (tokens, animaciones, dark mode) |
| `resources/views/app.blade.php` | Entry point HTML, carga fuentes desde bunny.net |
| `resources/js/assets/logo.png` | Logo oficial de Flowly |
| `routes/web.php` | Todas las rutas con middleware |
| `config/services.php` | Configuracion OpenAI/Groq |
| `app/Models/User.php` | Logica central de roles, limites y dashboard |
| `app/Http/Controllers/AiChatController.php` | Integracion IA con context-aware prompts |
| `docker-entrypoint.sh` | Script de inicializacion del contenedor |
| `storage/app/tidb-ca.pem` | Cert SSL TiDB (NO commitear) |

---

## 10. Cronologia del Desarrollo

El proyecto se desarrollo iterativamente en sesiones, cada una anadiendo capas de funcionalidad:

1. **Sesion 1**: Setup inicial, modelos base, autenticacion Fortify, roles Spatie
2. **Sesion 2**: CRUD de tareas e ideas, eliminacion de SoftDeletes, limite free
3. **Sesion 3**: Proyectos, cajas de recursos, checkout simulado
4. **Sesion 4**: Transcripcion de voz (Whisper), asistente IA conversacional
5. **Sesion 5**: Dashboard condicional, tutorial interactivo, landing page
6. **Sesion 6**: Panel admin, design system Flowly, dark mode
7. **Sesion 7**: Testing exhaustivo (191 test cases), Docker, documentacion
8. **Sesion 8**: Pulido final, correccion de imports, configuracion MySQL/TiDB
