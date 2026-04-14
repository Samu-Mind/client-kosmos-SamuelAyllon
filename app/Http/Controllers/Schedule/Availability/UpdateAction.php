<?php

namespace App\Http\Controllers\Schedule\Availability;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateAction extends Controller
{
    public function __invoke(Request $request, Availability $availability): RedirectResponse
    {
        $validated = $request->validate([
            'day_of_week'           => ['required', 'integer', 'between:0,6'],
            'start_time'            => ['required', 'date_format:H:i'],
            'end_time'              => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_duration_minutes' => ['required', 'integer', 'min:15', 'max:240'],
            'is_active'             => ['boolean'],
        ]);

        $availability->update($validated);

        return back()->with('success', 'Disponibilidad actualizada.');
    }
}
