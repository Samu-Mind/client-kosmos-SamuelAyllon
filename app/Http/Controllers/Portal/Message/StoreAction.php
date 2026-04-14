<?php

namespace App\Http\Controllers\Portal\Message;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreAction extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $request->validate([
            'receiver_id' => ['required', 'exists:users,id'],
            'subject'     => ['nullable', 'string', 'max:255'],
            'body'        => ['required', 'string'],
        ]);

        $profile = $request->user()->patientProfile;

        $clinicId = $profile?->clinic_id;

        abort_if(! $clinicId, 422, 'No hay una clínica activa asociada a tu perfil.');

        Message::create([
            'clinic_id'   => $clinicId,
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'subject'     => $request->subject,
            'body'        => $request->body,
        ]);

        return back()->with('success', 'Mensaje enviado.');
    }
}
