<?php

namespace App\Models;

use App\Models\Concerns\BelongsToClinic;
use Database\Factories\PatientProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientProfile extends Model
{
    use BelongsToClinic, HasFactory, SoftDeletes;

    protected static function newFactory(): PatientProfileFactory
    {
        return PatientProfileFactory::new();
    }

    protected $table = 'patient_profiles';

    protected $fillable = [
        'user_id', 'clinic_id', 'professional_id',
        'email', 'phone', 'avatar_path',
        'is_active', 'clinical_notes', 'diagnosis', 'treatment_plan',
        'referral_source', 'status', 'first_session_at', 'last_session_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active'       => 'boolean',
            'first_session_at' => 'datetime',
            'last_session_at'  => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    /**
     * Appointments where this patient profile's user is the patient.
     * appointments.patient_id references users.id, so we bridge via user_id.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'user_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'patient_id');
    }

    public function agreements()
    {
        return $this->hasMany(Agreement::class, 'patient_id');
    }

    /**
     * Invoices for this patient (invoices.patient_id references users.id).
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'patient_id', 'user_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'patient_id');
    }

    public function consentForms()
    {
        return $this->hasMany(ConsentForm::class, 'patient_id');
    }

    public function kosmoBriefings()
    {
        return $this->hasMany(KosmoBriefing::class, 'patient_id');
    }

    public function professionals()
    {
        return $this->belongsToMany(User::class, 'patient_professional', 'patient_id', 'professional_id', 'user_id')
            ->withPivot(['clinic_id', 'is_primary', 'status', 'started_at', 'ended_at', 'notes'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeDischarged($query)
    {
        return $query->where('status', 'discharged');
    }
}
