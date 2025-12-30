<?php
namespace App\Controllers;

use App\Models\PaymentModel;
use CodeIgniter\RESTful\ResourceController;

class PaymentController extends ResourceController
{
    public function save()
    {
        $data = $this->request->getJSON(true);

        if (!isset($data['amount'])) {
            return $this->fail('Amount missing');
        }

        $model = new PaymentModel();
        $model->insert([
            'amount' => $data['amount']
        ]);

        return $this->respond([
            'status' => 'success'
        ]);
    }
}
