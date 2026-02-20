<?php

namespace Database\Seeders;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ──────────────────────────────────────────────
        $admin = User::factory()->create([
            'name'  => 'Admin Flowly',
            'email' => 'admin@flowly.test',
        ]);

        $admin->assignRole('admin');

        Subscription::create([
            'user_id'    => $admin->id,
            'plan'       => 'premium_monthly',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);

        // ── Premium user ───────────────────────────────────────
        $premium = User::factory()->create([
            'name'  => 'Premium User',
            'email' => 'premium@flowly.test',
        ]);

        $premium->assignRole('premium_user');

        Subscription::create([
            'user_id'    => $premium->id,
            'plan'       => 'premium_monthly',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);

        // ── Free user ──────────────────────────────────────────
        $free = User::factory()->create([
            'name'  => 'Free User',
            'email' => 'free@flowly.test',
        ]);

        $free->assignRole('free_user');

        Subscription::create([
            'user_id'    => $free->id,
            'plan'       => 'free',
            'status'     => 'active',
            'started_at' => now(),
            'expires_at' => null,
        ]);
    }
}
