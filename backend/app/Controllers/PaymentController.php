<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use CodeIgniter\RESTful\ResourceController;

class PaymentController extends ResourceController
{
    // already existing
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

    // 🔹 TODAY BILLS
    public function today()
    {
        $model = new PaymentModel();

        $start = date('Y-m-d 00:00:00');
        $end   = date('Y-m-d 23:59:59');

        return $this->respond(
            $model->where('payment_time >=', $start)
                  ->where('payment_time <=', $end)
                  ->orderBy('payment_time', 'DESC')
                  ->findAll()
        );
    }

    // 🔹 ALL HISTORY
    public function all()
    {
        $model = new PaymentModel();
        return $this->respond(
            $model->orderBy('payment_time', 'DESC')->findAll()
        );
    }
}

