<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Definición de permisos por dominio ────────────────────────────────
        $permissions = [
            // Admin
            'panel.admin',
            'users.impersonate',

            // Owner — gestión de clínica y equipo
            'clinic.manage',
            'clinic.team.invite',
            'clinic.team.manage',
            'clinic.patients.view-all',   // configurable por owner
            'clinic.metrics.view',

            // Owner + Professional — gestión clínica diaria
            'patients.create',
            'patients.read',
            'patients.update',
            'patients.delete',
            'appointments.create',
            'appointments.read',
            'appointments.update',
            'appointments.delete',
            'invoices.create',
            'invoices.read',
            'invoices.update',
            'invoices.delete',
            'video.manage',               // iniciar y gestionar videollamada
            'video.join',                 // unirse a videollamada
            'transcriptions.read',
            'kosmo.use',
            'messages.send',
            'messages.read',

            // Patient — portal propio
            'appointments.book',
            'invoices.own.read',
            'consents.sign',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ── Asignación de permisos a roles ────────────────────────────────────
        $admin = Role::findByName('admin');
        $admin->syncPermissions([
            'panel.admin',
            'users.impersonate',
        ]);

        $owner = Role::findByName('owner');
        $owner->syncPermissions([
            'clinic.manage',
            'clinic.team.invite',
            'clinic.team.manage',
            'clinic.patients.view-all',
            'clinic.metrics.view',
            'patients.create',
            'patients.read',
            'patients.update',
            'patients.delete',
            'appointments.create',
            'appointments.read',
            'appointments.update',
            'appointments.delete',
            'invoices.create',
            'invoices.read',
            'invoices.update',
            'invoices.delete',
            'video.manage',
            'video.join',
            'transcriptions.read',
            'kosmo.use',
            'messages.send',
            'messages.read',
        ]);

        $professional = Role::findByName('professional');
        $professional->syncPermissions([
            'patients.create',
            'patients.read',
            'patients.update',
            'patients.delete',
            'appointments.create',
            'appointments.read',
            'appointments.update',
            'appointments.delete',
            'invoices.create',
            'invoices.read',
            'invoices.update',
            'invoices.delete',
            'video.manage',
            'video.join',
            'transcriptions.read',
            'kosmo.use',
            'messages.send',
            'messages.read',
        ]);

        $patient = Role::findByName('patient');
        $patient->syncPermissions([
            'appointments.book',
            'invoices.own.read',
            'consents.sign',
            'messages.send',
            'messages.read',
            'video.join',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
