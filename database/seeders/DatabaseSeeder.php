<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,  // primero los roles
            UserSeeder::class,  // luego los usuarios (necesitan roles)
        ]);
    }
}
