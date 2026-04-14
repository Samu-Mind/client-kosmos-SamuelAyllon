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
            $number = 'FAC-' . $year . '-' . strtoupper(Str::random(6));
        } while (Invoice::where('invoice_number', $number)->exists());

        return $number;
    }

    /**
     * @todo Generate a PDF invoice and store it in the invoice's pdf_path
     */
    public function generatePdf(Invoice $invoice): void
    {
        // @todo
    }

    /**
     * @todo Mark an invoice as paid, set paid_at and update status
     */
    public function markAsPaid(Invoice $invoice, string $method): void
    {
        // @todo
    }
}
