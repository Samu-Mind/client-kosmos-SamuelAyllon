# Flowly — Guia de Estilos y Design System

> Referencia completa del sistema de diseno de Flowly. Todos los tokens, tipografia, componentes y patrones visuales utilizados en la aplicacion.

---

## 1. Identidad Visual

### Concepto
Flowly transmite **calma productiva**: una estetica natural y organica (tonos verdes y crema) que evita la agresividad visual de muchas apps de productividad. La paleta evoca tranquilidad y enfoque, ayudando al usuario a concentrarse sin sobreestimulacion.

### Logo
- Archivo: `resources/js/assets/logo.png`
- Uso: sidebar, landing page, pantallas de autenticacion

---

## 2. Paleta de Colores

### Modo Claro

| Token | Valor | Uso |
|-------|-------|-----|
| **Primary** | `#3A5A40` (verde bosque) | Botones principales, encabezados, acciones clave |
| **Background** | `#E9EDC9` (crema palido) | Fondo de pagina |
| **Card** | `#DAD7CD` (beige calido) | Superficies elevadas, tarjetas |
| **Muted** | `#CAD2C5` (gris verdoso) | Secciones secundarias, fondos suaves |
| **Foreground** | `#333333` (gris oscuro) | Texto principal |
| **Ring** | `#A1B285` (verde suave) | Anillos de foco (focus) |
| **Destructive** | `oklch(0.577 0.245 27.325)` | Acciones de eliminar/peligro |
| **Border** | `oklch(0.922 0.016 155.826)` | Bordes de componentes |
| **Accent** | `oklch(0.967 0.001 286.375)` | Elementos de acento |

### Modo Oscuro

| Token | Valor | Uso |
|-------|-------|-----|
| **Primary** | `#6b9b73` (verde claro) | Botones, encabezados |
| **Background** | `#1a1e1b` (casi negro verdoso) | Fondo de pagina |
| **Card** | `#242924` (oscuro con tinte verde) | Tarjetas |
| **Muted** | `#2e342f` (gris oscuro verdoso) | Secciones secundarias |
| **Foreground** | `#ffffff` | Texto principal |
| **Ring** | `#6b9b73` | Anillos de foco |

### Colores para graficas (Chart)

| Token | Valor |
|-------|-------|
| Chart 1 | `oklch(0.646 0.222 41.116)` |
| Chart 2 | `oklch(0.6 0.118 184.714)` |
| Chart 3 | `oklch(0.398 0.07 227.392)` |
| Chart 4 | `oklch(0.828 0.189 84.429)` |
| Chart 5 | `oklch(0.769 0.188 70.08)` |

### Sidebar

El sidebar tiene su propia capa de tokens que hereda de la paleta principal pero puede ajustarse independientemente:
- `--sidebar-background`, `--sidebar-foreground`
- `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`

---

## 3. Tipografia

### Familias tipograficas

| Familia | Uso | Pesos | CDN |
|---------|-----|-------|-----|
| **Nunito** | Encabezados (h1, h2, h3) | 400, 600, 700, 800 | bunny.net |
| **Open Sans** | Cuerpo de texto (p, spans) | 400, 600 | bunny.net |
| **Inter** | Botones, labels, UI | 400, 500, 600 | bunny.net |

### Aplicacion en CSS

```css
h1, h2, h3 { font-family: 'Nunito', sans-serif; }
body, p     { font-family: 'Open Sans', sans-serif; }
button, label, input, select, .ui-text { font-family: 'Inter', sans-serif; }
```

### Carga de fuentes
Las fuentes se cargan desde **bunny.net** (alternativa GDPR-friendly a Google Fonts) en `resources/views/app.blade.php`.

---

## 4. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-lg` | `1rem` (16px) | Tarjetas grandes, modales |
| `--radius-md` | `0.625rem` (10px) | Botones, inputs |
| `--radius-sm` | `0.375rem` (6px) | Badges, chips pequenos |

---

## 5. Componentes UI

### Base: shadcn/ui
Flowly utiliza **28 componentes** de shadcn/ui (basados en Radix UI + Tailwind CSS):

**Layout**: Card, Sidebar, Sheet, Breadcrumb
**Entrada**: Input, Label, Textarea, InputOTP, Checkbox, Select, Toggle, ToggleGroup
**Feedback**: Badge, Avatar, Alert, AlertDialog, Skeleton, Spinner
**Navegacion**: NavigationMenu, DropdownMenu, Tooltip, Collapsible
**Overlay**: Dialog, ScrollArea, Separator

### Componentes custom

| Componente | Archivo | Proposito |
|-----------|---------|-----------|
| TutorialChatbot | `components/tutorial-chatbot.tsx` | Tour guiado con spotlight, mascara SVG y efecto typewriter |
| VoiceRecorder | `components/voice-recorder.tsx` | Grabacion de audio con Web Audio API + envio a Whisper |
| AppSidebar | `components/app-sidebar.tsx` | Sidebar principal con items condicionales por plan |
| NavMain | `components/nav-main.tsx` | Items de navegacion con data-tutorial attributes |
| Heading | `components/heading.tsx` | Encabezado reutilizable con descripcion |
| InputError | `components/input-error.tsx` | Display de errores de formulario |
| AppearanceTabs | `components/appearance-tabs.tsx` | Selector de tema (claro/oscuro/sistema) |

---

## 6. Animaciones

### Definidas en `resources/css/app.css`

| Animacion | Duracion | Uso |
|-----------|----------|-----|
| `float` / `float-delayed` | 3s ease-in-out | Elementos flotantes sutiles |
| `bounce-subtle` | 2s ease-in-out | Rebote pequeno |
| `fade-in` | 0.6s ease-out | Aparicion general |
| `fade-in-up` | 0.6s ease-out | Aparicion con desplazamiento vertical |
| `fade-in-left` / `fade-in-right` | 0.6s ease-out | Aparicion lateral |
| `scale-in` | 0.5s ease-out | Aparicion con escala |
| `glow-pulse` | 2s ease-in-out | Pulso luminoso |
| `shimmer` | 2s linear infinite | Efecto shimmer (loading) |
| `gradient-shift` | 3s ease infinite | Fondo degradado animado |
| `orb-float-1` / `orb-float-2` | 8s/10s ease-in-out | Movimiento orbital (landing) |
| `typewriter` | -- | Revelado de texto caracter a caracter |
| `ping-slow` | 3s cubic-bezier | Pulso lento |
| `shine` | 2s ease-in-out infinite | Efecto brillante |

### Variantes con delay
```css
.animate-fade-in-up-delay-1  /* 0.1s delay */
.animate-fade-in-up-delay-2  /* 0.2s delay */
.animate-fade-in-up-delay-3  /* 0.3s delay */
.animate-fade-in-up-delay-4  /* 0.4s delay */
```

---

## 7. Efectos Especiales

### Glassmorphism
```css
.glass         /* backdrop-blur-md + bg white/10 + border white/20 */
.glass-strong  /* backdrop-blur-xl + bg white/15 + border white/30 */
```

### Glow
```css
.glow-primary     /* box-shadow verde suave */
.glow-primary-lg  /* box-shadow verde mas intenso */
.text-glow        /* text-shadow blanco */
```

### Hover lift
```css
.hover-lift  /* translateY(-2px) + sombra en hover, con transicion 0.3s */
```

### Border gradient
```css
.border-gradient  /* Borde degradado usando mask-composite */
```

---

## 8. Modo Oscuro

### Implementacion
- **Deteccion**: `prefers-color-scheme: dark` del sistema operativo
- **Persistencia**: localStorage + cookie para SSR
- **Aplicacion**: Clase `.dark` en `<html>`
- **Modos**: `light`, `dark`, `system`
- **Hook**: `useAppearance()` en `resources/js/hooks/use-appearance.tsx`

### Transicion
El fondo del body se define inline en `app.blade.php` para evitar flash:
- Claro: `#E9EDC9`
- Oscuro: `#1a1e1b`

---

## 9. Layouts

### App Layout (autenticado)
```
+------------------+----------------------------------+
| Sidebar          | App Header (breadcrumbs + user)  |
| - Logo           +----------------------------------+
| - Nav principal  | Content Area                     |
| - Nav premium    |                                  |
| - Nav footer     |                                  |
+------------------+----------------------------------+
```

- Sidebar colapsable con estado persistido en cookie
- Items de navegacion condicionales por rol/plan
- Breadcrumbs automaticos

### Auth Layout (no autenticado)
```
+------------------------------------------+
|            Centered Card                  |
|  +------------------------------------+  |
|  |  Logo                              |  |
|  |  Form (login/register/etc)         |  |
|  +------------------------------------+  |
+------------------------------------------+
```

### Landing Page (welcome.tsx)
- Hero con orbs animados de fondo
- Header responsive con menu movil
- Secciones: Hero, Features, Preview interactivo, Pricing, Footer
- +1100 lineas de componente

---

## 10. Patrones de UI

### Tarjetas de estadisticas (Dashboard)
Grid de 4 columnas con:
- Icono de Lucide
- Titulo (muted)
- Valor numerico grande
- Color condicional por estado

### Listas de entidades (Tasks, Ideas, Projects)
- Tabla/lista con acciones inline (editar, eliminar)
- Badge para estado/prioridad
- AlertDialog para confirmacion de eliminacion
- Estado vacio con mensaje + CTA

### Formularios
- Form Requests para validacion server-side
- Errores inline bajo cada campo (InputError component)
- Botones con estados de carga (disabled + spinner)

### Navegacion premium
- Items premium visibles pero deshabilitados para free users
- CTA de upgrade en dashboard para free users
- Badge "Premium" en sidebar

---

## 11. Iconos

**Libreria**: Lucide React v0.475

Uso consistente en toda la aplicacion:
- Navegacion: iconos en sidebar y breadcrumbs
- Estadisticas: icono por cada stat card
- Acciones: iconos en botones de editar, eliminar, completar
- Estados: iconos para estados vacios

---

## 12. Responsive Design

- **Mobile-first** con breakpoints de Tailwind
- Sidebar colapsable en pantallas pequenas (Sheet overlay)
- Menu movil en landing page
- Grid responsive: 1 col (mobile) -> 2 col (tablet) -> 4 col (desktop)
- Formularios de ancho completo en mobile

---

## 13. Accesibilidad

- ARIA labels en botones y tooltips
- Roles semanticos (Radix UI)
- Texto para screen readers (`sr-only`)
- Navegacion por teclado (Tab, Enter, Escape)
- Contraste de color AA+ en ambos modos
- Focus visible con ring token (`--ring`)

---

## 14. Referencia Rapida de Clases

### Colores mas usados
```
bg-primary text-primary-foreground     /* Botones principales */
bg-card text-card-foreground           /* Tarjetas */
bg-muted text-muted-foreground         /* Secciones secundarias */
bg-destructive text-destructive-foreground /* Eliminar */
bg-accent text-accent-foreground       /* Hover/seleccion */
```

### Espaciado comun
```
p-4 / p-6          /* Padding de tarjetas */
gap-4 / gap-6      /* Espaciado en grids */
space-y-4           /* Espaciado vertical en formularios */
mb-6 / mb-8         /* Margen inferior de secciones */
```

### Bordes
```
rounded-lg          /* 16px - tarjetas grandes */
rounded-md          /* 10px - botones, inputs */
rounded-sm          /* 6px - badges */
border border-border /* Borde estandar */
```
