<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    public function index()
    {
        return Vehicle::where('driver_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'plate_number' => 'required|string',
            'capacity' => 'required|numeric',
        ]);

        $vehicle = Vehicle::create([
            'driver_id' => Auth::id(),
            'type' => $request->type,
            'plate_number' => $request->plate_number,
            'capacity' => $request->capacity,
            'status' => 'Available',
        ]);

        return response()->json($vehicle, 201);
    }
}
