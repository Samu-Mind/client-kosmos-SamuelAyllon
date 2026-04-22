<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WaitingShowAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): Response
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        $appointment->load(['professional:id,name,avatar_path', 'sessionRecording:id,appointment_id,patient_consent_given_at']);

        return Inertia::render('patient/appointments/waiting', [
            'appointment' => $appointment,
            'recordingConsentGiven' => $appointment->sessionRecording?->patient_consent_given_at !== null,
        ]);
    }
}
