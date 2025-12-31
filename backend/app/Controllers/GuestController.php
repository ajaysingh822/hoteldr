<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\GuestModel;

class GuestController extends BaseController
{
    /* ================= CHECK IN ================= */
    public function checkIn()
    {
        $db = \Config\Database::connect();
        $guestModel = new GuestModel();

        $name      = $this->request->getPost('name');
        $mobile    = $this->request->getPost('mobile');
        $roomNo    = $this->request->getPost('room_no');
        $rate      = (int)$this->request->getPost('rate');
        $idType    = $this->request->getPost('id_type');
        $members   = (int)$this->request->getPost('members');
        $vehicleNo = $this->request->getPost('vehicle_no');
        $advance   = (int)($this->request->getPost('advance') ?? 0);

        if (
            empty($name) ||
            empty($mobile) ||
            empty($roomNo) ||
            empty($idType) ||
            $rate <= 0 ||
            $members <= 0
        ) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'All fields are required'
            ]);
        }

        /* 🔥 INSERT GUEST FIRST */
        $guestModel->insert([
            'name'         => $name,
            'mobile'       => $mobile,
            'room_no'      => $roomNo,
            'rate'         => $rate,
            'id_type'      => $idType,
            'members'      => $members,
            'vehicle_no'   => $vehicleNo,
            'advance_paid' => $advance,
            'status'       => 'checked_in',
            'check_in_time'=> date('Y-m-d H:i:s')
        ]);

        $guestId = $guestModel->getInsertID(); // ✅ CORRECT PLACE

        /* 🔥 INSERT ADVANCE PAYMENT (OPTIONAL) */
        if ($advance > 0) {
            $db->table('payments')->insert([
                'guest_id' => $guestId,
                'amount' => $advance,
                'payment_method' => 'cash',
                'status' => 'paid',
                'type' => 'advance',
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Customer checked in successfully'
        ]);
    }

    /* ================= CHECKED IN LIST ================= */
    public function checkedInGuests()
    {
        $db = \Config\Database::connect();

        $guests = $db->table('guests g')
            ->select('g.id, g.name, g.room_no, g.rate,
                IFNULL(SUM(ec.amount),0) as extra_total')
            ->join('extra_charges ec', 'ec.guest_id = g.id', 'left')
            ->where('g.status', 'checked_in')
            ->groupBy('g.id')
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'status' => 'success',
            'guests' => $guests
        ]);
    }

    /* ================= SINGLE GUEST ================= */
    public function getGuest($id)
    {
        $db = \Config\Database::connect();

        $guest = $db->table('guests')->where('id', $id)->get()->getRowArray();
        $charges = $db->table('extra_charges')->where('guest_id', $id)->get()->getResultArray();

        $extraTotal = array_sum(array_column($charges, 'amount'));

        $advancePaid = $db->table('payments')
            ->selectSum('amount')
            ->where('guest_id', $id)
            ->where('type', 'advance')
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status' => 'success',
            'guest' => $guest,
            'charges' => $charges,
            'extra_total' => $extraTotal,
            'advance_paid' => $advancePaid
        ]);
    }

    /* ================= CHECKOUT ================= */
    public function checkout($id)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $payable = (int)$data['total'];

        // update guest
        $db->table('guests')
            ->where('id', $id)
            ->update([
                'status' => 'checked_out',
                'check_out_time' => date('Y-m-d H:i:s')
            ]);

        // final payment ONLY
        if ($payable > 0) {
            $db->table('payments')->insert([
                'guest_id' => $id,
                'amount' => $payable,
                'payment_method' => $data['payment_method'],
                'status' => 'paid',
                'type' => 'final',
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success'
        ]);
    }
}
