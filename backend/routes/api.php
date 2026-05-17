<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransportRequestController;
use App\Http\Controllers\PoolController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', [AuthController::class, 'user']);
    
    // Dashboards
    Route::get('/dashboard/farmer', [DashboardController::class, 'farmer']);
    Route::get('/dashboard/driver', [DashboardController::class, 'driver']);
    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);

    // Admin Specific
    Route::get('/admin/users', function() {
        return \App\Models\User::all();
    });

    // Transport Requests
    Route::get('/requests', [TransportRequestController::class, 'index']);
    Route::post('/requests', [TransportRequestController::class, 'store']);

    // Pools
    Route::get('/pools', [PoolController::class, 'index']);
    Route::post('/pools', [PoolController::class, 'store']);
    Route::post('/pools/{id}/join', [PoolController::class, 'join']);

    // Vehicles
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);

    // Trips / Jobs
    Route::post('/jobs/request/{id}/accept', [\App\Http\Controllers\TripController::class, 'acceptRequest']);
    Route::post('/jobs/pool/{id}/accept', [\App\Http\Controllers\TripController::class, 'acceptPool']);
    Route::post('/jobs/{id}/{type}/start', [\App\Http\Controllers\TripController::class, 'startJob']);
    Route::post('/jobs/{id}/{type}/complete', [\App\Http\Controllers\TripController::class, 'completeJob']);
});
