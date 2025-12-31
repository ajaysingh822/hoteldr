<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class HotelDashboardController extends BaseController
{
    public function index()
{
    $db = \Config\Database::connect();

    $occupied = $db->table('guests')
        ->where('status', 'checked_in')
        ->countAllResults();


//        $pendingIds = $db->table('guests')
//     ->select('id')
//     ->where('status', 'checked_in')
//     ->get()
//     ->getResultArray();

//     $guestIds = array_column($pendingIds, 'id');

//     $amounts = $db->table('extra_charges')
//     ->select('amount')
//     ->whereIn('guest_id', $guestIds)
//     ->get()
//     ->getResultArray();

//     $rate =$db->table('guests')
//     ->select('rate')
//     ->whereIn('status' , 'checked_in')
//     ->get()
//     ->getResultArray();

// $pending = $amounts + $rate ;
    // $pending = $db->table('extra_charges')
    //  ->select

$today = date('Y-m-d');

// ✅ Check-ins Today
$todayCheckins = $db->table('guests')
    ->where('DATE(check_in_time)', $today)
    ->countAllResults();

// ✅ Check-outs Today
$todayCheckouts = $db->table('guests')
    ->where('DATE(check_out_time)', $today)
    ->countAllResults();


    
// ✅ Check-outs Today
// $todayCheckouts = $db->table('guests')
//     ->where('status', 'checked_out')
//     ->where('DATE(updated_at)', $today)
//     ->countAllResults();

    $totalRooms = 25;
    $available = $totalRooms - $occupied;

    $todayRevenue = $db->table('payments')
        ->selectSum('amount')
        ->where('DATE(created_at)', date('Y-m-d'))
        ->get()
        ->getRow()
        ->amount ?? 0;

    $monthlyRevenue = $db->table('payments')
        ->selectSum('amount')
        ->where('MONTH(created_at)', date('m'))
        ->where('YEAR(created_at)', date('Y'))
        ->get()
        ->getRow()
        ->amount ?? 0;

    $pending = $db->table('payments')
        ->selectSum('amount')
        ->where('status', 'pending')
        ->get()
        ->getRow()
        ->amount ?? 0;

    $recentBills = $db->table('payments p')
        ->select('p.id, g.name, g.room_no, p.amount, p.status')
        ->join('guests g', 'g.id = p.guest_id')
        ->orderBy('p.id', 'DESC')
        ->limit(5)
        ->get()
        ->getResultArray();

    return $this->response->setJSON([
        'status' => 'success',
        'stats' => [
            'occupied' => $occupied,
            'available' => $available,
             'todayCheckins' => $todayCheckins,     // ✅ FIX
        'todayCheckouts' => $todayCheckouts, 
            'todayRevenue' => $todayRevenue,
            'monthlyRevenue' => $monthlyRevenue,
            'pending' => $pending,
        ],
        'recentBills' => $recentBills
    ]);
}

}
