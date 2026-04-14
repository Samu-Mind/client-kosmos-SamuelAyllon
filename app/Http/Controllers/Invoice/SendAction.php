<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;

class SendAction extends Controller
{
    public function __invoke(Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        // @todo Dispatch Gmail API email job
        $invoice->update(['status' => 'sent']);

        return back()->with('success', 'Factura enviada.');
    }
}
