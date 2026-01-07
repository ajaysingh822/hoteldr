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
    

$today = date('Y-m-d');

// ✅ Check-ins Today
$todayCheckins = $db->table('guests')
    ->where('DATE(check_in_time)', $today)
    ->countAllResults();

// ✅ Check-outs Today
$todayCheckouts = $db->table('guests')
    ->where('DATE(check_out_time)', $today)
    ->countAllResults();
 


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

$occupiedRooms = $db->table('guests')
        ->select('room_no')
        ->where('status', 'checked_in')
        ->orderBy('room_no', 'ASC')
        ->get()
        ->getResultArray();

    $recentBills = $db->table('payments p')
        ->select('p.id, g.name, g.room_no, p.amount, p.status , p.checkout_receptionist')
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
            // 'room' => $room_no ,
             'occupied' => $occupied,
             'todayCheckins' => $todayCheckins,     // ✅ FIX
        'todayCheckouts' => $todayCheckouts, 
            'todayRevenue' => $todayRevenue,
            'monthlyRevenue' => $monthlyRevenue,
          
            // 'checkout_receptionist' => $checkout_receptionist,
        ],
        'recentBills' => $recentBills,
        'occupied_rooms' => $occupiedRooms
    ]);
}

}
