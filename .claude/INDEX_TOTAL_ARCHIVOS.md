# 📚 FLOWLY - ÍNDICE DE ARCHIVOS DEL PROYECTO

> Última actualización: Febrero 2026 — Estado real del proyecto en disco.

---

## 📁 `.claude/` — Documentación de Contexto

| Archivo | Propósito |
|---------|-----------|
| `PROJECT_STATE.md` | **Estado actual del proyecto** — qué está hecho y qué falta |
| `QUICK_REFERENCE.md` | Referencia rápida: roles, rutas, enums, errores comunes |
| `CONTEXTO_FLOWLY_PARA_CLAUDE.md` | Contexto completo para pasar a Claude en nuevas sesiones |
| `CHECKLIST_DESARROLLO.md` | Checklist de desarrollo y deployment |
| `INDEX_TOTAL_ARCHIVOS.md` | Este archivo — mapa del proyecto |
| `README.md` | Intro al proyecto |
| `setup-flowly.sh` | Script de instalación inicial |

---

## 📁 `app/` — Backend Laravel

### Controladores
```
app/Http/Controllers/
├── Controller.php                     ← Base (tiene AuthorizesRequests trait)
├── TaskController.php                 ← CRUD + complete + reopen
├── IdeaController.php                 ← CRUD + resolve + reactivate
├── ProjectController.php              ← CRUD (premium only)
├── BoxController.php                  ← CRUD (premium only)
├── ResourceController.php             ← Nested en box + standalone
├── SubscriptionController.php         ← index (planes + suscripción activa)
├── CheckoutController.php             ← index + store (pago simulado)
├── DashboardController.php            ← index
└── Admin/
    ├── AdminDashboardController.php   ← stats + recentPayments + recentUsers
    ├── AdminUserController.php        ← index + show + destroy
    ├── AdminPaymentController.php     ← index con summary
    └── AdminSubscriptionController.php← index con summary por plan
```

### Modelos
```
app/Models/
├── User.php             ← HasRoles + TwoFactorAuthenticatable
├── Subscription.php
├── Payment.php
├── Project.php
├── Task.php             ← SoftDeletes
├── Idea.php             ← SoftDeletes
├── Box.php
├── Resource.php
├── AiConversation.php   ← $timestamps = false (solo created_at)
└── VoiceRecording.php
```

### Form Requests
```
app/Http/Requests/
├── StoreTaskRequest.php / UpdateTaskRequest.php
├── StoreIdeaRequest.php / UpdateIdeaRequest.php
├── StoreProjectRequest.php / UpdateProjectRequest.php
├── StoreBoxRequest.php / UpdateBoxRequest.php
├── StoreResourceRequest.php / UpdateResourceRequest.php
└── CheckoutRequest.php
```

### Policies
```
app/Policies/
├── TaskPolicy.php
├── IdeaPolicy.php
├── ProjectPolicy.php
├── BoxPolicy.php
└── ResourcePolicy.php
```

---

## 📁 `database/` — Base de Datos

### Migraciones (13 tablas)
```
database/migrations/
├── create_users_table.php
├── add_two_factor_columns_to_users_table.php
├── create_permission_tables.php         ← Spatie
├── add_fields_to_users_table.php        ← ⚠️ VACÍA — pendiente
├── create_subscriptions_table.php
├── create_payments_table.php
├── create_projects_table.php
├── create_tasks_table.php
├── create_ideas_table.php
├── create_boxes_table.php
├── create_resources_table.php
├── create_ai_conversations_table.php
└── create_voice_recordings_table.php
```

### Seeders
```
database/seeders/
├── DatabaseSeeder.php     ← llama [RoleSeeder, UserSeeder]
├── RoleSeeder.php         ← crea 3 roles con firstOrCreate
└── UserSeeder.php         ← crea admin, premium, free con suscripción
```

### Factories
```
database/factories/
├── UserFactory.php
├── ProjectFactory.php     ← color siempre con valor (no optional)
├── TaskFactory.php
├── IdeaFactory.php
├── BoxFactory.php
├── ResourceFactory.php
├── SubscriptionFactory.php
└── PaymentFactory.php
```

---

## 📁 `tests/` — Tests Pest

```
tests/
├── Pest.php                                ← Setup global: withoutVite, RoleSeeder, helpers
├── Feature/
│   ├── TaskControllerTest.php              ← 16 tests ✅
│   ├── IdeaControllerTest.php              ← 12 tests ✅
│   ├── ProjectControllerTest.php           ← 15 tests ✅
│   ├── BoxControllerTest.php               ← 11 tests ✅
│   ├── ResourceControllerTest.php          ← 10 tests ✅
│   ├── CheckoutControllerTest.php          ← 7 tests ✅
│   ├── SubscriptionControllerTest.php      ← 4 tests ✅
│   ├── AdminControllerTest.php             ← 17 tests ✅
│   ├── DashboardTest.php                   ✅
│   ├── ExampleTest.php                     ✅
│   ├── Auth/                               ← 6 archivos Auth ✅
│   └── Settings/                           ← PasswordUpdate, ProfileUpdate, TwoFactor ✅
└── Unit/
    └── ExampleTest.php
```

**Total: 143 tests / 551 assertions — Todos pasando ✅**

---

## 📁 `resources/js/` — Frontend React

### Páginas existentes con implementación real
```
resources/js/pages/
├── welcome.tsx                    ⚠️ sin contenido Flowly
├── dashboard.tsx                  ⚠️ sin datos reales
├── auth/
│   ├── login.tsx                  ✅
│   ├── register.tsx               ✅
│   ├── two-factor-challenge.tsx   ✅
│   ├── forgot-password.tsx        ✅
│   ├── reset-password.tsx         ✅
│   ├── confirm-password.tsx       ✅
│   └── verify-email.tsx           ✅
└── settings/
    ├── profile.tsx                ✅
    ├── password.tsx               ✅
    ├── appearance.tsx             ✅
    └── two-factor.tsx             ✅
```

### Páginas placeholder (existen para pasar tests, sin UI real)
```
resources/js/pages/
├── tasks/index.tsx + edit.tsx
├── ideas/index.tsx + edit.tsx
├── projects/index.tsx + show.tsx
├── boxes/index.tsx + show.tsx
├── resources/create.tsx
├── subscription/index.tsx
├── checkout/index.tsx
└── admin/
    ├── dashboard.tsx
    ├── users/index.tsx + show.tsx
    ├── payments/index.tsx
    └── subscriptions/index.tsx
```

### Páginas aún no creadas (ni placeholder)
```
pages/tasks/create.tsx
pages/ideas/create.tsx
pages/projects/create.tsx + edit.tsx
pages/boxes/create.tsx + edit.tsx
pages/resources/edit.tsx
```

---

## 📁 `routes/web.php` — Rutas

```
Autenticadas (todos los roles):
  tasks.*        → TaskController
  ideas.*        → IdeaController
  subscription.* → SubscriptionController
  checkout.*     → CheckoutController

Premium (premium_user|admin):
  projects.*     → ProjectController
  boxes.*        → BoxController
  resources.*    → ResourceController

Admin:
  admin.dashboard           → AdminDashboardController
  admin.users.*             → AdminUserController
  admin.payments.index      → AdminPaymentController
  admin.subscriptions.index → AdminSubscriptionController
```

---

## 🔑 Credenciales de prueba
```
admin@flowly.test    / password  → admin
premium@flowly.test  / password  → premium_user
free@flowly.test     / password  → free_user
```

## ⚡ Comandos frecuentes
```bash
php artisan serve                  # Backend
npm run dev                        # Frontend Vite
php artisan migrate:fresh --seed   # Resetear BD
php artisan test                   # Todos los tests
php artisan test --filter NombreTest  # Un test específico
```