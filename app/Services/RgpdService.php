<?php

namespace App\Services;

use App\Models\ConsentForm;
use App\Models\PatientProfile;
use Illuminate\Support\Collection;

class RgpdService
{
    /**
     * Check if the patient has a valid (signed, non-expired) consent form.
     */
    public function hasValidConsent(PatientProfile $patient): bool
    {
        return $patient->consentForms()
            ->where('status', 'signed')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();
    }

    /**
     * Return consent forms expiring within $daysAhead days for the given patient.
     */
    public function getExpiringConsents(PatientProfile $patient, int $daysAhead = 30): Collection
    {
        return $patient->consentForms()
            ->where('status', 'signed')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays($daysAhead)])
            ->get();
    }

    /**
     * Revoke a signed consent form.
     */
    public function revokeConsent(ConsentForm $form): void
    {
        $form->update([
            'status' => 'revoked',
            'signed_at' => null,
        ]);
    }
}
