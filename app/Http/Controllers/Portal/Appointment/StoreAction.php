<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Actions\Patient\LinkPatientToProfessional;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StoreAction extends Controller
{
    public function __invoke(Request $request, LinkPatientToProfessional $linkPatient): RedirectResponse
    {
        $validated = $request->validate([
            'professional_id' => ['required', 'integer', Rule::exists('users', 'id')],
            'service_id' => ['required', 'integer'],
            'starts_at' => ['required', 'date', 'after:now'],
            'modality' => ['required', 'in:in_person,video_call'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $professional = User::findOrFail($validated['professional_id']);
        $workspace = $professional->workspaces()->first();

        if (! $workspace) {
            return back()->withErrors(['professional_id' => 'El profesional no tiene workspace configurado.']);
        }

        $service = Service::where('id', $validated['service_id'])
            ->where('workspace_id', $workspace->id)
            ->where('is_active', true)
            ->first();

        if (! $service) {
            return back()->withErrors(['service_id' => 'Servicio no disponible.']);
        }

        $patient = $request->user();

        $linkPatient($patient, $professional, $workspace);

        Appointment::create([
            'workspace_id' => $workspace->id,
            'patient_id' => $patient->id,
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'starts_at' => $validated['starts_at'],
            'ends_at' => Carbon::parse($validated['starts_at'])->addMinutes($service->duration_minutes),
            'modality' => $validated['modality'],
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('patient.appointments.book-success');
    }
}
