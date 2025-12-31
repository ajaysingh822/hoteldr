<?php

namespace App\Models;

use CodeIgniter\Model;

class ExtraChargeModel extends Model
{
    protected $table = 'extra_charges';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'guest_id',
        'title',
        'amount'
    ];

    // 🔥 IMPORTANT FIX
    protected $useTimestamps = false;
}
