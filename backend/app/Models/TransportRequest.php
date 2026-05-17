<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class TransportRequest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'transport_requests';

    protected $fillable = [
        'farmer_id',
        'driver_id',
        'crop_type',
        'weight',
        'pickup_location',
        'dropoff_location',
        'preferred_date',
        'notes',
        'status',
        'pool_id',
        'payout',
    ];

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
