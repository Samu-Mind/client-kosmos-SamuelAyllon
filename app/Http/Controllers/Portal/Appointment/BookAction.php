<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $clinicId = $request->user()->patientProfile?->clinic_id;

        $services      = Service::where('clinic_id', $clinicId)->where('is_active', true)->get();
        $availabilities = Availability::where('clinic_id', $clinicId)->where('is_active', true)->get();

        return Inertia::render('portal/appointments/book', [
            'services'       => $services,
            'availabilities' => $availabilities,
        ]);
    }
}
