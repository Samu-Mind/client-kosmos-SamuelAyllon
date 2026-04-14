<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Appointment $appointment): Response
    {
        $appointment->load([
            'patient',
            'professional',
            'service',
            'sessionRecording',
            'notes',
            'agreements',
            'invoiceItems.invoice',
        ]);

        return Inertia::render('appointments/show', [
            'appointment' => $appointment,
        ]);
    }
}
