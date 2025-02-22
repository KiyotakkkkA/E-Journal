<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function getMessages()
    {
        $userId = auth()->id();

        $messages = Message::with(['fromUser:id,name', 'toUser:id,name'])
            ->where(function($query) use ($userId) {
                $query->where('from_user_id', $userId)
                      ->orWhere('to_user_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        $unreadCounts = Message::where('to_user_id', $userId)
            ->where('is_read', false)
            ->groupBy('from_user_id')
            ->selectRaw('from_user_id, COUNT(*) as unread_count')
            ->pluck('unread_count', 'from_user_id')
            ->toArray();

        return response()->json([
            'messages' => $messages->map(function($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'from_user_id' => $message->from_user_id,
                    'to_user_id' => $message->to_user_id,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                    'from_user' => $message->fromUser,
                    'to_user' => $message->toUser
                ];
            }),
            'unread_counts' => $unreadCounts
        ]);
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000'
        ]);

        $message = Message::create([
            'from_user_id' => auth()->id(),
            'to_user_id' => $validated['to_user_id'],
            'content' => $validated['content']
        ]);

        return response()->json($message->load(['fromUser:id,name', 'toUser:id,name']));
    }

    public function markAsRead(Request $request)
    {
        Message::where('from_user_id', $request->to_user_id)->where('is_read', 0)->update(['is_read' => 1]);

        return response()->json(['success' => true]);
    }
}
