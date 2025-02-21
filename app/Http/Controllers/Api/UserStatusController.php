<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
class UserStatusController extends Controller
{
    public function getOnlineUsers(Request $request)
    {
        User::where('last_seen', '<', Carbon::now()->subMinutes(5))
            ->where('is_online', true)
            ->update(['is_online' => false]);

        $users = User::select([
            'users.id',
            'users.name',
            'users.last_seen',
            'users.is_online',
            'roles.name as role_name'
        ])
        ->join('roles', 'users.role_id', '=', 'roles.id')
        ->where('users.is_online', true);

        $withoutSelf = $request->query('without_self');

        if ($withoutSelf === 'true') {
            $users->where('users.id', '!=', auth()->id());
        }

        return response()->json($users->get());
    }

    public function updateUserStatus()
    {
        $user = auth()->user();
        $now = Carbon::now();

        if (!$user->is_online) {
            $user->update([
                'last_seen' => $now,
                'is_online' => true
            ]);
        }
        else {
            $user->update(['last_seen' => $now]);
        }

        return response()->json(['message' => 'Status updated']);
    }
}
