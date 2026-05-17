<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Pool extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'pools';

    protected $fillable = [
        'driver_id',
        'route_start',
        'route_end',
        'date',
        'total_capacity',
        'current_weight',
        'price_per_kg',
        'status',
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function transportRequests()
    {
        return $this->hasMany(TransportRequest::class, 'pool_id');
    }
}
