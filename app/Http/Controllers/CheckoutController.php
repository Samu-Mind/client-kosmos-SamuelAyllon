<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        if ($user->isPremiumUser()) {
            return Inertia::render('checkout/index', [
                'alreadyPremium' => true,
                'subscription' => $user->subscription,
            ]);
        }

        return Inertia::render('checkout/index', [
            'alreadyPremium' => false,
            'plans' => [
                [
                    'key' => 'premium_monthly',
                    'name' => 'Solo Mensual',
                    'price' => 11.99,
                    'description' => 'Facturado mensualmente',
                ],
                [
                    'key' => 'premium_yearly',
                    'name' => 'Solo Anual',
                    'price' => 119,
                    'description' => 'Facturado anualmente — ahorra ~2 meses',
                ],
            ],
        ]);
    }

    public function store(CheckoutRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $data = $request->validated();

        $prices = [
            'premium_monthly' => 11.99,
            'premium_yearly' => 119,
        ];

        $payment = Payment::create([
            'user_id'      => $user->id,
            'plan'         => $data['plan'],
            'amount'       => $prices[$data['plan']],
            'status'       => 'pending',
            'payment_method' => 'card',
            'transaction_id' => Payment::generateTransactionId(),
            // Solo almacenamos los últimos 4 dígitos de la tarjeta (PCI-DSS)
            'card_last_four' => substr($data['card_number'], -4),
        ]);

        // process() simula la pasarela: 80% éxito / 20% fallo
        // En caso de éxito actualiza la suscripción y el rol del usuario
        $success = $payment->process();

        if ($success) {
            return redirect()->route('subscription.index')
                ->with('success', '¡Suscripción activada! Bienvenido a Premium.');
        }

        return redirect()->back()
            ->withErrors(['payment' => 'El pago no pudo procesarse. Por favor, inténtalo de nuevo.']);
    }
}
