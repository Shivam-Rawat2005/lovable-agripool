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

        $transportRequest->update([
            'driver_id' => Auth::id(),
            'status' => 'In-Transit'
        ]);

        return response()->json(['message' => 'Job accepted successfully!', 'data' => $transportRequest]);
    }

    public function acceptPool(Request $request, $id)
    {
        $pool = Pool::findOrFail($id);
        
        if ($pool->status !== 'Open') {
            return response()->json(['message' => 'Pool is no longer available'], 400);
        }

        $pool->update([
            'driver_id' => Auth::id(),
            'status' => 'In-Transit'
        ]);

        // Also update all requests in this pool
        TransportRequest::where('pool_id', $id)->update(['status' => 'In-Transit']);

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
        } else {
            $job = Pool::findOrFail($id);
            TransportRequest::where('pool_id', $id)->update(['status' => 'Completed']);
        }

        $job->update(['status' => 'Completed']);

        return response()->json(['message' => 'Job marked as completed!', 'data' => $job]);
    }
}
