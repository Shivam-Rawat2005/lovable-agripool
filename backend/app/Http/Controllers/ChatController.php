<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getMessages()
    {
        return ChatMessage::orderBy('created_at', 'asc')->take(50)->get();
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $user = Auth::user();

        $chatMessage = ChatMessage::create([
            'sender_id' => Auth::id(),
            'sender_name' => $user->name ?? 'Anonymous',
            'sender_role' => $user->role ?? 'unknown',
            'message' => $request->message,
        ]);

        return response()->json($chatMessage, 201);
    }

    public function getStatus()
    {
        return response()->json([
            'status' => 'connected',
            'timestamp' => now()
        ]);
    }
}
