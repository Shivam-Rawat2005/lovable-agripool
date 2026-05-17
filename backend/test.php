<?php
$farmer = App\Models\User::where('role', 'farmer')->first();
Auth::loginUsingId($farmer->id);

$pool = App\Models\Pool::create(['driver_id' => 'abc', 'route_start'=>'A', 'route_end'=>'B', 'date'=>'2026-05-16', 'total_capacity'=>5000, 'status'=>'Open']);

$req = Illuminate\Http\Request::create('/api/requests', 'POST', ['crop_type' => 'Mixed', 'weight' => 500, 'pickup_location' => 'A', 'dropoff_location' => 'B', 'preferred_date' => '2026-05-16']);
$res1 = app()->handle($req);
echo "Req creation: " . $res1->getContent() . "\n";

$reqData = json_decode($res1->getContent());
$reqId = $reqData->request->id ?? null;

if ($reqId) {
    $req2 = Illuminate\Http\Request::create('/api/pools/' . $pool->id . '/join', 'POST', ['request_id' => $reqId]);
    $res2 = app()->handle($req2);
    echo "Join Pool: " . $res2->getContent() . "\n";
}
