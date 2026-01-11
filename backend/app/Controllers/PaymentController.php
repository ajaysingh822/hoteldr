<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use CodeIgniter\RESTful\ResourceController;

class PaymentController extends ResourceController
{
    protected $format = 'json';

    // 🔹 SAVE PAYMENT
    public function save()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->failValidationErrors('No JSON data received');
        }

        if (!isset($data['amount']) || !isset($data['payment_mode'])) {
            return $this->failValidationErrors('Amount or payment mode missing');
        }

        $model = new PaymentModel();

        $model->insert([
            'amount'        => $data['amount'],
            'payment_mode'  => $data['payment_mode'],
            'payment_time'  => date('Y-m-d H:i:s'),
            'status'        => 'PAID'
        ]);

        return $this->respond([
            'status'  => 'success',
            'message' => 'Payment saved successfully'
        ], 200);
    }

    // 🔹 TODAY PAYMENTS
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

    // 🔹 ALL PAYMENTS
    public function all()
    {
        $model = new PaymentModel();

        return $this->respond(
            $model->orderBy('payment_time', 'DESC')->findAll()
        );
    }
}
