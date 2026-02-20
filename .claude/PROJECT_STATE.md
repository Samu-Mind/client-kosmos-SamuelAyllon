# Flowly — Estado Real del Proyecto
> Última actualización: 2026-02-20. Actualizar este archivo al completar cada sección.

---

## Resumen de progreso

| Capa | Estado |
|------|--------|
| Migraciones | ✅ Todas creadas (13 tablas) |
| Modelos Eloquent | ✅ Todos creados (10 modelos) |
| Seeders | ✅ RoleSeeder + UserSeeder + DatabaseSeeder — 3 usuarios, 3 roles, 3 suscripciones |
| Rutas | ✅ Todas creadas (tasks, ideas, projects, boxes, resources, subscription, checkout, admin) |
| Controladores features | ✅ TaskController, IdeaController, ProjectController, BoxController, ResourceController, SubscriptionController, CheckoutController |
| Controladores admin | ✅ AdminDashboardController, AdminUserController, AdminPaymentController, AdminSubscriptionController |
| Form Requests | ✅ StoreTask/Update, StoreIdea/Update, StoreProject/Update, StoreBox/Update, StoreResource/Update, CheckoutRequest |
| Policies | ✅ TaskPolicy, IdeaPolicy, ProjectPolicy, BoxPolicy, ResourcePolicy |
| Tests | ❌ No hay tests de features todavía |
| Frontend — Auth | ✅ Páginas login, register, 2FA, forgot-password (Fortify) |
| Frontend — Settings | ✅ Páginas profile, password, appearance, two-factor |
| Frontend — Dashboard | ⚠️ Página básica existe, sin datos reales |
| Frontend — Features | ❌ No hay páginas para tasks, ideas, projects, etc. |
| Frontend — Landing | ⚠️ welcome.tsx existe pero sin contenido Flowly |

---

## Backend — Detalle

### ✅ Migraciones creadas
- `create_users_table` (base Laravel)
- `add_two_factor_columns_to_users_table` (Fortify)
- `create_permission_tables` (Spatie)
- `add_fields_to_users_table` ⚠️ **VACÍA — pendiente de definir qué añadir**
- `create_subscriptions_table`
- `create_payments_table`
- `create_projects_table`
- `create_tasks_table`
- `create_ideas_table`
- `create_boxes_table`
- `create_resources_table`
- `create_ai_conversations_table`
- `create_voice_recordings_table`

### ✅ Modelos creados
Todos en `app/Models/`: User, Subscription, Payment, Project, Task, Idea, Box, Resource, AiConversation, VoiceRecording

### ✅ Seeders creados
En `database/seeders/`:
- `RoleSeeder` — crea roles: admin, premium_user, free_user (con firstOrCreate)
- `UserSeeder` — crea 3 usuarios con roles y Subscription asignada
- `DatabaseSeeder` — llama a [RoleSeeder, UserSeeder] en orden

### ✅ Controladores creados
En `app/Http/Controllers/`:
- `TaskController` — CRUD + complete + reopen (authorize via TaskPolicy)
- `IdeaController` — CRUD + resolve + reactivate (authorize via IdeaPolicy)
- `ProjectController` — CRUD completo (authorize via ProjectPolicy)
- `BoxController` — CRUD completo (authorize via BoxPolicy)
- `ResourceController` — create/store (nested bajo box) + edit/update/destroy (authorize via ResourcePolicy)
- `SubscriptionController` — index (muestra planes y suscripción activa)
- `CheckoutController` — index + store (pago simulado via Payment::process())

En `app/Http/Controllers/Admin/`:
- `AdminDashboardController` — stats globales + recent payments/users
- `AdminUserController` — index + show + destroy
- `AdminPaymentController` — index con resumen
- `AdminSubscriptionController` — index con resumen por plan

### ✅ Form Requests creados
En `app/Http/Requests/`:
- `StoreTaskRequest` / `UpdateTaskRequest`
- `StoreIdeaRequest` / `UpdateIdeaRequest`
- `StoreProjectRequest` / `UpdateProjectRequest`
- `StoreBoxRequest` / `UpdateBoxRequest`
- `StoreResourceRequest` / `UpdateResourceRequest`
- `CheckoutRequest`

### ✅ Policies creadas
En `app/Policies/`:
- `TaskPolicy` — update + delete (owner check)
- `IdeaPolicy` — update + delete (owner check)
- `ProjectPolicy` — view + update + delete (owner check)
- `BoxPolicy` — view + update + delete (owner check)
- `ResourcePolicy` — update + delete (owner check)

### ✅ Rutas creadas (`routes/web.php`)
```php
// Autenticadas (todos)
tasks.*          → TaskController (CRUD + complete + reopen)
ideas.*          → IdeaController (CRUD + resolve + reactivate)
subscription.*   → SubscriptionController (index)
checkout.*       → CheckoutController (index + store)

// Premium (premium_user|admin)
projects.*       → ProjectController (CRUD)
boxes.*          → BoxController (CRUD)
resources.*      → ResourceController (create/store nested en box; edit/update/destroy standalone)

// Admin (/admin/*)
admin.dashboard  → AdminDashboardController@index
admin.users.*    → AdminUserController (index, show, destroy)
admin.payments.* → AdminPaymentController@index
admin.subscriptions.* → AdminSubscriptionController@index
```

---

## Frontend — Detalle

### ✅ Componentes UI disponibles (shadcn/ui)
En `resources/js/components/ui/`:
alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible,
dialog, dropdown-menu, icon, input, input-otp, label, navigation-menu,
placeholder-pattern, select, separator, sheet, sidebar, skeleton, spinner,
toggle, toggle-group, tooltip

### ✅ Layouts disponibles
- `app-layout.tsx` — layout principal con sidebar
- `auth-layout.tsx` — layout de autenticación
- `layouts/app/app-sidebar-layout.tsx` — layout con sidebar lateral
- `layouts/app/app-header-layout.tsx` — layout con header
- `layouts/settings/layout.tsx` — layout de configuración

### ✅ Hooks disponibles
- `use-appearance.tsx` — tema claro/oscuro
- `use-mobile.tsx` — detección mobile
- `use-initials.tsx` — iniciales de nombre
- `use-clipboard.ts`, `use-current-url.ts`, `use-mobile-navigation.ts`, `use-two-factor-auth.ts`

### ✅ Páginas existentes
- `pages/welcome.tsx` — landing (pendiente de contenido Flowly)
- `pages/dashboard.tsx` — dashboard básico (pendiente de datos reales)
- `pages/auth/` — login, register, 2FA, reset, verify, forgot
- `pages/settings/` — profile, password, appearance, two-factor

### ❌ Páginas pendientes de crear
- `pages/tasks/index.tsx` + `create.tsx` + `edit.tsx`
- `pages/ideas/index.tsx` + `create.tsx` + `edit.tsx`
- `pages/projects/index.tsx` + `show.tsx` + `create.tsx` + `edit.tsx`
- `pages/boxes/index.tsx` + `show.tsx` + `create.tsx` + `edit.tsx`
- `pages/resources/create.tsx` + `edit.tsx`
- `pages/subscription/index.tsx`
- `pages/checkout/index.tsx`
- `pages/admin/dashboard.tsx`
- `pages/admin/users/index.tsx` + `show.tsx`
- `pages/admin/payments/index.tsx`
- `pages/admin/subscriptions/index.tsx`

---

## Tests pendientes
Crear en `tests/Feature/`:
- `TaskControllerTest.php`
- `IdeaControllerTest.php`
- `ProjectControllerTest.php`
- `BoxControllerTest.php`
- `ResourceControllerTest.php`
- `CheckoutControllerTest.php`
- `SubscriptionControllerTest.php`
- `AdminDashboardControllerTest.php`
- `AdminUserControllerTest.php`

---

## Próximo paso sugerido
1. Crear páginas React del frontend (empezar por `tasks/index.tsx` + `ideas/index.tsx`)
2. Actualizar `dashboard.tsx` con datos reales via `getDashboardData()`
3. Escribir tests Pest para los controladores

## Notas de implementación
- `ResourceController` usa rutas anidadas bajo `/boxes/{box}/resources` para create/store
- `CheckoutController` llama a `Payment::process()` que simula 80% éxito / 20% fallo
- Policies registradas automáticamente por Laravel (naming convention Model → Policy)
- `tasks.index` ordena: primero pendientes, luego completadas; dentro de cada grupo por prioridad DESC
