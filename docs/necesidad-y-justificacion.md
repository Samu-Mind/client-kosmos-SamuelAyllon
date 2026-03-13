# Flowly — Necesidad que Cubre y Justificacion

> Analisis del problema que Flowly resuelve, a quien va dirigido y por que existe este proyecto.

---

## 1. El Problema: Fragmentacion de la Productividad Personal

### Situacion actual del mercado
El ecosistema de herramientas de productividad esta **fragmentado**. Un estudiante o profesional joven tipico usa:

- **Todoist / Microsoft To Do** para tareas
- **Google Keep / Apple Notes** para ideas rapidas
- **Notion / Raindrop** para guardar enlaces y recursos
- **ChatGPT / Copilot** como asistente IA
- **Otter.ai / grabadora del movil** para notas de voz

Cada herramienta es buena en lo suyo, pero el resultado es un flujo de trabajo **disperso**:

| Problema | Impacto |
|----------|---------|
| Cambiar constantemente de app | Friccion cognitiva, perdida de concentracion |
| Ideas capturadas en sitios distintos | Se olvidan, no se conectan con tareas |
| Enlaces y recursos sin organizar | Se pierden en marcadores o chats |
| IA generica sin contexto personal | Respuestas irrelevantes, no conoce tus tareas |
| Multiples suscripciones | Coste elevado para funcionalidades basicas |

### El usuario afectado
Principalmente **estudiantes universitarios y de FP** y **profesionales jovenes** (20-30 anos) que:
- Gestionan multiples asignaturas/proyectos simultaneamente
- Necesitan capturar ideas de forma rapida (en clase, en el transporte)
- Acumulan recursos de aprendizaje (enlaces, PDFs, videos) sin sistema
- Quieren probar herramientas IA pero no pagar varias suscripciones
- Valoran la simplicidad sobre la configurabilidad extrema

---

## 2. La Solucion: Un Centro de Mando Integrado

### Propuesta de Flowly
Flowly consolida las 5 necesidades principales de productividad personal en **una sola plataforma**:

```
+-------------------+
|     FLOWLY        |
|                   |
|  Tareas --------+ |
|  Ideas ---------+ |
|  Proyectos -----+ |    Un solo login
|  Recursos ------+ |    Una sola interfaz
|  Voz -----------+ |    Un solo precio
|  IA ------------+ |
+-------------------+
```

### Mapeo problema-solucion

| Necesidad | Herramientas actuales | Solucion Flowly |
|-----------|----------------------|-----------------|
| Gestionar tareas con fechas y prioridades | Todoist, To Do | Gestor de tareas con due_date, prioridad y asignacion a proyecto |
| Capturar ideas al vuelo | Google Keep, notas | Ideas con captura rapida, clasificacion por fuente (manual/voz/IA) |
| Organizar tareas por contexto | Proyectos en Todoist (premium) | Proyectos con barra de progreso y colores |
| Guardar enlaces y recursos | Raindrop, marcadores | Cajas de recursos con tipos (link/doc/video/imagen) |
| Crear notas hablando | Otter.ai, grabadora | Dictado por voz con Whisper (crea tarea o idea directamente) |
| Asistencia IA personalizada | ChatGPT generico | Chat IA que conoce tus tareas, ideas y estadisticas |

### Diferenciadores clave

**1. Integracion nativa entre modulos**
Las tareas pueden pertenecer a proyectos. Las ideas se pueden convertir en tareas. El chat IA conoce tus tareas pendientes y proyectos activos. Todo esta conectado.

**2. IA con contexto real**
A diferencia de ChatGPT generico, el asistente de Flowly recibe automaticamente:
- Tus tareas pendientes y su prioridad
- Tus ideas activas
- Tus proyectos y su progreso
- Estadisticas de productividad del mes

Esto permite respuestas como: *"Veo que tienes 3 tareas de alta prioridad pendientes para manana. Te sugiero empezar por..."*

**3. Modelo freemium accesible**
- Plan gratuito funcional (tareas + ideas, suficiente para empezar)
- Premium a 9,99 EUR/mes (menos que Todoist Business + Notion + ChatGPT Plus por separado)
- Sin limites artificiales frustrantes (ideas ilimitadas en free)

**4. Simplicidad deliberada**
Flowly no intenta ser Notion (demasiado flexible) ni Jira (demasiado complejo). Es un gestor personal con exactamente las funcionalidades necesarias, sin mas.

---

## 3. Modelo de Negocio

### Estrategia freemium

**Plan Free — Enganche**
- 5 tareas pendientes simultaneas (suficiente para probar)
- Ideas ilimitadas (la captura rapida no debe tener limite)
- Dashboard basico

El limite de 5 tareas es deliberado: suficiente para validar la herramienta, pero que genera friccion natural cuando el usuario se compromete con ella.

**Plan Premium — Conversion**
- Tareas ilimitadas (la razon principal de upgrade)
- Proyectos (organizacion avanzada)
- Cajas de recursos (gestion del conocimiento)
- Voz e IA (funcionalidades diferenciadas)

### Precio competitivo

| Alternativa | Coste mensual |
|-------------|---------------|
| Todoist Business | 8 EUR |
| Notion Plus | 10 EUR |
| ChatGPT Plus | 20 EUR |
| **Total separado** | **38 EUR/mes** |
| **Flowly Premium** | **9,99 EUR/mes** |

Flowly no reemplaza al 100% cada herramienta individual, pero cubre el 80% de las necesidades por una fraccion del precio.

---

## 4. Contexto Academico

### Proyecto Intermodular 2o DAM
Flowly es el proyecto intermodular del ciclo de Desarrollo de Aplicaciones Multiplataforma. Cubre competencias de:

| Modulo | Competencia demostrada |
|--------|----------------------|
| **Desarrollo Web (servidor)** | Laravel 12, Eloquent, migraciones, seeders, middleware, policies, Form Requests |
| **Desarrollo Web (cliente)** | React 19, TypeScript, Inertia.js, componentes reutilizables, hooks custom |
| **Diseno de Interfaces** | Design system propio, accesibilidad, responsive, dark mode, animaciones |
| **Acceso a Datos** | Eloquent ORM, relaciones, scopes, TiDB Cloud, SQLite |
| **Sistemas de Gestion Empresarial** | Modelo freemium, checkout, suscripciones, panel admin |
| **Entornos de Desarrollo** | Docker, Vite, Pest, CI/CD ready |

### Requisitos intermodulares cubiertos
- Documentacion tecnica: `docs/decisiones-tecnicas.md`
- Manual de usuario: `docs/manual-usuario.md`
- Testing: 191 test cases con Pest
- Despliegue: Docker multi-stage build

---

## 5. Publico y Casos de Uso

### Caso 1: Estudiante de DAM
Maria tiene 6 asignaturas con entregas semanales. Usa Flowly para:
- Crear tareas con fecha de entrega por cada practica
- Agrupar tareas por asignatura en proyectos
- Guardar enlaces utiles (documentacion, tutoriales) en cajas de recursos
- Preguntar al asistente IA cuando se atasca con codigo

### Caso 2: Freelance junior
Carlos empieza como freelance de diseno. Usa Flowly para:
- Gestionar tareas de cada cliente en proyectos separados
- Capturar ideas de diseno por voz mientras camina
- Guardar inspiracion visual en cajas de recursos
- Revisar su dashboard para ver que tiene pendiente

### Caso 3: Opositor
Laura prepara oposiciones. Usa Flowly free para:
- 5 tareas con los temas que debe estudiar esta semana
- Ideas ilimitadas para anotar conceptos clave
- Marcar tareas completadas y ver su progreso

---

## 6. Metricas de Exito

### Tecnicas (ya conseguidas)
- 191 tests pasando al 100%
- Tiempo de carga < 2s con Vite
- Cobertura de todas las features planificadas
- Despliegue Docker funcional

### De producto (hipoteticas para un lanzamiento real)
- Conversion free-to-premium > 5%
- Retencion a 30 dias > 40%
- Tareas creadas por usuario activo > 10/semana
- Uso del chat IA > 3 conversaciones/semana entre premium

---

## 7. Conclusion

Flowly existe porque **la productividad personal no deberia requerir 5 apps y 3 suscripciones**. Al integrar tareas, ideas, proyectos, recursos, voz e IA en una unica plataforma con un modelo freemium accesible, Flowly reduce la friccion y permite al usuario centrarse en lo que importa: hacer cosas.

El proyecto demuestra que es viable construir una plataforma de productividad completa con tecnologias modernas (Laravel 12 + React 19 + IA) en el marco de un proyecto academico, manteniendo estandares profesionales de testing, seguridad y diseno.
