<?php

use App\Models\Project;
use App\Models\Task;
use App\Models\Idea;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Http::fake([
        '*/chat/completions' => Http::response([
            'choices' => [
                ['message' => ['content' => 'Respuesta de prueba de la IA.']],
            ],
        ]),
    ]);
});

// ======================== planDay ========================

it('premium user can call plan-day', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);
    Task::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'status' => 'pending',
        'priority' => 'high',
        'due_date' => now()->toDateString(),
    ]);

    $this->actingAs($user)
        ->postJson('/ai/plan-day')
        ->assertOk()
        ->assertJsonStructure(['output']);
});

it('plan-day returns message when no tasks', function () {
    $user = createPremiumUser();

    $response = $this->actingAs($user)
        ->postJson('/ai/plan-day')
        ->assertOk();

    expect($response->json('output'))->toContain('No tienes tareas pendientes');
});

it('free user cannot call plan-day', function () {
    $user = createFreeUser();

    $this->actingAs($user)
        ->postJson('/ai/plan-day')
        ->assertForbidden();
});

it('guest cannot call plan-day', function () {
    $this->postJson('/ai/plan-day')
        ->assertUnauthorized();
});

// ======================== clientSummary ========================

it('premium user can call client-summary', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-summary/{$project->id}")
        ->assertOk()
        ->assertJsonStructure(['output']);
});

it('free user cannot call client-summary', function () {
    $user = createFreeUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-summary/{$project->id}")
        ->assertForbidden();
});

it('premium user cannot summarize another users project', function () {
    $user = createPremiumUser();
    $otherUser = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-summary/{$project->id}")
        ->assertForbidden();
});

it('client-summary saves ai log', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-summary/{$project->id}")
        ->assertOk();

    $this->assertDatabaseHas('ai_logs', [
        'user_id' => $user->id,
        'project_id' => $project->id,
        'action_type' => 'summary',
    ]);
});

// ======================== clientUpdate ========================

it('premium user can call client-update', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);
    Task::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'status' => 'completed',
        'completed_at' => now(),
    ]);

    $this->actingAs($user)
        ->postJson("/ai/client-update/{$project->id}")
        ->assertOk()
        ->assertJsonStructure(['output']);
});

it('free user cannot call client-update', function () {
    $user = createFreeUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-update/{$project->id}")
        ->assertForbidden();
});

it('client-update saves ai log', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/ai/client-update/{$project->id}")
        ->assertOk();

    $this->assertDatabaseHas('ai_logs', [
        'user_id' => $user->id,
        'project_id' => $project->id,
        'action_type' => 'update',
    ]);
});

it('plan-day saves ai log', function () {
    $user = createPremiumUser();
    $project = Project::factory()->create(['user_id' => $user->id]);
    Task::factory()->create([
        'user_id' => $user->id,
        'project_id' => $project->id,
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->postJson('/ai/plan-day')
        ->assertOk();

    $this->assertDatabaseHas('ai_logs', [
        'user_id' => $user->id,
        'project_id' => null,
        'action_type' => 'plan_day',
    ]);
});
