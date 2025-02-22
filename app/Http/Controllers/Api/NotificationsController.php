<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentRequests;
use App\Models\Message;

class NotificationsController extends Controller
{
    public function getNotifications()
    {
        $user = auth()->user();
        $messagesCount = Message::distinct('to_user_id')->where('is_read', 0)->where('to_user_id', $user->id)->count();

        if ($user->hasPermissionTo('be_admin')) {

            $requestsCount = StudentRequests::where('status', 'pending')->count();
            return response()->json([
                'requestsCount' => $requestsCount,
                'messagesCount' => $messagesCount,
            ]);
        }
        if ($user->hasPermissionTo('be_student')) {
            return response()->json([
                'messagesCount' => $messagesCount,
            ]);
        }

        return;
    }
}
