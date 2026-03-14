# Fase 2 — Ficha de cliente + Dashboard "Hoy"

Objetivo: rediseñar la experiencia principal del usuario alrededor de **clientes** y un panel diario muy simple.

## 1. Dashboard (`DashboardController.php` + página `dashboard.tsx`)

### 1.1 Backend

- [x] En `DashboardController@index`:
  - [x] Mantener el redirect a `admin.dashboard` para admins
  - [x] Cambiar `activeProjects` para que **free users también tengan clientes**:
        - Eliminar condición `isPremiumUser()`
        - Consultar proyectos activos para cualquier usuario (`projects()->active()->get(['id','name','color'])`)
  - [x] Añadir datos de "clientes en riesgo" (por ejemplo, próximos deadlines, tareas atrasadas)

### 1.2 Frontend (`resources/js/pages/dashboard.tsx`)

- [x] Rediseñar el panel para mostrar:
  - [x] Lista de 3–5 tareas críticas del día, agrupadas por cliente
  - [x] Sección de "clientes en riesgo" con breve resumen
  - [x] Botón "Planifica mi día" (visible solo para premium)
- [x] Asegurar que props usados coinciden con los devueltos por el controlador

## 2. Ficha de cliente (`/clients/{id}`)

### 2.1 Backend (ProjectController@show)

- [x] Cargar relaciones necesarias:
  - [x] `tasks` (pendientes y completadas, con prioridad y fecha)
  - [x] `ideas` vinculadas (`project_id`)
  - [x] `resources` del cliente
- [x] Preparar props para la ficha con 4 bloques:
  - [x] Contexto estático: name, description, status, color, brand_tone, service_scope, key_links, client_notes
  - [x] Timeline: últimas 5 tasks completadas + próximas 3 tasks pendientes
  - [x] Recursos: lista de recursos con type y url
  - [x] Notas/ideas: ideas activas y/o recientes

### 2.2 Frontend (`resources/js/pages/projects/show.tsx` → ficha cliente)

- [x] Adaptar la página para usar el nuevo shape de `project` y props auxiliares
- [x] Mostrar los 4 bloques claramente separados
- [x] Añadir botones IA (placeholders), aunque la lógica real llegue en Fase 3
- [x] Cambiar textos de "Proyecto" a "Cliente" a nivel de UI

## 3. Listado de clientes (`/clients`)

### 3.1 Backend (ProjectController@index)

- [x] Mantener el `withCount` de tareas y tareas pendientes
- [x] Asegurarse que funciona con el nuevo nombre de ruta `clients.index`

### 3.2 Frontend (`resources/js/pages/projects/index.tsx`)

- [x] Mostrar tarjetas de cliente con:
  - [x] Nombre + color dot
  - [x] Nº tareas pendientes (`pending_tasks_count`)
  - [x] Próximo deadline (si existe)
- [x] Añadir botón "+ Nuevo cliente"
- [x] Respetar límite de 1 cliente para usuarios free (mostrar modal de upgrade si lo exceden)

## 4. Vista de tareas (`/tasks`)

- [x] Adaptar vista para agrupar tareas por cliente:
  - [x] Sección por cliente con color dot y nombre
  - [x] Sección "Sin cliente" para tareas sin `project_id`
- [x] Mantener filtros básicos (por estado/cliente) si existen

## 5. Sidebar y navegación

- [x] Actualizar `app-sidebar.tsx` para:
  - [x] Renombrar "Proyectos" → "Clientes"
  - [x] Eliminar enlaces a `boxes`, `voice`, `ai-chats`
  - [x] Mantener acceso a dashboard, tareas, notas, clientes

## 6. Tipos TypeScript

- [x] En `resources/js/types/models/index.ts`:
  - [x] Eliminar exports de `box`, `voice-recording`, `ai-message`
  - [x] Añadir export de `ai-log` (cuando exista)
- [x] Actualizar interfaces de `project`, `task`, `idea`, `resource` para incluir nuevos campos
- [x] Asegurarse de que todas las páginas utilicen los tipos actualizados

## 7. Tests

- [x] Actualizar tests de dashboard para reflejar el nuevo comportamiento (free con clientes)
- [x] Añadir tests de ProjectController@show con nuevos datos de ficha
- [x] Ejecutar `php artisan test`
