<?php

namespace App\Http\Controllers\Portal\Professional;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalProfile;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowAction extends Controller
{
    public function __invoke(Request $request, ProfessionalProfile $professional, AvailabilityService $availability): Response
    {
        abort_unless($professional->isVerified(), 404);

        $professional->load('user:id,name,avatar_path');

        return Inertia::render('patient/professionals/show', [
            'professional' => [
                'id' => $professional->id,
                'user_id' => $professional->user_id,
                'name' => $professional->user->name,
                'avatar_path' => $professional->user->avatar_path,
                'specialties' => $professional->specialties ?? [],
                'bio' => $professional->bio,
                'collegiate_number' => $professional->collegiate_number,
                'is_verified' => $professional->isVerified(),
                'slots' => $professional->user_id
                    ? $availability->slotsForProfessional($professional->user_id)
                    : [],
            ],
        ]);
    }
}
