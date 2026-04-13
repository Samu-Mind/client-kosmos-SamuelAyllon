# Skill: Generate Component Stories

**Description:** Analiza un componente React y genera un archivo de historias completo con estados mockeados y pruebas de interacción.

## Steps
1. **Análisis de Props**: Lee el archivo `.tsx` e identifica la interfaz de Props.
2. **Mocking**: Genera datos de ejemplo realistas para cada prop. Si hay fechas, usa fechas fijas; si hay IDs, usa UUIDs legibles.
3. **Estructura del Archivo**:
   - Importa el componente y sus tipos.
   - Configura el `meta` con el título basado en la ruta de la carpeta (ej. `Components/UI/Button`).
   - Crea la historia `Primary`.
4. **Interacciones (Opcional)**: Si el componente tiene eventos `onClick` o `onChange`, añade una `play function` usando `@storybook/test` para simular un clic o entrada de texto básica.

## Constraints
- No uses `any` en los archivos de historias.
- Si el componente usa `framer-motion` o Context Providers, añade los decoradores necesarios.
