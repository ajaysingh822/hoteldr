<?php

namespace App\Controllers;

class AdminController extends BaseController
{
    public function login()
    {
        $data = $this->request->getJSON(true);

        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $db = \Config\Database::connect();

        $user = $db->table('users')
            ->where('username', $username)
            ->where('role', 'admin')   // 🔥 direct admin
            ->where('status', 1)
            ->get()
            ->getRowArray();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Invalid admin credentials'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'admin' => [
                'id' => $user['id'],
                'username' => $user['username']
            ]
        ]);
    }
}
