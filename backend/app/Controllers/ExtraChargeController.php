<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtraChargeModel;

class ExtraChargeController extends BaseController
{

    public function addBulk1()
    {
        echo "OK_EXTRA_CHARGE";
        exit;
    }
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
}
