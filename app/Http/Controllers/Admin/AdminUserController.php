<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['subscription', 'roles'])
            ->withCount(['tasks', 'ideas', 'projects'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['subscription', 'roles', 'payments']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'dashboardData' => $user->getDashboardData(),
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
