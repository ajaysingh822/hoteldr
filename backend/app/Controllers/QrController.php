<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class QrController extends ResourceController
{
    // 🔹 Generate QR token
    public function generate()
    {
        $token = bin2hex(random_bytes(16));

        $db = \Config\Database::connect();
        $db->table('qr_tokens')->insert([
            'token' => $token,
            'used' => 0,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+5 minutes'))
        ]);

        return $this->respond([
            'token' => $token
        ]);
    }

    // 🔹 Guest uploads image
    public function upload($token)
    {
        $db = \Config\Database::connect();

        $row = $db->table('qr_tokens')
            ->where('token', $token)
            ->where('used', 0)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->get()
            ->getRow();

        if (!$row) {
            return $this->fail('QR expired or invalid');
        }

        $file = $this->request->getFile('id_image');
        if (!$file || !$file->isValid()) {
            return $this->fail('Invalid image');
        }

        $name = $file->getRandomName();
        $file->move(WRITEPATH . 'uploads/ids', $name);

        $db->table('qr_tokens')
            ->where('id', $row->id)
            ->update([
                'image_path' => $name,
                'used' => 1
            ]);

        return $this->respond(['status' => 'success']);
    }

    // 🔹 Reception polls for image
    public function status($token)
    {
        $db = \Config\Database::connect();
        $row = $db->table('qr_tokens')->where('token', $token)->get()->getRow();

        if ($row && $row->image_path) {
            return $this->respond([
                'image_url' => base_url('uploads/ids/' . $row->image_path)
            ]);
        }

        return $this->respond([]);
    }
}
