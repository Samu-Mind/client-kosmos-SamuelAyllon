<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Box;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function create(Box $box): Response
    {
        $this->authorize('view', $box);

        return Inertia::render('resources/create', [
            'box' => $box,
        ]);
    }

    public function store(StoreResourceRequest $request, Box $box): RedirectResponse
    {
        $this->authorize('view', $box);

        $box->resources()->create([
            ...$request->validated(),
            'user_id' => Auth::id(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('boxes.show', $box)->with('success', 'Recurso añadido correctamente.');
    }

    public function edit(Resource $resource): Response
    {
        $this->authorize('update', $resource);

        $resource->load('box');

        return Inertia::render('resources/edit', [
            'resource' => $resource,
        ]);
    }

    public function update(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $this->authorize('update', $resource);

        $resource->update([
            ...$request->validated(),
            'user_modified_at' => now(),
        ]);

        return redirect()->route('boxes.show', $resource->box_id)->with('success', 'Recurso actualizado correctamente.');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        $this->authorize('delete', $resource);

        $boxId = $resource->box_id;
        $resource->delete();

        return redirect()->route('boxes.show', $boxId)->with('success', 'Recurso eliminado correctamente.');
    }
}
