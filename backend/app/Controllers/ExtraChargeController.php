<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtraChargeModel;

class ExtraChargeController extends BaseController
{

   
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
            'status' => 'success',
            'inserted' => count($rows)
        ]);
    }
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
        'total' => (int)$total
    ]);
}

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
        'total' => $total
    ]);
}
public function rangeTotal()
{
    $from = $this->request->getGet('from');
    $to   = $this->request->getGet('to');

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
        'total' => $total
    ]);
}

}
