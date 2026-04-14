<?php

namespace App\Http\Controllers\Schedule;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $from = $request->date('from', 'Y-m-d') ?? now()->startOfWeek();
        $to   = $request->date('to', 'Y-m-d') ?? now()->endOfWeek();

        $appointments = Appointment::where('professional_id', $user->id)
            ->with(['patient', 'service'])
            ->whereBetween('starts_at', [$from, $to])
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('schedule/index', [
            'appointments' => $appointments,
            'from'         => $from->toDateString(),
            'to'           => $to->toDateString(),
        ]);
    }
}
