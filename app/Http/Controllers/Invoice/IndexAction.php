<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexAction extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $invoices = Invoice::where('professional_id', $user->id)
            ->with(['items', 'patient'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->patient_id, fn ($q, $p) => $q->where('patient_id', $p))
            ->orderByDesc('issued_at')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'total_paid'    => Invoice::where('professional_id', $user->id)
                ->where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('total'),
            'total_pending' => Invoice::where('professional_id', $user->id)
                ->whereIn('status', ['draft', 'sent'])
                ->sum('total'),
            'total_overdue' => Invoice::where('professional_id', $user->id)
                ->where('status', 'overdue')
                ->sum('total'),
        ];

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'stats'    => $stats,
            'filters'  => $request->only(['status', 'patient_id']),
        ]);
    }
}
