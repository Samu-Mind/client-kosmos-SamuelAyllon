# Fase 3 — IA contextual (3 botones)

Objetivo: sustituir el chat IA genérico por 3 acciones muy concretas apoyadas en un nuevo modelo `AiLog`.

## 1. Modelo y migración de AiLog

- [x] Verificar que la migración `create_ai_logs_table` ya existe (Fase 1)
- [x] Crear modelo `AiLog` (si no se creó) con:
  - [x] `belongsTo(User::class)`
  - [x] `belongsTo(Project::class)` nullable
  - [x] `$fillable`: `user_id`, `project_id`, `action_type`, `input_context`, `output_text`
  - [x] `$casts`: `input_context` → array

## 2. AiController (nuevo)

- [x] Crear `app/Http/Controllers/AiController.php`
- [x] Método `planDay()`:
  - [x] Recoge todas las tareas pendientes de todos los clientes
  - [x] Llama al proveedor IA usando `config('services.openai.*')`
  - [x] Devuelve lista priorizada de 3–5 acciones con justificación
  - [x] Guarda la petición y respuesta en `ai_logs`
- [x] Método `clientSummary(Project $project)`:
  - [x] Recoge datos de ficha (tareas, ideas, recursos, fechas)
  - [x] Genera resumen de 3–4 líneas
  - [x] Guarda en `ai_logs`
- [x] Método `clientUpdate(Project $project)`:
  - [x] Recoge tareas completadas, pendientes y notas recientes
  - [x] Genera texto tipo update profesional listo para email/Slack
  - [x] Guarda en `ai_logs`

## 3. Rutas IA

- [x] Añadir en `routes/web.php` (grupo premium_user):
  - [x] `POST /ai/plan-day` → `AiController@planDay`
  - [x] `POST /ai/client-summary/{project}` → `AiController@clientSummary`
  - [x] `POST /ai/client-update/{project}` → `AiController@clientUpdate`

## 4. Integración frontend

### 4.1 Dashboard

- [x] Añadir botón "Planifica mi día" que:
  - [x] Lanza petición POST a `/ai/plan-day`
  - [x] Muestra resultado (lista de 3–5 tareas) en un panel o modal
  - [x] Muestra modal de upgrade si el usuario es `free_user`

### 4.2 Ficha de cliente

- [x] Añadir botón "Recuérdame cómo está este cliente" que:
  - [x] Lanza POST a `/ai/client-summary/{id}`
  - [x] Muestra resumen en un panel o toast
- [x] Añadir botón "Prepárame un update para enviarle" que:
  - [x] Lanza POST a `/ai/client-update/{id}`
  - [x] Muestra texto para copiar/pegar en email/Slack

## 5. Eliminación del chat IA genérico

- [x] Asegurarse de que `AiChatController` y las rutas `ai-chats` ya no se usan
- [x] Eliminar vistas/pages relacionadas con chat libre
- [x] Confirmar que ninguna parte del frontend referencia aún `ai-chats`

## 6. Tests

- [x] Crear `tests/Feature/AiControllerTest.php` con al menos:
  - [x] `planDay_returns_prioritized_actions_for_premium_user`
  - [x] `clientSummary_returns_summary_for_given_project`
  - [x] `clientUpdate_returns_update_text_for_given_project`
  - [x] Tests de autorización (free_user no accede, premium_user sí)
- [x] Ejecutar `php artisan test`
