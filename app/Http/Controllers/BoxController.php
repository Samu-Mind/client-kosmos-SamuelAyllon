<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoxRequest;
use App\Http\Requests\UpdateBoxRequest;
use App\Models\Box;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BoxController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $boxes = $user->boxes()
            ->withCount('resources')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('boxes/index', [
            'boxes' => $boxes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('boxes/create');
    }

    public function store(StoreBoxRequest $request): RedirectResponse
    {
        $box = Auth::user()->boxes()->create([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('boxes.show', $box)->with('success', 'Caja creada correctamente.');
    }

    public function show(Box $box): Response
    {
        $this->authorize('view', $box);

        $box->load([
            'resources' => fn ($q) => $q->orderBy('created_at', 'desc'),
        ]);

        return Inertia::render('boxes/show', [
            'box' => $box,
        ]);
    }

    public function edit(Box $box): Response
    {
        $this->authorize('update', $box);

        return Inertia::render('boxes/edit', [
            'box' => $box,
        ]);
    }

    public function update(UpdateBoxRequest $request, Box $box): RedirectResponse
    {
        $this->authorize('update', $box);

        $box->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('boxes.show', $box)->with('success', 'Caja actualizada correctamente.');
    }

    public function destroy(Box $box): RedirectResponse
    {
        $this->authorize('delete', $box);

        $box->delete();

        return redirect()->route('boxes.index')->with('success', 'Caja eliminada correctamente.');
    }
}
