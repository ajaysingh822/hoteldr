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
        $date   = $this->request->getGet('date');

        $builder = $db->table('guests g')
            ->select('
                g.id as guest_id,
                g.name,
                g.members,
                g.mobile,
                g.room_no,
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

        if ($search) {
            $builder->groupStart()
                ->like('g.name', $search)
                ->orLike('g.room_no', $search)
                ->orLike('g.mobile', $search)
                ->groupEnd();
        }

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

    // ================== DETAIL VIEW ==================
    public function view($guestId)
    {
        $db = \Config\Database::connect();

        // Guest
        $guest = $db->table('guests')
            ->where('id', $guestId)
            ->get()
            ->getRowArray();

        // Members
        $members = $db->table('guest_members')
            ->where('guest_id', $guestId)
            ->get()
            ->getResultArray();

        // ID image
        $imageUrl = !empty($guest['id_image'])
            ? base_url('uploads/ids/' . $guest['id_image'])
            : null;

        if (!$guest && !empty($members)) {
            $guest = [
                'id' => $guestId,
                'name' => '—',
                'mobile' => '—',
                'room_no' => '—',
                'members' => count($members) + 1,
                'vehicle_no' => null,
                'rate' => 0,
                'check_in_time' => null,
                'check_out_time' => null
            ];
        }

        if (!$guest) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Guest not found'
            ]);
        }

        // ================== CALCULATIONS (ADDED) ==================

        // Days
        $days = 1;
        if (!empty($guest['check_in_time']) && !empty($guest['check_out_time'])) {
            $days = max(
                1,
                (int) date_diff(
                    date_create($guest['check_in_time']),
                    date_create($guest['check_out_time'])
                )->days
            );
        }

        // Extra charges total
        $extraTotal = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('guest_id', $guestId)
            ->get()
            ->getRow()
            ->amount ?? 0;

        // Payments total
        $totalPaid = $db->table('payments')
            ->selectSum('amount')
            ->where('guest_id', $guestId)
            ->get()
            ->getRow()
            ->amount ?? 0;

        // Room + grand total
        $roomTotal  = $guest['rate'] * $days;
        $grandTotal = $roomTotal + $extraTotal;

        // ================== RESPONSE ==================
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
                'advance_paid' => 0,
                'total_paid' => $totalPaid,

                'id_image_url' => $imageUrl,
                'check_in_time' => $guest['check_in_time'],
                'check_out_time' => $guest['check_out_time'],
            ],
            'charges' => [],
               'members_list' => $members
        ]);
    }
}
