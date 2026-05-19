<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🌾 Real Farmer
        User::updateOrCreate(
            ['email' => 'farmer@gmail.com'],
            [
                'name' => 'Ravi Kumar',
                'password' => Hash::make('1234567890'),
                'role' => 'farmer',
                'phone' => '+91 98765 43210',
                'farm_size' => 12,
                'location' => 'Pimpalgaon, Nashik, Maharashtra',
                'primary_crops' => 'Tomatoes, Onions, Grapes'
            ]
        );

        // 🌾 Demo Farmer
        User::updateOrCreate(
            ['email' => 'farmer@demo.com'],
            [
                'name' => 'Demo Farmer',
                'password' => Hash::make('password'),
                'role' => 'farmer',
                'phone' => '+91 99999 88888',
                'farm_size' => 10,
                'location' => 'Nashik, Maharashtra',
                'primary_crops' => 'Tomatoes, Onions'
            ]
        );

        // 🚚 Real Driver
        User::updateOrCreate(
            ['email' => 'driver@gmail.com'],
            [
                'name' => 'Vikram Singh',
                'password' => Hash::make('1234567890'),
                'role' => 'driver',
                'phone' => '+91 91234 56789'
            ]
        );

        // 🚚 Demo Driver
        User::updateOrCreate(
            ['email' => 'driver@demo.com'],
            [
                'name' => 'Demo Driver',
                'password' => Hash::make('password'),
                'role' => 'driver',
                'phone' => '+91 88888 77777'
            ]
        );

        // 🛡️ Admin
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'password' => Hash::make('1234567890'),
                'role' => 'admin',
            ]
        );
    }
}
