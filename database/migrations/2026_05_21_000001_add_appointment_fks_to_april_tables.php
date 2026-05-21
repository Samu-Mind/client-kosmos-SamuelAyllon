<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Consolida las FKs `appointment_id` de tres tablas de abril que originalmente
 * declaraban la FK in-place y rompían el bootstrap sobre BD vacía, porque
 * `appointments` se crea en 2026_05_05_000005 (mes y medio después).
 *
 * Comportamiento:
 *  - Fresh install: las migraciones de abril crean ahora solo la columna; esta
 *    migración añade las FKs cuando `appointments` ya existe.
 *  - Entornos pre-existentes (Railway prod): las FKs ya están creadas por las
 *    migraciones originales — esta migración detecta su presencia vía try/catch
 *    y la deja como no-op.
 */
return new class extends Migration
{
    private const TABLES = ['notes', 'agreements', 'kosmo_briefings'];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            try {
                Schema::table($table, function (Blueprint $blueprint): void {
                    $blueprint->foreign('appointment_id')
                        ->references('id')->on('appointments')
                        ->nullOnDelete();
                });
            } catch (\Throwable) {
                // FK ya existe (entornos con migración original aplicada). Idempotente.
            }
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $table) {
            try {
                Schema::table($table, function (Blueprint $blueprint): void {
                    $blueprint->dropForeign(['appointment_id']);
                });
            } catch (\Throwable) {
                // FK no existe (rollback en entorno donde nunca se aplicó). Idempotente.
            }
        }
    }
};
