<?php

namespace App\Http\Controllers;

use App\Models\Pool;
use App\Models\TransportRequest;
use Illuminate\Http\Request;

class PoolController extends Controller
{
    public function index()
    {
        return Pool::with(['driver', 'vehicle', 'transportRequests.farmer'])
            ->where('status', 'Open')
            ->orWhere('driver_id', \Illuminate\Support\Facades\Auth::id())
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'route_start' => 'required|string',
            'route_end' => 'required|string',
            'date' => 'required|date',
            'total_capacity' => 'required|numeric',
            'price_per_kg' => 'nullable|numeric',
            'vehicle_id' => 'required|string',
        ]);

        // Check if vehicle is busy on this date
        $targetDate = $request->date;

        $busyInRequests = TransportRequest::where('vehicle_id', $request->vehicle_id)
            ->where('preferred_date', $targetDate)
            ->whereNotIn('status', ['Completed', 'Cancelled'])
            ->exists();

        $busyInPools = Pool::where('vehicle_id', $request->vehicle_id)
            ->where('date', $targetDate)
            ->whereNotIn('status', ['Completed', 'Cancelled'])
            ->exists();

        if ($busyInRequests || $busyInPools) {
            return response()->json(['message' => 'This vehicle is busy on that day.'], 422);
        }

        $pool = Pool::create([
            'driver_id' => \Illuminate\Support\Facades\Auth::id(),
            'vehicle_id' => $request->vehicle_id,
            'route_start' => $request->route_start,
            'route_end' => $request->route_end,
            'date' => $request->date,
            'total_capacity' => $request->total_capacity,
            'price_per_kg' => $request->price_per_kg ?? 5.5,
            'current_weight' => 0,
            'status' => 'Open',
        ]);

        $vehicle = \App\Models\Vehicle::find($request->vehicle_id);
        if ($vehicle) {
            $vehicle->update(['status' => 'On-Trip']);
        }

        return response()->json($pool, 201);
    }

    public function join(Request $request, $poolId)
    {
        $pool = Pool::findOrFail($poolId);
        $transportRequest = TransportRequest::findOrFail($request->request_id);

        $remainingCapacity = $pool->total_capacity - $pool->current_weight;
        if ($transportRequest->weight > $remainingCapacity) {
            return response()->json([
                'message' => "Capacity exceeded! Only {$remainingCapacity} kg left in this pool."
            ], 422);
        }

        $transportRequest->pool_id = $pool->id;
        $transportRequest->driver_id = $pool->driver_id;
        $transportRequest->vehicle_id = $pool->vehicle_id;
        $transportRequest->status = 'Matched';
        $transportRequest->escrow_status = 'held_in_escrow';
        $transportRequest->payment_amount = $transportRequest->weight * ($pool->price_per_kg ?? 5.5);
        $transportRequest->payout = $transportRequest->weight * ($pool->price_per_kg ?? 5.5);
        $transportRequest->save();

        $pool->current_weight += $transportRequest->weight;
        $pool->save();

        return response()->json(['message' => 'Joined pool successfully', 'pool' => $pool]);
    }

    public function rejectFarmer(Request $request, $poolId, $requestId)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $pool = Pool::findOrFail($poolId);
        $transportRequest = TransportRequest::findOrFail($requestId);

        // Ensure this request is actually in this pool
        if ($transportRequest->pool_id !== $pool->id && $transportRequest->pool_id !== $pool->_id) {
            return response()->json(['message' => 'Request is not part of this pool.'], 400);
        }

        // Adjust pool weight
        $pool->current_weight = max(0, $pool->current_weight - $transportRequest->weight);
        $pool->save();

        // Update transport request
        $transportRequest->pool_id = null;
        $transportRequest->status = 'Pending';
        $transportRequest->rejection_reason = $request->reason;
        $transportRequest->save();

        return response()->json([
            'message' => 'Farmer request rejected successfully from pool.',
            'pool' => $pool
        ]);
    }
}
