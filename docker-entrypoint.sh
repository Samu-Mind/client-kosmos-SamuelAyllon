#!/bin/bash
# ==============================================================================
# docker-entrypoint.sh — Script de arranque de ClientKosmos
# ==============================================================================
# Roles soportados (CONTAINER_ROLE):
#   init       → aplica migraciones, seeders y storage:link, luego exit 0.
#                Pensado como servicio one-shot que corre antes que web/worker.
#   web        → arranca FrankenPHP (default). Aplica bootstrap de BD si
#                SKIP_DB_BOOTSTRAP != "1" (compat con setups que no tienen el
#                servicio `init` aparte, p. ej. Railway con un solo `app`).
#   queue      → arranca `php artisan queue:work`.
#   scheduler  → arranca `php artisan schedule:work`.
#   reverb     → arranca `php artisan reverb:start`.
#
# Inmutabilidad del runtime:
#   No volcamos las variables de entorno del proceso al .env interno. Laravel
#   resuelve env() leyendo $_SERVER → $_ENV → getenv() ANTES de mirar el .env,
#   y config:cache captura los valores de proceso correctamente. El .env solo
#   se materializa de forma efímera en el caso especial de APP_KEY autogenerada
#   en desarrollo (key:generate exige un fichero donde escribir).
# ==============================================================================

# -e   → para al primer error
# -u   → variable no definida es error
# -o pipefail → un fallo dentro de un pipe propaga
set -euo pipefail

CONTAINER_ROLE="${CONTAINER_ROLE:-web}"

echo "==> Iniciando ClientKosmos (role=${CONTAINER_ROLE})..."

# ──────────────────────────────────────────────────────────────────────────────
# PASO 1: APP_KEY — fail-fast en producción, autogenerar efímera en desarrollo
# ──────────────────────────────────────────────────────────────────────────────
# APP_KEY cifra sesiones y cookies. Regenerarla en cada arranque invalida todas
# las sesiones existentes, así que NUNCA debe autogenerarse en producción.
if [ -z "${APP_KEY:-}" ]; then
    if [ "${APP_ENV:-production}" = "production" ]; then
        echo "==> ERROR: APP_KEY no está definida y APP_ENV=production." >&2
        echo "    En producción la clave debe inyectarse como variable de entorno (Railway, K8s, etc.)." >&2
        echo "    Para generar una clave estable y persistirla:" >&2
        echo "      docker run --rm samue45/client-kosmos:latest php artisan key:generate --show" >&2
        exit 1
    fi

    # En desarrollo: key:generate escribe en /app/.env, así que materializamos
    # uno mínimo desde el .env.example si no existe. Es la única escritura al
    # filesystem del contenedor que mantiene este entrypoint.
    if [ ! -f /app/.env ]; then
        cp /app/.env.example /app/.env
    fi

    echo "==> No hay APP_KEY (APP_ENV=${APP_ENV:-unset}). Generando una efímera para desarrollo..."
    php /app/artisan key:generate --force
    APP_KEY=$(grep "^APP_KEY=" /app/.env | cut -d '=' -f2-)
    export APP_KEY
    echo "==> APP_KEY generada: $APP_KEY"
    echo "    ⚠️  Esta clave es volátil. Para persistirla copia el valor a tu compose o .env del host."
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 2: Package discovery
# ──────────────────────────────────────────────────────────────────────────────
# composer install se ejecuta con --no-scripts en el Dockerfile, así que aquí
# disparamos manualmente el discover de paquetes (Inertia, Fortify, etc.).
echo "==> Descubriendo paquetes Laravel..."
php /app/artisan package:discover --ansi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 3: Esperar a la BD (todos los roles excepto reverb)
# ──────────────────────────────────────────────────────────────────────────────
# Reverb arranca un servidor WebSocket puro y no necesita BD durante el boot.
# El resto de roles abren conexiones MySQL muy pronto, así que mejor esperar
# aquí que dejar que el proceso reviente con un PDOException a los pocos ms.
if [ "${CONTAINER_ROLE}" != "reverb" ]; then
    if [ -z "${DB_HOST:-}" ] || [ -z "${DB_PORT:-}" ] || [ -z "${DB_USERNAME:-}" ] || [ -z "${DB_PASSWORD:-}" ]; then
        echo "==> ERROR: Faltan variables de entorno de base de datos." >&2
        echo "    Asegúrate de pasar DB_HOST, DB_PORT, DB_USERNAME y DB_PASSWORD al contenedor." >&2
        exit 1
    fi

    echo "==> Esperando a que la base de datos esté disponible..."
    # PHP/PDO en lugar de mysql-client (no incluido en la imagen final).
    # shellcheck disable=SC2016
    php -r '
        $host = $argv[1]; $port = $argv[2]; $user = $argv[3]; $pass = $argv[4];
        for ($i = 1; $i <= 30; $i++) {
            try {
                new PDO("mysql:host=$host;port=$port", $user, $pass, [PDO::ATTR_TIMEOUT => 2]);
                fwrite(STDOUT, "==> Base de datos disponible (intento $i)\n");
                exit(0);
            } catch (Throwable $e) {
                fwrite(STDOUT, "    Intento $i/30 — esperando...\n");
                sleep(2);
            }
        }
        fwrite(STDERR, "==> ERROR: la base de datos no respondió tras 30 intentos.\n");
        exit(1);
    ' "$DB_HOST" "$DB_PORT" "$DB_USERNAME" "$DB_PASSWORD"
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 4: Bootstrap de BD — migrate + seed
# ──────────────────────────────────────────────────────────────────────────────
# Lo ejecutan dos roles distintos:
#   - `init` (siempre)
#   - `web` cuando SKIP_DB_BOOTSTRAP != "1" (default), para mantener compat con
#     setups que no tienen un servicio `init` separado.
#
# Para separar bootstrap del runtime HTTP en local/Railway:
#   1. Levanta primero un contenedor con CONTAINER_ROLE=init (one-shot, exit 0).
#   2. Levanta el `app` con SKIP_DB_BOOTSTRAP=1.
#   El resultado es que las migraciones corren una sola vez por deploy,
#   desacopladas del proceso HTTP — un fallo parcial de migración no deja al
#   web container en bucle de restart sirviendo 500s.
should_bootstrap=0
case "${CONTAINER_ROLE}" in
    init)
        should_bootstrap=1
        ;;
    web)
        if [ "${SKIP_DB_BOOTSTRAP:-0}" != "1" ]; then
            should_bootstrap=1
        fi
        ;;
esac

if [ "$should_bootstrap" = "1" ]; then
    echo "==> Bootstrap de BD: migraciones + seeders..."

    # storage:link → public/storage symlink, para que los archivos públicos
    # subidos sean accesibles por URL. Idempotente con --force.
    php /app/artisan storage:link --force 2>/dev/null || true

    echo "==> Ejecutando migraciones..."
    php /app/artisan migrate --force

    # RoleSeeder + PermissionSeeder son OBLIGATORIOS en todos los entornos.
    # Usan firstOrCreate/syncPermissions, así que correrlos en cada deploy es
    # idempotente y captura nuevos permisos añadidos a la app.
    echo "==> Seeding roles y permisos (idempotente)..."
    php /app/artisan db:seed --class=RoleSeeder --force
    php /app/artisan db:seed --class=PermissionSeeder --force

    # Datos demo: solo en entornos no productivos y solo si la BD está vacía.
    # Doble gate (entorno + estado) para evitar que la contraseña "password"
    # de los seeders llegue a producción por accidente.
    if [ "${APP_ENV:-production}" = "production" ]; then
        echo "==> APP_ENV=production: saltando seeders demo por seguridad."
    else
        USER_COUNT=$(php /app/artisan tinker --execute='echo \App\Models\User::count();' 2>/dev/null | tail -n1 || echo "0")
        USER_COUNT="${USER_COUNT//[^0-9]/}"
        USER_COUNT="${USER_COUNT:-0}"
        if [ "${USER_COUNT}" = "0" ]; then
            echo "==> Primera instalación (${APP_ENV}). Ejecutando seeders demo..."
            php /app/artisan db:seed --force
        else
            echo "==> Ya hay datos (${USER_COUNT} usuarios). Saltando seeders demo."
        fi
    fi
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 5: Caches por contenedor (config / route / view)
# ──────────────────────────────────────────────────────────────────────────────
# Cada contenedor tiene su propio filesystem, así que cada uno regenera sus
# caches independientemente. config:cache lee env() de los $_SERVER/$_ENV del
# proceso (que docker-compose y Railway inyectan vía environment:), no necesita
# el .env interno. Esto cierra el último hilo de mutación del runtime.
#
# Solo cachea si APP_ENV=production. En desarrollo deja la config viva para que
# cambios en .env tengan efecto inmediato sin reiniciar el contenedor.
if [ "${CONTAINER_ROLE}" != "init" ] && [ "${APP_ENV:-production}" = "production" ]; then
    echo "==> Cacheando config / route / view (entorno: production)..."
    php /app/artisan config:cache
    php /app/artisan route:cache
    php /app/artisan view:cache
fi

# ──────────────────────────────────────────────────────────────────────────────
# Salida si es init
# ──────────────────────────────────────────────────────────────────────────────
# El rol init existe para hacer el bootstrap de BD una sola vez por deploy y
# salir limpiamente. docker-compose lo arranca con `condition:
# service_completed_successfully` desde los servicios que dependen del esquema.
if [ "${CONTAINER_ROLE}" = "init" ]; then
    echo "==> Init completado. Exit 0."
    exit 0
fi

# ──────────────────────────────────────────────────────────────────────────────
# Banner final
# ──────────────────────────────────────────────────────────────────────────────
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "==> ClientKosmos listo (entorno: production)"
else
    echo "==> ClientKosmos listo en http://localhost:8000"
    echo ""
    echo "    Usuarios de prueba:"
    echo "    admin@clientkosmos.test    / password  (admin)"
    echo "    natalia@clientkosmos.test  / password  (professional)"
    echo ""
fi

# ──────────────────────────────────────────────────────────────────────────────
# PASO 6: Arrancar el proceso según el rol
# ──────────────────────────────────────────────────────────────────────────────
# "exec" reemplaza este script por el proceso final para que reciba las
# señales de Docker/Railway (SIGTERM en deploy → shutdown limpio).
case "${CONTAINER_ROLE}" in
    web)
        exec "$@"
        ;;
    queue)
        echo "==> Arrancando queue worker..."
        # NOTA: no usamos --max-time ni --max-jobs. Railway tiene ON_FAILURE
        # como política de reinicio, así que un exit 0 limpio (que provocan
        # esos flags) deja el servicio en "Completed" y la cola muere. Sin
        # esos flags el worker solo sale por crash, que ON_FAILURE sí reinicia.
        # --timeout=30 mata jobs colgados (típico: SMTP que no responde).
        exec php /app/artisan queue:work \
            --tries=3 \
            --backoff=10 \
            --timeout=30 \
            --sleep=3
        ;;
    scheduler)
        echo "==> Arrancando scheduler..."
        exec php /app/artisan schedule:work
        ;;
    reverb)
        echo "==> Arrancando Reverb en :${PORT:-8080}..."
        exec php /app/artisan reverb:start \
            --host=0.0.0.0 \
            --port="${PORT:-8080}"
        ;;
    *)
        echo "==> ERROR: CONTAINER_ROLE='${CONTAINER_ROLE}' no reconocido." >&2
        echo "    Valores soportados: init | web | queue | scheduler | reverb" >&2
        exit 1
        ;;
esac
