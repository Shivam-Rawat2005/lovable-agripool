<?php

namespace App\Http\Controllers;

use App\Models\Pool;
use App\Models\TransportRequest;
use Illuminate\Http\Request;

class PoolController extends Controller
{
    public function index()
    {
        return Pool::with(['driver', 'transportRequests.farmer'])
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
        ]);

        $pool = Pool::create([
            'driver_id' => \Illuminate\Support\Facades\Auth::id(),
            'route_start' => $request->route_start,
            'route_end' => $request->route_end,
            'date' => $request->date,
            'total_capacity' => $request->total_capacity,
            'price_per_kg' => $request->price_per_kg ?? 5.5,
            'current_weight' => 0,
            'status' => 'Open',
        ]);

        return response()->json($pool, 201);
    }

    public function join(Request $request, $poolId)
    {
        $pool = Pool::findOrFail($poolId);
        $transportRequest = TransportRequest::findOrFail($request->request_id);

        $transportRequest->pool_id = $pool->id;
        $transportRequest->status = 'Matched';
        $transportRequest->save();

        $pool->current_weight += $transportRequest->weight;
        $pool->save();

        return response()->json(['message' => 'Joined pool successfully', 'pool' => $pool]);
    }
}
