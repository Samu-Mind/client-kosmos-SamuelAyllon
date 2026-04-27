<?php

namespace App\Actions\Appointment;

use App\Actions\Patient\CreateOrUpdateProfessionalPatient;
use App\DTOs\PatientUpsertData;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateAppointment
{
    public function __construct(
        private CreateOrUpdateProfessionalPatient $upsertPatient,
    ) {}

    /**
     * @param  array{professional_id:int,service_id:int,starts_at:string,modality:string,notes?:?string}  $data
     */
    public function __invoke(User $patient, array $data): Appointment
    {
        $professional = User::find($data['professional_id']);

        if (! $professional) {
            throw ValidationException::withMessages([
                'professional_id' => 'Profesional no disponible.',
            ]);
        }

        $workspace = $professional->workspaces()->first();

        if (! $workspace) {
            throw ValidationException::withMessages([
                'professional_id' => 'El profesional no tiene workspace configurado.',
            ]);
        }

        $service = Service::where('id', $data['service_id'])
            ->where('workspace_id', $workspace->id)
            ->where('is_active', true)
            ->first();

        if (! $service) {
            throw ValidationException::withMessages([
                'service_id' => 'Servicio no disponible.',
            ]);
        }

        return DB::transaction(function () use ($patient, $professional, $workspace, $service, $data): Appointment {
            ($this->upsertPatient)(
                $professional,
                $workspace,
                new PatientUpsertData(
                    name: $patient->name,
                    email: $patient->email,
                    phone: $patient->phone,
                    consultationReason: $data['notes'] ?? null,
                ),
                $patient,
            );

            $startsAt = CarbonImmutable::parse($data['starts_at']);

            return Appointment::create([
                'workspace_id' => $workspace->id,
                'patient_id' => $patient->id,
                'professional_id' => $professional->id,
                'service_id' => $service->id,
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->addMinutes($service->duration_minutes),
                'modality' => $data['modality'],
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);
        });
    }
}
