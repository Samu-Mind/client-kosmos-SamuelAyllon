<?php

namespace App\Http\Controllers\Portal\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JoinCallAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment): JsonResponse
    {
        abort_if($appointment->patient_id !== $request->user()->id, 403);

        if (! $appointment->meeting_url) {
            return response()->json(['error' => 'La sala aún no está disponible.'], 422);
        }

        return response()->json([
            'meeting_url' => $appointment->meeting_url,
        ]);
    }
}
