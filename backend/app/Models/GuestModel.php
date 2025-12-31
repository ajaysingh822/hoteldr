<?php

namespace App\Models;

use CodeIgniter\Model;

class GuestModel extends Model
{

     protected $table = 'guests';   // 🔥 YE LINE MISSING / GALAT THI
    protected $primaryKey = 'id';
    protected $allowedFields = [
  'name',
  'mobile',
  'id_image',
  'room_no',
  'id_type',
  'rate',
  'status',
     'advance_paid', 
  'check_in_time',
  'members',
'vehicle_no',

];

}
