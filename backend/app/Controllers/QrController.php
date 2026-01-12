<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class QrController extends \CodeIgniter\Controller
{
    public function generate($guestId)
    {
        $token = bin2hex(random_bytes(16));

        db_connect()->table('qr_tokens')->insert([
            'guest_id'   => $guestId,
            'token'      => $token,
            'used'       => 0,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+5 minutes'))
        ]);

        return $this->response->setJSON(['token' => $token]);
    }

    public function upload($token)
    {
        $db = db_connect();

        $row = $db->table('qr_tokens')
            ->where('token', $token)
            ->where('used', 0)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->get()->getRow();

        if (!$row) {
            return $this->response->setJSON(['message' => 'Invalid QR'])->setStatusCode(400);
        }

          $file1 = $this->request->getFile('id_image');
        $file2 = $this->request->getFile('id_image2');

        $name1 = $file1->getRandomName();
        $name2 = $file2->getRandomName();

       $file1->move(FCPATH.'uploads/ids', $name1);
        $file2->move(FCPATH.'uploads/ids2', $name2);
        // 🔥 DIRECT SAVE TO GUEST TABLE
          $db->table('guests')->where('id', $row->guest_id)->update([
            'id_image'  => $name1,
            'id_image2' => $name2
        ]);

        $db->table('qr_tokens')->where('id', $row->id)->update(['used' => 1]);

        return $this->response->setJSON(['status' => 'success']);
    }
    public function uploadId($guestId)
{
    $front = $this->request->getFile('id_image');
    $back  = $this->request->getFile('id_image2');

    $frontName = $front->getRandomName();
    $backName  = $back->getRandomName();

    $front->move(FCPATH.'uploads/ids', $frontName);
    $back->move(FCPATH.'uploads/ids2', $backName);

    db_connect()->table('guests')->where('id', $guestId)->update([
        'id_image' => $frontName,
        'id_image2'  => $backName
    ]);

    return $this->response->setJSON(['status' => 'success']);
}

}
