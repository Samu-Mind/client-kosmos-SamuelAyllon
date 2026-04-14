<?php

use App\Models\Invoice;
use App\Models\PatientProfile;
use App\Models\User;

it('redirects guests from billing to login', function () {
    $this->get(route('billing'))->assertRedirect(route('login'));
});

it('professional can view billing page', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('billing/index'));
});

it('billing page returns invoices, stats and filters', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('invoices')
            ->has('stats')
            ->has('filters')
        );
});

it('billing stats include total_paid, total_pending and total_overdue', function () {
    $this->actingAs(createProfessional())
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->has('stats.total_paid')
            ->has('stats.total_pending')
            ->has('stats.total_overdue')
        );
});

it('billing only shows invoices belonging to authenticated professional', function () {
    $user  = createProfessional();
    $other = createProfessional();

    $patientUser      = User::factory()->create();
    $patientUserOther = User::factory()->create();

    Invoice::factory()->count(3)->create([
        'professional_id' => $user->id,
        'patient_id'      => $patientUser->id,
    ]);
    Invoice::factory()->create([
        'professional_id' => $other->id,
        'patient_id'      => $patientUserOther->id,
    ]);

    $this->actingAs($user)
        ->get(route('billing'))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('invoices.data', 3)
        );
});

it('billing can be filtered by invoice status', function () {
    $user       = createProfessional();
    $patientUser = User::factory()->create();

    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'paid']);
    Invoice::factory()->create(['professional_id' => $user->id, 'patient_id' => $patientUser->id, 'status' => 'draft']);

    $this->actingAs($user)
        ->get(route('billing', ['status' => 'paid']))
        ->assertInertia(fn ($page) => $page
            ->component('billing/index')
            ->has('invoices.data', 1)
        );
});
