<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubscriptionController extends Controller
{
    public function index(): Response
    {
        $subscriptions = Subscription::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $summary = [
            'free' => Subscription::where('plan', 'free')->count(),
            'premium_monthly' => Subscription::where('plan', 'premium_monthly')->where('status', 'active')->count(),
            'premium_yearly' => Subscription::where('plan', 'premium_yearly')->where('status', 'active')->count(),
            'expired' => Subscription::where('status', 'expired')->count(),
            'cancelled' => Subscription::where('status', 'cancelled')->count(),
        ];

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'summary' => $summary,
        ]);
    }
}
