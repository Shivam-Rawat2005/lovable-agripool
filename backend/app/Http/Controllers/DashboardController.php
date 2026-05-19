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
        $requests = TransportRequest::with(['driver', 'vehicle'])->where('farmer_id', $userId)->get();
        
        $costSaved = 0;
        foreach ($requests as $req) {
            if ($req->status === 'Completed' && $req->pool_id) {
                // Direct shipping standard rate is ₹10/kg.
                $directCost = $req->weight * 10;
                $actualPaid = $req->payment_amount ?? 0;
                if ($actualPaid > 0 && $directCost > $actualPaid) {
                    $costSaved += ($directCost - $actualPaid);
                }
            }
        }

        return response()->json([
            'stats' => [
                'active_requests' => $requests->whereIn('status', ['Pending', 'Matched', 'In-Transit'])->count(),
                'pools_joined' => $requests->whereNotNull('pool_id')->count(),
                'total_trips' => $requests->where('status', 'Completed')->count(),
                'cost_saved' => '₹' . number_format($costSaved),
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

        $availableEarnings = 0;
        $pendingEarnings = 0;
        $totalTripsCount = 0;

        // Individual requests
        foreach($assignedRequests as $req) {
            if (!$req->pool_id && $req->status === 'Completed') {
                $totalTripsCount++;
                $payout = $req->payout ?? 0;
                if ($req->escrow_status === 'released') {
                    $availableEarnings += $payout;
                } else if ($req->escrow_status === 'pending_release') {
                    $pendingEarnings += $payout;
                }
            }
        }

        // Pools (calculate earnings based on passenger requests in the pool)
        foreach($assignedPools as $pool) {
            if ($pool->status === 'Completed') {
                $totalTripsCount++;
            }
            foreach ($pool->transportRequests as $req) {
                if ($req->status === 'Completed') {
                    $payout = $req->payout ?? 0;
                    if ($req->escrow_status === 'released') {
                        $availableEarnings += $payout;
                    } else if ($req->escrow_status === 'pending_release') {
                        $pendingEarnings += $payout;
                    }
                }
            }
        }
        
        $recentRequests = $assignedRequests->map(function($r) {
            $r->type = 'Request';
            $r->calculated_payout = $r->payout ?? 0;
            return $r;
        });
        
        $recentPools = $assignedPools->map(function($p) {
            $p->type = 'Pool';
            $poolPayout = 0;
            foreach ($p->transportRequests as $req) {
                $poolPayout += $req->payout ?? 0;
            }
            $p->calculated_payout = $poolPayout;
            return $p;
        });
        
        $allRecent = $recentRequests->concat($recentPools)->sortByDesc('updated_at')->take(5)->values();

        return response()->json([
            'stats' => [
                'earnings' => '₹' . number_format($availableEarnings),
                'pending_earnings' => '₹' . number_format($pendingEarnings),
                'active_trips' => $assignedRequests->where('status', 'In-Transit')->count() + $assignedPools->where('status', 'In-Transit')->count(),
                'total_trips' => $totalTripsCount,
                'vehicles' => $vehicles->count(),
            ],
            'recent_trips' => $allRecent, 
        ]);
    }

    public function admin()
    {
        $totalUsers = User::count();
        $activeTrips = TransportRequest::where('status', 'In-Transit')->count() + Pool::where('status', 'In-Transit')->count();
        
        // Sum of all payment_amount where the farmer has paid (all transport requests)
        $totalRevenue = TransportRequest::sum('payment_amount');

        // Dynamic pool fill rate
        $pools = Pool::all();
        $totalRate = 0;
        $poolCount = $pools->count();
        if ($poolCount > 0) {
            foreach ($pools as $pool) {
                $totalRate += ($pool->current_weight / max(1, $pool->total_capacity)) * 100;
            }
            $fillRate = round($totalRate / $poolCount) . '%';
        } else {
            $fillRate = '0%';
        }

        // Avg trip cost
        $avgTripCost = TransportRequest::avg('payment_amount') ?? 0;
        
        // Completed requests count
        $completedTrips = TransportRequest::where('status', 'Completed')->count();

        // Farmer cost saved
        $requests = TransportRequest::all();
        $costSaved = 0;
        $completedRequests = $requests->where('status', 'Completed');
        foreach ($completedRequests as $req) {
            if ($req->pool_id) {
                $payout = $req->payout ?? ($req->weight * 5.5);
                $directCost = $req->weight * 10;
                if ($directCost > $payout) {
                    $costSaved += ($directCost - $payout);
                }
            }
        }
        $farmerCount = User::where('role', 'farmer')->count();
        $avgCostSaved = $farmerCount > 0 ? round($costSaved / $farmerCount) : 0;

        // Dynamic fleet utilization based on vehicles
        $totalVehicles = Vehicle::count();
        $busyVehicles = Vehicle::where('status', 'On-Trip')->count();
        $utilization = $totalVehicles > 0 ? round(($busyVehicles / $totalVehicles) * 100) : 0;

        // Monthly reports
        $monthlyData = [];
        $allRequests = TransportRequest::where('status', 'Completed')->get();
        foreach ($allRequests as $req) {
            $dateStr = $req->preferred_date;
            if ($dateStr) {
                $month = date('M', strtotime($dateStr));
                if (!isset($monthlyData[$month])) {
                    $monthlyData[$month] = ['total' => 0, 'pooled' => 0];
                }
                $monthlyData[$month]['total']++;
                if ($req->pool_id) {
                    $monthlyData[$month]['pooled']++;
                }
            }
        }
        $reports = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        foreach ($months as $m) {
            if (isset($monthlyData[$m])) {
                $reports[] = [
                    'month' => $m,
                    'total' => $monthlyData[$m]['total'],
                    'pooled' => $monthlyData[$m]['pooled']
                ];
            }
        }
        if (empty($reports)) {
            $reports[] = ['month' => date('M'), 'total' => 0, 'pooled' => 0];
        }

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'active_trips' => $activeTrips,
                'revenue' => '₹' . number_format($totalRevenue),
                'pool_fill_rate' => $fillRate,
                'avg_trip_cost' => '₹' . number_format($avgTripCost),
                'completed_trips' => $completedTrips,
                'co2_saved' => number_format(($completedTrips * 0.05), 1) . ' t',
                'avg_cost_saved' => '₹' . number_format($avgCostSaved),
                'utilization' => $utilization . '%',
            ],
            'reports' => $reports,
            'recent_activity' => TransportRequest::with('farmer')->latest()->take(5)->get(),
        ]);
    }
}
