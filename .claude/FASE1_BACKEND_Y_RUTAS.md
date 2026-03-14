# Fase 1 — Recortar y reestructurar (backend y rutas)

Objetivo: adaptar el backend y las rutas al nuevo modelo (clientes, recursos por cliente, IA con `AiLog`) **sin tocar aún el frontend**.

## 1. Migraciones

- [x] Crear migración `add_client_context_fields_to_projects_table`
  - [x] Añadir columnas: `brand_tone` (text, nullable), `service_scope` (text, nullable),
        `key_links` (json, nullable), `next_deadline` (date, nullable), `client_notes` (text, nullable)
- [x] Crear migración `add_project_id_to_ideas_table`
  - [x] Añadir `project_id` nullable con `->constrained('projects')->nullOnDelete()`
- [x] Crear migración `add_project_id_to_resources_table`
  - [x] Añadir `project_id` nullable con `->constrained('projects')->cascadeOnDelete()`
- [x] Crear migración `create_ai_logs_table`
  - [x] Campos: `user_id`, `project_id` nullable, `action_type` enum, `input_context` json nullable,
        `output_text` text, `created_at` timestamp useCurrent
- [x] Crear migración `drop_legacy_tables_and_columns`
  - [x] Quitar FK y columna `box_id` de `resources`
  - [x] Hacer `project_id` NOT NULL en `resources`
  - [x] Dropear tablas: `voice_recordings`, `ai_conversations`, `boxes`
- [x] Ejecutar migraciones y confirmar que pasan

## 2. Modelos

### 2.1 User.php

- [x] Eliminar relaciones: `boxes()`, `aiConversations()`, `voiceRecordings()`
- [x] Añadir relación: `aiLogs()` → `hasMany(AiLog::class)`
- [x] Crear método `canAddProject()`:
  - [x] Admin y premium: return true
  - [x] Free: máximo 1 project (`projects()->count() < 1`)

### 2.2 Project.php

- [x] Añadir fillable: `brand_tone`, `service_scope`, `key_links`, `next_deadline`, `client_notes`
- [x] Añadir casts: `key_links` → array, `next_deadline` → date
- [x] Añadir relaciones: `hasMany(Resource::class)`, `hasMany(Idea::class)`

### 2.3 Task.php

- [x] Eliminar relación `hasMany(VoiceRecording::class)`

### 2.4 Idea.php

- [x] Añadir relación `belongsTo(Project::class)` (nullable)
- [x] Añadir `project_id` a `$fillable`
- [x] Eliminar relación `hasMany(VoiceRecording::class)`

### 2.5 Resource.php

- [x] Cambiar relación `belongsTo(Box::class)` → `belongsTo(Project::class)`
- [x] Cambiar `$fillable`: sustituir `box_id` por `project_id`

### 2.6 Subscription.php

- [x] Actualizar `getPrice()` a 11.99/119.00 (manteniendo enums `premium_monthly` y `premium_yearly`)

### 2.7 AiLog.php (nuevo modelo)

- [x] Crear modelo `AiLog` con relaciones `belongsTo(User::class)` y `belongsTo(Project::class)` nullable
- [x] Configurar `$fillable` y `$casts` acordes a la tabla

## 3. Controladores

### 3.1 ProjectController.php

- [x] En `store()`: seguir creando con `status = 'inactive'` y `user_modified_at = now()`
- [x] Añadir validación de `canAddProject()` para usuarios free (antes de crear)
- [x] En `show()`: preparar datos completos de ficha de cliente (tasks, ideas, resources)
- [x] En `complete()`: decidir comportamiento (cambiar `status` a `completed` o similar) y corregir bug actual
- [x] Preparar transición de `projects.*` a `clients.*` (rutas y redirects)

### 3.2 ResourceController.php

- [x] Cambiar firma de `create()` y `store()` de `Box $box` a `Project $project`
- [x] Cambiar usos de `box` por `project` en lógica y vistas
- [x] En `update()`: arreglar bug añadiendo `$resource->update([...])`
- [x] Cambiar redirects de `boxes.show` a `clients.show`, usando `project_id`

## 4. Policies

### 4.1 ProjectPolicy.php

- [x] Añadir import `use App\Models\User;`
- [x] Confirmar métodos `view`, `update`, `delete` con check de ownership (`$user->id === $project->user_id`)

### 4.2 ResourcePolicy.php

- [x] Actualizar para comprobar ownership a través de `resource->project->user_id`

## 5. Rutas (`routes/web.php`)

- [x] Mover todo el `Route::resource('projects', ...)` al grupo `['auth', 'verified']` con path `clients`
  - [x] `Route::resource('clients', ProjectController::class)->parameters(['clients' => 'project']);`
  - [x] `Route::patch('clients/{project}/complete', ...)`
- [x] Eliminar rutas de `boxes` y `ai-chats`, `voice/transcribe`
- [ ] Añadir rutas de IA (`/ai/plan-day`, `/ai/client-summary/{project}`, `/ai/client-update/{project}`)
- [x] Añadir rutas de recursos bajo `clients/{project}/resources`
- [x] Mantener siempre middleware `['auth', 'verified']` y roles con underscore (`role:premium_user`)

## 6. Form Requests

- [x] Actualizar `StoreProjectRequest` y `UpdateProjectRequest` para incluir nuevos campos de ficha de cliente
- [x] Actualizar `StoreResourceRequest` / `UpdateResourceRequest` para usar `project_id` en vez de `box_id`

## 7. Tests

- [x] Actualizar tests de ProjectController (`projects` → `clients` y nuevos límites de free)
- [x] Actualizar tests de ResourceController (nuevo parent `project`)
- [x] Eliminar tests de Box, VoiceRecording y AiChat una vez que el código esté migrado
- [x] Ejecutar `php artisan test` y asegurar que todo pasa
