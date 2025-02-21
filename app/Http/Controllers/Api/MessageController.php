<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

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
            ->get()
            ->map(function($message) {
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
            });

        return response()->json(['messages' => $messages]);
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

    public function markAsRead(Message $message)
    {
        if ($message->to_user_id === auth()->id()) {
            $message->update(['is_read' => true]);
        }
        return response()->json(['success' => true]);
    }
}
