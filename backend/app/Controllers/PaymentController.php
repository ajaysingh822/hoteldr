<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use CodeIgniter\RESTful\ResourceController;

class PaymentController extends ResourceController
{
    public function save()
    {
        $data = $this->request->getJSON(true);

        if (!isset($data['amount']) || !isset($data['payment_mode'])) {
            return $this->fail('Amount or payment mode missing');
        }

        $model = new PaymentModel();
        $model->insert([
            'amount'        => $data['amount'],
            'payment_mode'  => $data['payment_mode'],
            'payment_time'  => date('Y-m-d H:i:s'),
            'status'        => 'PAID'
        ]);

        return $this->respond(['status' => 'success']);
    }
}
