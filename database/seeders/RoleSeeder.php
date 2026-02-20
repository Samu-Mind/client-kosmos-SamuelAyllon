<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de Spatie antes de crear roles
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'admin',        'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'premium_user', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'free_user',    'guard_name' => 'web']);
    }
}
