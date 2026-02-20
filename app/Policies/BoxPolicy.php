<?php

namespace App\Policies;

use App\Models\Box;
use App\Models\User;

class BoxPolicy
{
    public function view(User $user, Box $box): bool
    {
        return $user->id === $box->user_id;
    }

    public function update(User $user, Box $box): bool
    {
        return $user->id === $box->user_id;
    }

    public function delete(User $user, Box $box): bool
    {
        return $user->id === $box->user_id;
    }
}
