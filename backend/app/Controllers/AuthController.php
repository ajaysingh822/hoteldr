<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\ExtraChargeModel;

class AuthController extends BaseController
{
 public function login()
{
    $data = $this->request->getJSON(true);

    if (!$data || !isset($data['username'], $data['password'])) {
        return $this->response
            ->setStatusCode(400)
            ->setJSON(['message' => 'Invalid payload']);
    }

    $username = trim($data['username']);
    $password = trim($data['password']);

    $db = \Config\Database::connect();

    $user = $db->table('users')
        ->where('username', $username)
        ->where('status', 1)
        ->get()
        ->getRowArray();

    if (!$user) {
        return $this->response
            ->setStatusCode(401)
            ->setJSON(['message' => 'User not found']);
    }

    // 🔍 DEBUG (NOW CORRECT)
    log_message('debug', 'INPUT PASSWORD = [' . $password . ']');
    log_message('debug', 'DB HASH = [' . substr($user['password'], 0, 20) . '...]');
    log_message(
        'debug',
        'VERIFY RESULT = ' . (password_verify($password, $user['password']) ? 'TRUE' : 'FALSE')
    );

    if (!password_verify($password, $user['password'])) {
        return $this->response
            ->setStatusCode(401)
            ->setJSON(['message' => 'Wrong password']);
    }

    session()->set([
        'logged_in' => true,
        'user_id'   => $user['id'],
        'role'      => $user['role']
    ]);

    return $this->response->setJSON(['status' => 'success']);
}
        public function changePassword()
{
    $data = $this->request->getJSON(true);

    if (
        empty($data['role']) ||
        empty($data['old_password']) ||
        empty($data['new_password'])
    ) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Invalid payload'
        ], 400);
    }

    $db = \Config\Database::connect();

    if ($data['role'] === 'admin') {
        // 🔹 ADMIN USER
        $user = $db->table('users')
            ->where('role', 'admin')
            ->where('status', 1)
            ->get()
            ->getRowArray();
    } else {
        // 🔹 SINGLE COUNTER USER
        $user = $db->table('users')
            ->where('role', 'counter')
            ->where('status', 1)
            ->get()
            ->getRowArray();
    }

    if (!$user) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => ucfirst($data['role']) . ' not found'
        ], 404);
    }

    // 🔐 verify old password
    if (!password_verify($data['old_password'], $user['password'])) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Old password incorrect'
        ], 401);
    }

    // 🔐 hash new password
    $newHash = password_hash($data['new_password'], PASSWORD_DEFAULT);

    $db->table('users')
        ->where('id', $user['id'])
        ->update(['password' => $newHash]);

    return $this->response->setJSON([
        'status' => 'success',
        'message' => ucfirst($data['role']) . ' password changed successfully'
    ]);
}


}