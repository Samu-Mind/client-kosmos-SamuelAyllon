<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    /**
     * Marcar el tutorial como completado para el usuario autenticado.
     */
    public function complete(Request $request): RedirectResponse
    {
        $request->user()->completeTutorial();

        return back();
    }
}
