<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Str;

class BillingService
{
    /**
     * Generates a unique invoice number in the format FAC-{YEAR}-{RANDOM}.
     * Retries on collision to guarantee uniqueness against the invoices table.
     */
    public function generateInvoiceNumber(User $user): string
    {
        $year = now()->year;

        do {
            $number = 'FAC-'.$year.'-'.strtoupper(Str::random(6));
        } while (Invoice::where('invoice_number', $number)->exists());

        return $number;
    }

    /**
     * @todo Generate a PDF invoice and store it in the invoice's pdf_path.
     *       Requires a PDF library (e.g. barryvdh/laravel-dompdf).
     */
    public function generatePdf(Invoice $invoice): void
    {
        // @todo
    }

    /**
     * Mark an invoice as paid, recording the payment method and timestamp.
     */
    public function markAsPaid(Invoice $invoice, string $method): void
    {
        $allowed = ['cash', 'transfer', 'card', 'bizum', 'stripe', 'other'];

        if (! in_array($method, $allowed, strict: true)) {
            throw new \InvalidArgumentException("Payment method '{$method}' is not valid.");
        }

        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $method,
        ]);
    }
}
