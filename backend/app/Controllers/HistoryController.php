<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class HistoryController extends BaseController
{
   
    public function index()
    {
        $db = \Config\Database::connect();

        $page  = (int) ($this->request->getGet('page') ?? 1);
        $limit = 20;
        $offset = ($page - 1) * $limit;

        $search = $this->request->getGet('q');
        $date   = $this->request->getGet('date'); // 🔥 YYYY-MM-DD

        $builder = $db->table('payments p')
            ->select('
                p.id as bill_id,
                p.amount,
                p.payment_method,
                p.created_at,
                g.name,
            
    g.mobile,
    g.room_no,
    g.members,
    g.vehicle_no,
    g.rate,
    g.check_in_time,
    g.check_out_time
            ')
            ->join('guests g', 'g.id = p.guest_id')
            ->where('p.type', 'final')
            ->orderBy('p.id', 'DESC');

        // 🔍 Search filter
        if ($search) {
            $builder->groupStart()
                ->like('g.name', $search)
                ->orLike('g.room_no', $search)
                ->orLike('p.id', $search)
                ->groupEnd();
        }

        // 📅 Date filter
        if ($date) {
            $builder->where('DATE(p.created_at)', $date);
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
    public function view($billId)
{
    $db = \Config\Database::connect();

    // payment + guest
    $bill = $db->table('payments p')
        ->select('
            p.id as bill_id,
            p.amount as paid_amount,
            p.payment_method,
            p.created_at as paid_at,
            g.id as guest_id,
            g.name,
            g.room_no,
            g.rate,
            g.check_in_time,
            g.check_out_time
        ')
        ->join('guests g', 'g.id = p.guest_id')
        ->where('p.id', $billId)
        ->get()
        ->getRowArray();

    if (!$bill) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Bill not found'
        ]);
    }

    // extra charges
    $charges = $db->table('extra_charges')
        ->where('guest_id', $bill['guest_id'])
        ->get()
        ->getResultArray();

    $extraTotal = array_sum(array_column($charges, 'amount'));

    // days stayed (safe)
    $days = 1;
    if (!empty($bill['check_in_time']) && !empty($bill['check_out_time'])) {
        $in  = new \DateTime($bill['check_in_time']);
        $out = new \DateTime($bill['check_out_time']);
        $days = max(1, $in->diff($out)->days);
    }

    $roomTotal = $bill['rate'] * $days;
    $grandTotal = $roomTotal + $extraTotal;

    return $this->response->setJSON([
        'status' => 'success',
        'bill' => [
            'bill_id' => $bill['bill_id'],
            'guest' => $bill['name'],
            'room_no' => $bill['room_no'],
            'payment_method' => $bill['payment_method'],
            'paid_at' => $bill['paid_at'],
            'days' => $days,
            'rate' => $bill['rate'],
            'room_total' => $roomTotal,
            'extra_total' => $extraTotal,
            'grand_total' => $grandTotal,
        ],
        'charges' => $charges
    ]);
}

}
