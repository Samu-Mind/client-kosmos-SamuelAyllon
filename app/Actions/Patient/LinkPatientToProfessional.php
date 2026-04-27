<?php

namespace App\Actions\Patient;

use App\Models\CaseAssignment;
use App\Models\PatientProfile;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;

class LinkPatientToProfessional
{
    public function __invoke(User $patient, User $professional, Workspace $workspace): PatientProfile
    {
        return DB::transaction(function () use ($patient, $professional, $workspace): PatientProfile {
            $profile = PatientProfile::where('user_id', $patient->id)
                ->where('workspace_id', $workspace->id)
                ->first();

            if (! $profile) {
                $floating = PatientProfile::where('user_id', $patient->id)
                    ->whereNull('workspace_id')
                    ->first();

                if ($floating) {
                    $floating->fill([
                        'workspace_id' => $workspace->id,
                        'professional_id' => $professional->id,
                        'is_active' => true,
                        'status' => 'active',
                    ])->save();

                    $profile = $floating;
                } else {
                    $profile = PatientProfile::create([
                        'user_id' => $patient->id,
                        'workspace_id' => $workspace->id,
                        'professional_id' => $professional->id,
                        'is_active' => true,
                        'status' => 'active',
                    ]);
                }
            }

            CaseAssignment::firstOrCreate(
                [
                    'patient_id' => $patient->id,
                    'professional_id' => $professional->id,
                    'workspace_id' => $workspace->id,
                ],
                [
                    'is_primary' => true,
                    'role' => 'primary',
                    'status' => 'active',
                    'started_at' => now(),
                ],
            );

            return $profile;
        });
    }
}
