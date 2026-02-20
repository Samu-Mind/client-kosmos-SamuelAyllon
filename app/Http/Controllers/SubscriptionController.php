<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $subscription = $user->subscription;

        return Inertia::render('subscription/index', [
            'subscription' => $subscription,
            'plans' => [
                [
                    'key' => 'free',
                    'name' => 'Free',
                    'price' => 0,
                    'features' => [
                        'Ideas ilimitadas',
                        'Hasta 5 tareas activas',
                    ],
                ],
                [
                    'key' => 'premium_monthly',
                    'name' => 'Premium Mensual',
                    'price' => 9.99,
                    'features' => [
                        'Tareas ilimitadas',
                        'Proyectos y Cajas',
                        'Recursos',
                        'Transcripción de voz',
                        'Asistente IA',
                    ],
                ],
                [
                    'key' => 'premium_yearly',
                    'name' => 'Premium Anual',
                    'price' => 99.99,
                    'features' => [
                        'Todo lo de Premium Mensual',
                        'Ahorra 2 meses',
                    ],
                ],
            ],
        ]);
    }
}
