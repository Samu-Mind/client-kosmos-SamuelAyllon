# ==============================================================================
# Dockerfile multi-stage para ClientKosmos (Laravel 12 + React/Inertia + Vite)
# ==============================================================================
#
# Este Dockerfile usa dos etapas (multi-stage build):
#   1. "frontend" — compila los assets de React/TypeScript con Vite (Node.js)
#   2. Imagen final — ejecuta la aplicación PHP/Laravel con los assets ya listos
#
# Para construir y ejecutar, usa docker-compose (ver docker-compose.yml):
#   docker compose up --build
#
# ==============================================================================


# ==============================================================================
# STAGE 1: Compilar assets del frontend (React + Vite)
# ==============================================================================
# Usamos node:20-alpine como imagen base porque:
#   - Node 20 es LTS (soporte a largo plazo)
#   - Alpine es una distribución Linux mínima (~5MB), reduce el tamaño de imagen
FROM node:20-alpine AS frontend

# Directorio de trabajo dentro del contenedor temporal
WORKDIR /app

# Copiamos SOLO los archivos de dependencias primero.
# Docker cachea cada capa: si package.json no cambia, npm ci no se re-ejecuta,
# ahorrando tiempo en builds sucesivos.
COPY package.json package-lock.json ./

# npm ci (clean install) instala las dependencias de forma determinista
# usando exactamente las versiones del lockfile (más fiable que npm install)
RUN npm ci

# Copiamos los archivos de configuración que Vite necesita para compilar
#   - vite.config.ts: configuración del bundler (plugins, alias, etc.)
#   - tsconfig.json: configuración de TypeScript
#   - components.json: configuración de shadcn/ui (librería de componentes)
COPY vite.config.ts tsconfig.json components.json ./

# Copiamos el código fuente del frontend y los assets estáticos
#   - resources/ contiene los archivos React/TypeScript (.tsx), CSS, etc.
#   - public/ contiene imágenes, favicon, y otros archivos estáticos
COPY resources/ resources/
COPY public/ public/

# Vite necesita un archivo .env para leer VITE_APP_NAME durante el build.
# Usamos .env.example (sin secretos) porque solo necesita variables públicas (VITE_*).
COPY .env.example .env

# Ejecuta el build de producción de Vite:
#   - Transpila TypeScript a JavaScript
#   - Compila los componentes React
#   - Procesa Tailwind CSS (purga clases no usadas)
#   - Minifica y genera hashes en los nombres de archivo (cache busting)
#   - Output: public/build/ con el manifest y los bundles optimizados
RUN npm run build


# ==============================================================================
# STAGE 2: Imagen final — Aplicación PHP/Laravel
# ==============================================================================
# Usamos php:8.4-cli-alpine porque:
#   - PHP 8.4 es la versión requerida por composer.json (^8.4)
#   - cli (sin Apache/Nginx) porque Laravel tiene su propio servidor (artisan serve)
#   - Alpine para mantener la imagen ligera
FROM php:8.4-cli-alpine

# Instalamos dependencias del sistema operativo necesarias para PHP y Laravel:
#   - bash: shell para el script de entrypoint
#   - curl: necesario para descargas y health checks
#   - unzip: requerido por Composer para descomprimir paquetes
#   - libpng-dev: librería para procesamiento de imágenes PNG (extensión GD)
#   - oniguruma-dev: librería de expresiones regulares (extensión mbstring)
#   - libxml2-dev: parser XML (extensión xml)
#   - libzip-dev: compresión ZIP (extensión zip)
#   - icu-dev: soporte de internacionalización/Unicode (extensión intl)
#   - openssl-dev: cifrado SSL/TLS para conexiones seguras
#   - mysql-client: cliente MySQL para poder hacer health checks a la BD
RUN apk add --no-cache \
    bash \
    curl \
    unzip \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev \
    openssl-dev \
    mysql-client

# Instalamos las extensiones PHP que Laravel necesita:
#   - pdo + pdo_mysql: conexión a bases de datos MySQL/MariaDB
#   - mbstring: manejo de strings multibyte (UTF-8, emojis, etc.)
#   - xml: parsing de XML (necesario para PHPUnit, feeds, etc.)
#   - bcmath: operaciones matemáticas de precisión arbitraria
#   - zip: manejo de archivos ZIP
#   - intl: formateo de fechas, números y texto según locale
#   - opcache: caché de bytecode PHP (mejora rendimiento en producción)
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    xml \
    bcmath \
    zip \
    intl \
    opcache

# Copiamos el binario de Composer desde su imagen oficial.
# Composer es el gestor de dependencias de PHP (equivalente a npm para Node).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Igual que con npm, copiamos primero solo los archivos de dependencias
# para aprovechar la caché de capas de Docker.
COPY composer.json composer.lock ./

# Instalamos las dependencias PHP de producción:
#   --no-dev: excluye paquetes de desarrollo (tests, debug tools, etc.)
#   --no-scripts: evita ejecutar scripts post-install (artisan necesita .env)
#   --no-interaction: no pide input por consola
#   --optimize-autoloader: genera un classmap optimizado para producción
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --optimize-autoloader

# Copiamos TODO el código fuente de la aplicación al contenedor.
# El archivo .dockerignore excluye node_modules/, vendor/, .env, etc.
COPY . .

# Copiamos los assets compilados del Stage 1 (frontend) al directorio público.
# Esto sobrescribe el directorio public/build/ con los bundles de producción.
COPY --from=frontend /app/public/build public/build/

# Creamos los directorios que Laravel necesita en runtime para:
#   - sessions: almacenar sesiones de usuario (si se usa driver 'file')
#   - views: cachear las vistas Blade compiladas
#   - cache/data: caché de la aplicación
#   - logs: archivos de log
#   - bootstrap/cache: caché de configuración y rutas
# chmod 775: permite lectura/escritura al propietario y grupo
RUN mkdir -p \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/logs \
        bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiamos el script de inicio (entrypoint) y le damos permisos de ejecución.
# Este script se ejecuta ANTES del comando principal (CMD) cada vez que
# arranca el contenedor, configurando la BD, migraciones, etc.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exponemos el puerto 8000, que es el puerto por defecto de "artisan serve".
# Nota: EXPOSE es informativo; el mapeo real se hace en docker-compose.yml (ports).
EXPOSE 8000

# ENTRYPOINT: script que se ejecuta siempre al arrancar el contenedor.
# CMD: comando por defecto que se pasa al entrypoint como argumento.
# Juntos ejecutan: docker-entrypoint.sh php artisan serve --host=0.0.0.0 --port=8000
#   - --host=0.0.0.0: escucha en todas las interfaces (necesario dentro de Docker)
#   - --port=8000: puerto del servidor web de desarrollo de Laravel
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
