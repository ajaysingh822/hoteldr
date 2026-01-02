<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class HistoryController extends BaseController
{public function index()
{
    $db = \Config\Database::connect();

    $page  = (int) ($this->request->getGet('page') ?? 1);
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $search = $this->request->getGet('q');
    $date   = $this->request->getGet('date');

    $builder = $db->table('guests g')
        ->select('
            g.id as guest_id,
            g.name,
            g.mobile,
            g.room_no,
            g.members,
            g.vehicle_no,
            g.rate,
            g.check_in_time,
            MAX(
          CASE 
            WHEN p.type = "final" 
            THEN p.checkout_receptionist 
          END
        ) as checkout_receptionist,
            g.check_out_time,
            (
          g.rate * 
          GREATEST(1, DATEDIFF(g.check_out_time, g.check_in_time))
          + IFNULL(SUM(ec.amount),0)
        ) as grand_total
        ')
          ->join('extra_charges ec', 'ec.guest_id = g.id', 'left')
          ->join('payments p', 'p.guest_id = g.id ', 'left')
        ->where('g.status', 'checked_out')
        ->groupBy('g.id')
        ->orderBy('g.id', 'DESC');

    // 🔍 Search
    if ($search) {
        $builder->groupStart()
            ->like('g.name', $search)
            ->orLike('g.room_no', $search)
            ->orLike('g.mobile', $search)
            ->groupEnd();
    }

    // 📅 Checkout date filter
    if ($date) {
        $builder->where('DATE(g.check_out_time)', $date);
    }

    $total = $builder->countAllResults(false);

    $rows = $builder
        ->limit($limit, $offset)
        ->get()
        ->getResultArray();

    return $this->response->setJSON([
        'status' => 'success',
        'rows' => $rows,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => ceil($total / $limit)
        ]
    ]);
}
public function view($guestId)
{
    $db = \Config\Database::connect();

    $guest = $db->table('guests')
        ->where('id', $guestId)
        ->get()
        ->getRowArray();

    if (!$guest) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Guest not found'
        ]);
    }

    $payments = $db->table('payments')
        ->where('guest_id', $guestId)
        ->get()
        ->getResultArray();
    $advancePaid = 0;
    $finalPaid = 0;
    
    foreach ($payments as $p) {
      
        if ($p['type'] === 'advance') {
            $advancePaid += $p['amount'];
            //   $checkout_receptionist = 'checkout_receptionist';
        } 
        else {
            $finalPaid += $p['amount'];
             $checkout_receptionist = $p['checkout_receptionist'];
        }
    }

    $totalPaid = $advancePaid + $finalPaid;

    $charges = $db->table('extra_charges')
        ->where('guest_id', $guestId)
        ->get()
        ->getResultArray();

    $extraTotal = array_sum(array_column($charges, 'amount'));

    // 🕒 Days calculation
    $days = 1;
    if ($guest['check_in_time'] && $guest['check_out_time']) {
        $in  = new \DateTime($guest['check_in_time']);
        $out = new \DateTime($guest['check_out_time']);
        $days = max(1, $in->diff($out)->days);
    }

    $roomTotal  = $guest['rate'] * $days;
    $grandTotal = $roomTotal + $extraTotal;
    $balance    = $grandTotal - $totalPaid;

    return $this->response->setJSON([
        'status' => 'success',
        'bill' => [
            'guest_id' => $guest['id'],
            'guest' => $guest['name'],
            'mobile' => $guest['mobile'],
            'room_no' => $guest['room_no'],
            'members' => $guest['members'],
            'vehicle_no' => $guest['vehicle_no'],
            'rate' => $guest['rate'],
            'days' => $days,
            'room_total' => $roomTotal,
            'extra_total' => $extraTotal,
            'grand_total' => $grandTotal,
            'advance_paid' => $advancePaid,
            'final_paid' => $finalPaid,
            'total_paid' => $totalPaid,
            'checkout_receptionist' => $checkout_receptionist,
            'check_in_time' => $guest['check_in_time'],
            'check_out_time' => $guest['check_out_time'],
        ],
        'charges' => $charges
    ]);
}

}
