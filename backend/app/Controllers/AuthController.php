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


}