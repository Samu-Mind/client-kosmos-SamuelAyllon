<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ConsentForm;
use App\Models\Invoice;
use App\Models\KosmoBriefing;
use App\Models\PatientProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $activePatients = PatientProfile::withoutGlobalScopes()
            ->where('professional_id', $user->id)
            ->where('is_active', true)
            ->get();

        $todayAppointments = $user->professionalAppointments()
            ->with('patient')
            ->whereDate('starts_at', today())
            ->orderBy('starts_at')
            ->get();

        $alerts = [
            'invoice' => PatientProfile::withoutGlobalScopes()
                ->where('professional_id', $user->id)
                ->whereHas('invoices', fn ($q) => $q->whereIn('status', ['sent', 'overdue']))
                ->where('is_active', true)
                ->get(['id', 'user_id']),
            'consent' => PatientProfile::withoutGlobalScopes()
                ->where('professional_id', $user->id)
                ->whereDoesntHave('consentForms', fn ($q) => $q
                    ->where('status', 'signed')
                    ->where(fn ($q2) => $q2->whereNull('expires_at')->orWhere('expires_at', '>', now())))
                ->where('is_active', true)
                ->get(['id', 'user_id']),
        ];

        $dailyBriefing = KosmoBriefing::where('user_id', $user->id)
            ->where('type', 'daily')
            ->whereDate('for_date', today())
            ->first();

        $stats = [
            'appointments_this_week' => $user->professionalAppointments()
                ->whereBetween('starts_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count(),
            'pending_invoices'       => Invoice::where('professional_id', $user->id)
                ->whereIn('status', ['sent', 'overdue'])
                ->sum('total'),
            'active_patients'        => $activePatients->count(),
            'collection_rate'        => $this->getCollectionRate($user->id),
        ];

        return Inertia::render('dashboard', [
            'activePatients'    => $activePatients,
            'todayAppointments' => $todayAppointments,
            'alerts'            => $alerts,
            'dailyBriefing'     => $dailyBriefing,
            'stats'             => $stats,
        ]);
    }

    private function getCollectionRate(int $userId): float
    {
        $total = Invoice::where('professional_id', $userId)->count();
        if ($total === 0) {
            return 100.0;
        }
        $paid = Invoice::where('professional_id', $userId)->where('status', 'paid')->count();

        return round(($paid / $total) * 100, 1);
    }
}
