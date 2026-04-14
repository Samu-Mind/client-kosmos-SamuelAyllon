<?php

namespace App\Services;

use App\Models\Invoice;

class PaymentReminderService
{
    /**
     * @todo Send payment reminder notifications for all overdue invoices
     *       that haven't been reminded recently
     */
    public function sendPendingReminders(): void
    {
        // @todo
    }

    /**
     * @todo Mark an invoice as claimed (escalated) and log the action
     */
    public function markAsClaimed(Invoice $invoice): void
    {
        // @todo
    }
}
