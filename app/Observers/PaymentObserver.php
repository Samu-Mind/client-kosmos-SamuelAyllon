<?php

namespace App\Observers;

use App\Models\Invoice;

class PaymentObserver
{
    public function saved(Invoice $invoice): void
    {
        // Invoice status is the source of truth for billing state.
        // Any side-effects on save (e.g. notifications) go here.
    }
}
