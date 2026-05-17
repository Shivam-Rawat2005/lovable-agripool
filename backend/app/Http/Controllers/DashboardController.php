<?php

namespace App\Http\Controllers;

use App\Models\TransportRequest;
use App\Models\Pool;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function farmer()
    {
        $userId = Auth::id();
        $requests = TransportRequest::where('farmer_id', $userId)->get();
        
        return response()->json([
            'stats' => [
                'active_requests' => $requests->where('status', 'Pending')->count(),
                'pools_joined' => $requests->whereNotNull('pool_id')->count(),
                'total_trips' => $requests->count(),
                'cost_saved' => '₹' . ($requests->whereNotNull('pool_id')->count() * 2190), // Mock calc
            ],
            'recent_requests' => $requests->sortByDesc('created_at')->take(5)->values(),
        ]);
    }

    public function driver()
    {
        $userId = Auth::id();
        $vehicles = Vehicle::where('driver_id', $userId)->get();
        
        $assignedRequests = TransportRequest::with('farmer')->where('driver_id', $userId)->get();
        $assignedPools = Pool::with('transportRequests.farmer')->where('driver_id', $userId)->get();

        $earnings = 0;
        foreach($assignedRequests as $req) {
            if ($req->status === 'Completed') {
                $earnings += ($req->weight * 6.5);
            }
        }
        foreach($assignedPools as $pool) {
            if ($pool->status === 'Completed') {
                $earnings += ($pool->current_weight * ($pool->price_per_kg ?? 5.5));
            }
        }
        
        $recentRequests = $assignedRequests->map(function($r) {
            $r->type = 'Request';
            return $r;
        });
        
        $recentPools = $assignedPools->map(function($p) {
            $p->type = 'Pool';
            return $p;
        });
        
        $allRecent = $recentRequests->concat($recentPools)->sortByDesc('updated_at')->take(5)->values();

        return response()->json([
            'stats' => [
                'earnings' => '₹' . number_format($earnings),
                'active_trips' => $assignedRequests->where('status', 'In-Transit')->count() + $assignedPools->where('status', 'In-Transit')->count(),
                'total_trips' => $assignedRequests->where('status', 'Completed')->count() + $assignedPools->where('status', 'Completed')->count(),
                'vehicles' => $vehicles->count(),
            ],
            'recent_trips' => $allRecent, 
        ]);
    }

    public function admin()
    {
        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'active_trips' => TransportRequest::where('status', 'In-Transit')->count(),
                'revenue' => '₹4.2L',
                'pool_fill_rate' => '74%',
            ],
            'recent_activity' => TransportRequest::with('farmer')->latest()->take(5)->get(),
        ]);
    }
}
