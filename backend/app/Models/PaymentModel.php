<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model
{
    protected $table = 'restaurant_payments';
    protected $allowedFields = [
        'amount',
        'payment_mode',
        'payment_time',
        'status'
    ];
}