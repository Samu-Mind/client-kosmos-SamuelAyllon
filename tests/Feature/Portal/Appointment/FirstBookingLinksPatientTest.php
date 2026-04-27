<?php

use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\ProfessionalProfile;
use App\Models\Service;
use App\Models\User;
use App\Models\Workspace;

function makeVerifiedProfessionalWithWorkspace(): array
{
    ensureRolesExist();

    $professional = User::factory()->create(['tutorial_completed_at' => now()]);
    $professional->assignRole('professional');

    $profile = ProfessionalProfile::factory()->verified()->create([
        'user_id' => $professional->id,
    ]);

    $workspace = Workspace::factory()->create(['creator_id' => $professional->id]);
    $workspace->members()->attach($professional->id, [
        'role' => 'member',
        'is_active' => true,
        'joined_at' => now(),
    ]);

    Service::create([
        'workspace_id' => $workspace->id,
        'name' => 'Sesión inicial',
        'duration_minutes' => 50,
        'price' => 60,
        'is_active' => true,
    ]);

    return [$professional, $profile, $workspace];
}

function makeFreshlyRegisteredPatient(): User
{
    ensureRolesExist();

    $user = User::factory()->create([
        'email_verified_at' => now(),
        'tutorial_completed_at' => now(),
    ]);
    $user->assignRole('patient');

    PatientProfile::create([
        'user_id' => $user->id,
        'workspace_id' => null,
        'professional_id' => null,
        'is_active' => true,
        'status' => 'active',
    ]);

    return $user;
}

it('adopts the floating PatientProfile when a new patient opens the booking page', function () {
    [$professional, $profile, $workspace] = makeVerifiedProfessionalWithWorkspace();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0);

    $this->actingAs($patient)
        ->get(route('patient.appointments.book', [
            'professional_id' => $profile->id,
            'starts_at' => $startsAt->toIso8601String(),
        ]))
        ->assertOk();

    expect(PatientProfile::where('user_id', $patient->id)->count())->toBe(1);

    $linked = PatientProfile::where('user_id', $patient->id)->first();
    expect($linked->workspace_id)->toBe($workspace->id)
        ->and($linked->professional_id)->toBe($professional->id)
        ->and($linked->is_active)->toBeTrue()
        ->and($linked->status)->toBe('active');

    expect(CaseAssignment::where([
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'workspace_id' => $workspace->id,
    ])->count())->toBe(1);
});

it('is idempotent across repeated visits to the booking page', function () {
    [$professional, $profile, $workspace] = makeVerifiedProfessionalWithWorkspace();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0);
    $url = route('patient.appointments.book', [
        'professional_id' => $profile->id,
        'starts_at' => $startsAt->toIso8601String(),
    ]);

    $this->actingAs($patient)->get($url)->assertOk();
    $this->actingAs($patient)->get($url)->assertOk();
    $this->actingAs($patient)->get($url)->assertOk();

    expect(PatientProfile::where('user_id', $patient->id)->count())->toBe(1);
    expect(CaseAssignment::where('patient_id', $patient->id)->count())->toBe(1);
});

it('creates a separate PatientProfile per workspace when the patient books with another professional', function () {
    [$proA, $profileA, $workspaceA] = makeVerifiedProfessionalWithWorkspace();
    [$proB, $profileB, $workspaceB] = makeVerifiedProfessionalWithWorkspace();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0)->toIso8601String();

    $this->actingAs($patient)
        ->get(route('patient.appointments.book', ['professional_id' => $profileA->id, 'starts_at' => $startsAt]))
        ->assertOk();

    $this->actingAs($patient)
        ->get(route('patient.appointments.book', ['professional_id' => $profileB->id, 'starts_at' => $startsAt]))
        ->assertOk();

    $profiles = PatientProfile::where('user_id', $patient->id)->get();
    expect($profiles)->toHaveCount(2);
    expect($profiles->pluck('workspace_id')->all())
        ->toContain($workspaceA->id)
        ->toContain($workspaceB->id);

    expect(CaseAssignment::where('patient_id', $patient->id)->count())->toBe(2);
});

it('links the patient and creates the appointment on POST without duplicating profiles', function () {
    [$professional, , $workspace] = makeVerifiedProfessionalWithWorkspace();
    $service = Service::where('workspace_id', $workspace->id)->first();
    $patient = makeFreshlyRegisteredPatient();

    $startsAt = now()->addDays(2)->setTime(10, 0);

    $this->actingAs($patient)
        ->post(route('patient.appointments.store'), [
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $startsAt->toIso8601String(),
            'modality' => 'video_call',
            'notes' => null,
        ])
        ->assertRedirect(route('patient.appointments.book-success'));

    expect(PatientProfile::where('user_id', $patient->id)->count())->toBe(1);

    $linked = PatientProfile::where('user_id', $patient->id)->first();
    expect($linked->workspace_id)->toBe($workspace->id)
        ->and($linked->professional_id)->toBe($professional->id);

    $this->assertDatabaseHas('appointments', [
        'workspace_id' => $workspace->id,
        'patient_id' => $patient->id,
        'professional_id' => $professional->id,
        'service_id' => $service->id,
        'modality' => 'video_call',
        'status' => 'pending',
    ]);
});
