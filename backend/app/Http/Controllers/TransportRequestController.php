<?php

namespace App\Http\Controllers;

use App\Models\TransportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransportRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'driver' || $user->role === 'admin') {
            return TransportRequest::with(['farmer', 'vehicle'])
                ->where('status', 'Pending')
                ->orWhere('driver_id', Auth::id())
                ->get();
        }
        return TransportRequest::with(['driver', 'vehicle'])->where('farmer_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'crop_type' => 'required|string',
            'weight' => 'required|numeric',
            'pickup_location' => 'required|string',
            'dropoff_location' => 'required|string',
            'preferred_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $transportRequest = TransportRequest::create([
            'farmer_id' => Auth::id(),
            'crop_type' => $request->crop_type,
            'weight' => $request->weight,
            'pickup_location' => $request->pickup_location,
            'dropoff_location' => $request->dropoff_location,
            'preferred_date' => $request->preferred_date,
            'notes' => $request->notes,
            'status' => 'Pending',
            'escrow_status' => 'held_in_escrow',
            'payment_amount' => $request->weight * 10, // ₹10 per kg standard rate
            'payout' => $request->weight * 8.5,        // ₹8.5 per kg driver payout
        ]);

        return response()->json([
            'message' => 'Transport request created successfully',
            'request' => $transportRequest
        ], 201);
    }

    public function show($id)
    {
        return TransportRequest::findOrFail($id);
    }
}
