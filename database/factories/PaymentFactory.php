<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @deprecated Use InvoiceFactory instead.
 * @extends Factory<Invoice>
 */
class PaymentFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 40, 200);

        return [
            'clinic_id'       => Clinic::factory(),
            'patient_id'      => User::factory(),
            'professional_id' => User::factory(),
            'invoice_number'  => 'FAC-' . strtoupper(Str::random(8)),
            'status'          => 'draft',
            'subtotal'        => $amount,
            'tax_rate'        => 0,
            'tax_amount'      => 0,
            'total'           => $amount,
            'payment_method'  => fake()->optional(0.8)->randomElement(['cash', 'bizum', 'transfer', 'card']),
            'due_at'          => fake()->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d'),
            'paid_at'         => null,
        ];
    }

    public function paid(): static
    {
        return $this->state([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state([
            'status' => 'overdue',
            'due_at' => fake()->dateTimeBetween('-3 months', '-1 day')->format('Y-m-d'),
        ]);
    }
}
