<?php
namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Database;

class AdminController extends Controller
{
    public function totalSale()
    {
        $db = Database::connect();

        $from = $this->request->getGet('from');
        $to   = $this->request->getGet('to');

        $builder = $db->table('restaurant_payments');
        $builder->selectSum('amount');

        if ($from && $to) {
            $builder->where("DATE(created_at) >=", $from);
            $builder->where("DATE(created_at) <=", $to);
        }

        $result = $builder->get()->getRow();

        return $this->response->setJSON([
            'total' => $result->amount ?? 0
        ]);
    }
}
