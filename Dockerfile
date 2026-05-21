# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv
# ──────────────────────────────────────────────────────────────────────────────
# Nota sobre `check=skip=SecretsUsedInArgOrEnv`:
# El linter detecta "KEY" en `VITE_REVERB_APP_KEY` y lo marca como secreto.
# Es un falso positivo: ese valor es el identificador *público* de la app
# Reverb que se hornea en el bundle de cliente para que el navegador pueda
# suscribirse a canales WebSocket. El secreto real es `REVERB_APP_SECRET`,
# que se queda en el servidor y NO aparece en este Dockerfile.
# ──────────────────────────────────────────────────────────────────────────────
# ==============================================================================
# Dockerfile de ClientKosmos (Laravel + React) — FrankenPHP
# ==============================================================================
# Multi-stage:
#   1. deps     → librerías PHP (Composer)
#   2. frontend → React/TS compilado (Node + Vite)
#   3. final    → imagen ejecutable basada en FrankenPHP (Caddy + PHP 8.4)
#
# El servidor de aplicación es FrankenPHP. Traefik se encarga de TLS por
# delante; FrankenPHP escucha HTTP plano en :8000 (ver docker/Caddyfile).
#
# Para arrancar el proyecto (desarrollo): docker compose up --build
# ==============================================================================


# ==============================================================================
# ETAPA 1: Composer
# ==============================================================================
# Pineamos Alpine al minor explícitamente (alpine3.21 = Alpine 3.21 LTS).
# Sin pinear, las capas de paquetes apk varían entre builds según el estado
# del mirror oficial. Combinado con composer.lock y package-lock.json (PHP/JS)
# esto deja la imagen funcionalmente reproducible — los únicos floats que
# quedan son patches dentro del minor (CVE fixes), aceptables por diseño.
FROM php:8.4-cli-alpine3.21@sha256:9c1dd92c492546d1de23decef0d67280f3f9413942ff44ec119af6db642cd9f0 AS deps

RUN apk add --no-cache unzip
COPY --from=composer:2@sha256:b09bccd91a78fe8a9ab4b33d707b862e8fe54fec17782e32683ad2a69c46867d /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-scripts \
    --no-dev \
    --no-interaction \
    --optimize-autoloader

# Trim google/apiclient-services: el paquete trae cientos de servicios Google
# (~190 MB) y solo usamos Calendar + Oauth2. El script oficial de Google
# (Google\Task\Composer::cleanup) no corre con --no-scripts, así que limpiamos
# a mano. Mantenemos el subdir y el .php top-level de cada servicio en uso.
RUN cd vendor/google/apiclient-services/src && \
    find . -mindepth 1 -maxdepth 1 -type d \
        ! -name Calendar ! -name Oauth2 -exec rm -rf {} + && \
    find . -mindepth 1 -maxdepth 1 -type f -name '*.php' \
        ! -name Calendar.php ! -name Oauth2.php -delete


# ==============================================================================
# ETAPA 2: Frontend (Vite + React)
# ==============================================================================
FROM node:20-alpine3.21@sha256:eb0b81f6eb35ec5ecd1cab181801f93a6314127580b416e6e290363b724e1686 AS frontend

# Variables VITE_* que Vite hornea en el bundle JS en tiempo de build. Si no
# se pasan vía --build-arg (o via Railway que las inyecta automáticamente
# desde las env vars del servicio), Vite cae al valor por defecto del
# .env.example y el cliente quedará apuntando a localhost.
ARG VITE_APP_NAME=ClientKosmos
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME
# Promocionar a ENV para que `npm run build` (Vite) las vea como process.env.*
ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY \
    VITE_REVERB_HOST=$VITE_REVERB_HOST \
    VITE_REVERB_PORT=$VITE_REVERB_PORT \
    VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME

# PHP necesario porque Vite invoca artisan durante el build (Wayfinder).
# Incluimos todas las extensiones que los ServiceProviders cargan al
# arrancar Laravel: curl/iconv/intl/bcmath/gd/zip/simplexml son requeridas
# por Stripe, OpenAI, Google API, Carbon, etc. Sin ellas artisan falla con
# "extension X not found" antes de poder enumerar rutas para Wayfinder.
RUN apk add --no-cache php84 php84-tokenizer php84-mbstring php84-xml \
    php84-phar php84-openssl php84-dom php84-xmlwriter php84-ctype \
    php84-pdo php84-pdo_sqlite php84-fileinfo php84-session \
    php84-curl php84-iconv php84-intl php84-bcmath php84-gd \
    php84-zip php84-simplexml php84-sodium php84-opcache \
    && ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /app

COPY --from=deps /app/vendor vendor/

# composer.json / composer.lock son obligatorios en runtime: Laravel los lee
# para detectar paquetes y versión. Sin ellos, cualquier `artisan` revienta
# con "file_get_contents(/app/composer.json): Failed to open stream".
COPY composer.json composer.lock ./

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.ts tsconfig.json components.json ./
COPY resources/ resources/
COPY public/ public/
COPY artisan ./
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY app/ app/
COPY database/ database/

RUN mkdir -p bootstrap/cache storage/framework/sessions storage/framework/views \
    storage/framework/cache/data storage/logs \
    && chmod -R 775 bootstrap/cache storage

COPY .env.example .env

# Sobreescribir los VITE_REVERB_* en .env con los valores de los ARGs. Vite
# lee de .env durante `vite build`, y aunque process.env tendría precedencia,
# escribirlo al fichero garantiza que (a) cualquier mecanismo de lectura
# alternativo lo vea y (b) la capa rompe cache si los ARGs cambian, forzando
# rebuild cuando Railway actualiza las VITE_REVERB_* del servicio. Sin esto
# el bundle se quedaba con wsHost=localhost/key="" del .env.example.
RUN printf '\nVITE_REVERB_APP_KEY=%s\nVITE_REVERB_HOST=%s\nVITE_REVERB_PORT=%s\nVITE_REVERB_SCHEME=%s\n' \
    "$VITE_REVERB_APP_KEY" "$VITE_REVERB_HOST" "$VITE_REVERB_PORT" "$VITE_REVERB_SCHEME" >> .env

# Generamos APP_KEY de build (no se usa en runtime — Railway/compose inyecta
# la real) para que artisan pueda bootear sin warnings de cifrado.
RUN php artisan key:generate --force --no-interaction

# Pre-generamos los tipos de Wayfinder con verbosidad. Si el plugin de Vite
# llama después al mismo comando y todo está bien, simplemente regenera. Si
# algo falla, el error real (stack trace de Laravel) aparece aquí en lugar
# de quedarse oculto detrás del "Command failed" de Rollup.
RUN php artisan wayfinder:generate --with-form -v

RUN npm run build


# ==============================================================================
# ETAPA 3: Imagen final — FrankenPHP
# ==============================================================================
# dunglas/frankenphp ya trae Caddy embebido + PHP 8.4 + install-php-extensions.
# La imagen base alpine pesa ~70 MB; con extensiones + app debería quedar < 200 MB.
#
# Las cuatro imágenes base están pineadas a digest sha256 para que `docker build`
# del mismo SHA de git produzca capas idénticas hoy y dentro de tres años.
# Los bumps los gestiona Dependabot vía .github/dependabot.yml (revisión semanal).
FROM dunglas/frankenphp:1-php8.4-alpine@sha256:70d3fd963ab380a186e272db2d52e5c52f1767a4a3b7f65530b1a7c384a22b6f

# Instalamos extensiones PHP de runtime usando install-php-extensions (helper
# que ya viene en la imagen FrankenPHP). Usa apk virtual deps internamente y
# las purga al terminar — no quedan headers *-dev en la capa final.
RUN install-php-extensions \
        pdo_mysql \
        intl \
        zip \
        bcmath \
        opcache \
        pcntl

# curl es necesario para el HEALTHCHECK. bash facilita el entrypoint.
RUN apk add --no-cache bash curl

WORKDIR /app

# vendor (PHP sin dev) desde etapa 1
COPY --from=deps /app/vendor vendor/

# Código de la aplicación. .dockerignore filtra lo que no debe entrar.
COPY . .

# Frontend compilado desde etapa 2
COPY --from=frontend /app/public/build public/build/

# Configuración de Caddy/FrankenPHP
COPY docker/Caddyfile /etc/caddy/Caddyfile

# Permisos para storage y bootstrap/cache
RUN mkdir -p \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/logs \
        bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Entrypoint (migraciones, caches, etc.)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# /up es el healthcheck integrado en Laravel 11+.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
