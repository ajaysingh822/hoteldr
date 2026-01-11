<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtraChargeModel;

class ExtraChargeController extends BaseController
{
    /* =====================================================
                ADD EXTRA CHARGES (BULK)
    ===================================================== */
    public function addBulk()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'JSON not received'
            ]);
        } 

        if (
            empty($data['guest_id']) ||
            empty($data['charges']) ||
            !is_array($data['charges'])
        ) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Invalid payload'
            ]);
        }

        $rows = [];
        foreach ($data['charges'] as $c) {
            if (!empty($c['title']) && (int)$c['amount'] > 0) {
                $rows[] = [
                    'guest_id' => (int)$data['guest_id'],
                    'title'    => $c['title'],
                    'amount'   => (int)$c['amount'],
                ];
            }
        }

        if (empty($rows)) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'No valid rows'
            ]);
        }

        (new ExtraChargeModel())->insertBatch($rows);

        return $this->response->setJSON([
            'status'   => 'success',
            'inserted'=> count($rows)
        ]);
    }

    /* =====================================================
       TODAY EXTRA TOTAL
    ===================================================== */
    public function todayTotal()
    {
        $db = \Config\Database::connect();

        $start = date('Y-m-d 00:00:00');
        $end   = date('Y-m-d 23:59:59');

        $total = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('created_at >=', $start)
            ->where('created_at <=', $end)
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status' => 'success',
            'total'  => (int)$total
        ]);
    }

    /* =====================================================
       MONTH EXTRA TOTAL
    ===================================================== */
    public function monthTotal()
    {
        $db = \Config\Database::connect();

        $total = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('MONTH(created_at)', date('m'))
            ->where('YEAR(created_at)', date('Y'))
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status' => 'success',
            'total'  => (int)$total
        ]);
    }

    /* =====================================================
       RANGE EXTRA TOTAL
    ===================================================== */
    public function rangeTotal()
    {
        $from = $this->request->getGet('from');
        $to   = $this->request->getGet('to');

        if (!$from || !$to) {
            return $this->response->setJSON([
                'status' => 'error',
                'message'=> 'from and to required'
            ], 400);
        }

        $db = \Config\Database::connect();

        $total = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('DATE(created_at) >=', $from)
            ->where('DATE(created_at) <=', $to)
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status' => 'success',
            'total'  => (int)$total
        ]);
    }

    /* =====================================================
       🔥 TODAY GRAND TOTAL (EXTRA + PAYMENT)
    ===================================================== */
    public function todayGrandTotal()
    {
        $db = \Config\Database::connect();

        $start = date('Y-m-d 00:00:00');
        $end   = date('Y-m-d 23:59:59');

        $extra = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('created_at >=', $start)
            ->where('created_at <=', $end)
            ->get()
            ->getRow()
            ->amount ?? 0;

        $payment = $db->table('restaurant_payments')
            ->selectSum('amount')
            ->where('payment_time >=', $start)
            ->where('payment_time <=', $end)
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status'         => 'success',
            'extra_total'   => (int)$extra,
            'payment_total' => (int)$payment,
            'grand_total'   => (int)$extra + (int)$payment
        ]);
    }

    /* =====================================================
       🔥 MONTH GRAND TOTAL (EXTRA + PAYMENT)
    ===================================================== */
    public function monthGrandTotal()
    {
        $db = \Config\Database::connect();

        $extra = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('MONTH(created_at)', date('m'))
            ->where('YEAR(created_at)', date('Y'))
            ->get()
            ->getRow()
            ->amount ?? 0;

        $payment = $db->table('restaurant_payments')
            ->selectSum('amount')
            ->where('MONTH(payment_time)', date('m'))
            ->where('YEAR(payment_time)', date('Y'))
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status'         => 'success',
            'extra_total'   => (int)$extra,
            'payment_total' => (int)$payment,
            'grand_total'   => (int)$extra + (int)$payment
        ]);
    }

    /* =====================================================
       🔥 RANGE GRAND TOTAL (EXTRA + PAYMENT)
    ===================================================== */
    public function rangeGrandTotal()
    {
        $from = $this->request->getGet('from');
        $to   = $this->request->getGet('to');

        if (!$from || !$to) {
            return $this->response->setJSON([
                'status' => 'error',
                'message'=> 'from and to required'
            ], 400);
        }

        $db = \Config\Database::connect();

        $extra = $db->table('extra_charges')
            ->selectSum('amount')
            ->where('DATE(created_at) >=', $from)
            ->where('DATE(created_at) <=', $to)
            ->get()
            ->getRow()
            ->amount ?? 0;

        $payment = $db->table('restaurant_payments')
            ->selectSum('amount')
            ->where('DATE(payment_time) >=', $from)
            ->where('DATE(payment_time) <=', $to)
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status'         => 'success',
            'extra_total'   => (int)$extra,
            'payment_total' => (int)$payment,
            'grand_total'   => (int)$extra + (int)$payment
        ]);
    }
}
