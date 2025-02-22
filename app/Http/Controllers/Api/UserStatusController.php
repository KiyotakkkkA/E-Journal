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

        $user = auth()->user();

        if (!($user->hasPermissionTo('be_student') || $user->hasPermissionTo('be_teacher') || $user->hasPermissionTo('be_admin'))) {
            return response()->json(['error' => 'Unauthorized'], 200);
        }

        User::where('last_seen', '<', Carbon::now()->subMinutes(5))
            ->where('is_online', true)
            ->update(['is_online' => false]);

        $users = User::select([
            'users.id',
            'users.name',
            'users.last_seen',
            'users.role_id',
            'users.email_verified_at',
            'users.is_online',
            'roles.name as role_name'
        ])
        ->join('roles', 'users.role_id', '=', 'roles.id')
        ->where('users.email_verified_at', '!=', null)
        ->where('users.role_id', '!=', 4);

        $withoutSelf = $request->query('without_self');
        $onlyOnline = $request->query('only_online');

        if ($withoutSelf === 'true') {
            $users->where('users.id', '!=', auth()->id());
        }

        if ($onlyOnline === 'true') {
            $users->where('users.is_online', true);
        }

        return response()->json($users->get());
    }

    public function updateUserStatus()
    {

        $user = auth()->user();

        if (!($user->hasPermissionTo('be_student') || $user->hasPermissionTo('be_teacher') || $user->hasPermissionTo('be_admin'))) {
            return response()->json(['error' => 'Unauthorized'], 200);
        }

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
