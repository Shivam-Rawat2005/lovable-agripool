<?php

namespace Database\Seeders;

use App\Models\Pool;
use Illuminate\Database\Seeder;

class PoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pool::create([
            'route_start' => 'Nashik',
            'route_end' => 'Mumbai APMC',
            'date' => '2026-05-18',
            'total_capacity' => 5000,
            'current_weight' => 3200,
            'status' => 'Open',
        ]);

        Pool::create([
            'route_start' => 'Ratnagiri',
            'route_end' => 'Mumbai APMC',
            'date' => '2026-05-19',
            'total_capacity' => 3500,
            'current_weight' => 2900,
            'status' => 'Open',
        ]);

        Pool::create([
            'route_start' => 'Kolhapur',
            'route_end' => 'Pune',
            'date' => '2026-05-22',
            'total_capacity' => 8000,
            'current_weight' => 1800,
            'status' => 'Open',
        ]);
    }
}
