<?php

namespace App\Controllers;

use App\Models\PaymentModel;
use CodeIgniter\RESTful\ResourceController;

class RestaurantHistoryController extends ResourceController
{
    public function index()
    {
        $date = $this->request->getGet('date'); // YYYY-MM-DD

        $model = new PaymentModel();

        if ($date) {
            // sirf aaj ke bills
            $data = $model
                ->where('DATE(payment_time)', $date)
                ->orderBy('payment_time', 'DESC')
                ->findAll();
        } else {
            // fallback: sab bills
            $data = $model
                ->orderBy('payment_time', 'DESC')
                ->findAll();
        }

        return $this->respond($data);
    }
}
