<?php

namespace App\Http\Controllers;

use App\Models\TransportRequest;
use App\Models\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripController extends Controller
{
    public function acceptRequest(Request $request, $id)
    {
        $transportRequest = TransportRequest::findOrFail($id);
        
        if ($transportRequest->status !== 'Pending') {
            return response()->json(['message' => 'Request is no longer available'], 400);
        }

        $request->validate([
            'vehicle_id' => 'required|string',
        ]);

        // Check if vehicle is busy on the request's date
        $targetDate = $transportRequest->preferred_date;

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

        $transportRequest->update([
            'driver_id' => Auth::id(),
            'vehicle_id' => $request->vehicle_id,
            'status' => 'In-Transit'
        ]);

        $vehicle = \App\Models\Vehicle::find($request->vehicle_id);
        if ($vehicle) {
            $vehicle->update(['status' => 'On-Trip']);
        }

        return response()->json(['message' => 'Job accepted successfully!', 'data' => $transportRequest]);
    }

    public function acceptPool(Request $request, $id)
    {
        $pool = Pool::findOrFail($id);
        
        if ($pool->status !== 'Open') {
            return response()->json(['message' => 'Pool is no longer available'], 400);
        }

        $request->validate([
            'vehicle_id' => 'required|string',
        ]);

        // Check if vehicle is busy on the pool's date
        $targetDate = $pool->date;

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

        $pool->update([
            'driver_id' => Auth::id(),
            'vehicle_id' => $request->vehicle_id,
            'status' => 'In-Transit'
        ]);

        // Also update all requests in this pool
        TransportRequest::where('pool_id', $id)->update([
            'status' => 'In-Transit',
            'vehicle_id' => $request->vehicle_id
        ]);

        $vehicle = \App\Models\Vehicle::find($request->vehicle_id);
        if ($vehicle) {
            $vehicle->update(['status' => 'On-Trip']);
        }

        return response()->json(['message' => 'Pool claimed successfully!', 'data' => $pool]);
    }

    public function startJob(Request $request, $id, $type)
    {
        if ($type === 'request') {
            $job = TransportRequest::findOrFail($id);
            $job->update(['status' => 'In-Transit']);
        } else {
            $job = Pool::findOrFail($id);
            $job->update(['status' => 'In-Transit']);
            // Also update all requests in this pool
            TransportRequest::where('pool_id', $id)->update(['status' => 'In-Transit']);
        }

        return response()->json(['message' => 'Job started successfully!', 'data' => $job]);
    }

    public function completeJob(Request $request, $id, $type)
    {
        if ($type === 'request') {
            $job = TransportRequest::findOrFail($id);
            $job->update([
                'status' => 'Completed',
                'escrow_status' => 'pending_release'
            ]);
            if ($job->vehicle_id) {
                $vehicle = \App\Models\Vehicle::find($job->vehicle_id);
                if ($vehicle) {
                    $vehicle->update(['status' => 'Available']);
                }
            }
        } else {
            $job = Pool::findOrFail($id);
            $job->update(['status' => 'Completed']);
            
            // Update all requests in this pool to Completed and pending_release
            TransportRequest::where('pool_id', $id)->update([
                'status' => 'Completed',
                'escrow_status' => 'pending_release'
            ]);

            if ($job->vehicle_id) {
                $vehicle = \App\Models\Vehicle::find($job->vehicle_id);
                if ($vehicle) {
                    $vehicle->update(['status' => 'Available']);
                }
            }
        }

        return response()->json(['message' => 'Job marked as completed! Payout pending admin approval.', 'data' => $job]);
    }

    public function getPendingSettlements()
    {
        // Fetch all transport requests with status Completed and escrow_status pending_release
        $requests = TransportRequest::with(['farmer', 'driver'])
            ->where('escrow_status', 'pending_release')
            ->get();

        return response()->json($requests);
    }

    public function approveSettlement(Request $request, $id)
    {
        $transportRequest = TransportRequest::findOrFail($id);
        
        $transportRequest->update([
            'escrow_status' => 'released',
            'status' => 'Completed' // fully finished and paid
        ]);

        // If part of a pool, check if all other requests in the pool are approved/released
        if ($transportRequest->pool_id) {
            $remaining = TransportRequest::where('pool_id', $transportRequest->pool_id)
                ->where('escrow_status', '!=', 'released')
                ->count();
            if ($remaining === 0) {
                $pool = Pool::find($transportRequest->pool_id);
                if ($pool) {
                    $pool->update(['status' => 'Completed']);
                }
            }
        }

        return response()->json([
            'message' => 'Settlement approved and funds released successfully!',
            'data' => $transportRequest
        ]);
    }
}
