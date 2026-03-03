<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests cannot complete tutorial', function () {
    $response = $this->post('/tutorial/complete');

    $response->assertRedirect('/login');
});

test('authenticated users can complete tutorial', function () {
    $user = User::factory()->create(['tutorial_completed_at' => null]);

    $response = $this->actingAs($user)->post('/tutorial/complete');

    $response->assertRedirect();
    expect($user->fresh()->tutorial_completed_at)->not->toBeNull();
});

test('completing tutorial sets timestamp', function () {
    $user = User::factory()->create(['tutorial_completed_at' => null]);

    $this->actingAs($user)->post('/tutorial/complete');

    $user->refresh();
    expect($user->hasCompletedTutorial())->toBeTrue();
});

test('users can complete tutorial multiple times without error', function () {
    $user = User::factory()->create(['tutorial_completed_at' => now()]);

    $response = $this->actingAs($user)->post('/tutorial/complete');

    $response->assertRedirect();
});
