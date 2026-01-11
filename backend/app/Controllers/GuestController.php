<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\GuestModel;

class GuestController extends BaseController
{
    /* ================= CHECK IN ================= */
    public function checkIn()
    {
        $db = \Config\Database::connect();
        $guestModel = new GuestModel();

        // 🔹 BASIC FIELDS
        $name        = trim($this->request->getPost('name'));
        $mobile      = trim($this->request->getPost('mobile'));
        $roomNo      = trim($this->request->getPost('room_no'));
        $rate        = (int)$this->request->getPost('rate');
        $idType      = trim($this->request->getPost('id_type'));
        $memberCount = (int)$this->request->getPost('members');

        // 🔹 OPTIONAL FIELDS
        $vehicleNo   = trim($this->request->getPost('vehicle_no'));
        $advance     = (int)($this->request->getPost('advance') ?? 0);
        $comingfrom  = trim($this->request->getPost('comingfrom'));
        $comingto    = trim($this->request->getPost('comingto'));
        $idNumber    = trim($this->request->getPost('id_number'));
        $reception   = trim($this->request->getPost('reception'));

        // 🔹 VALIDATION
        if (
            $name === '' ||
            $mobile === '' ||
            $roomNo === '' ||
            $idType === '' ||
            $rate <= 0 ||
            $memberCount <= 0
        ) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'All required fields are mandatory'
            ]);
        }

        // 🔹 ID IMAGE HANDLE
$idImageName = null;
$idImageName2 = null;
$file = $this->request->getFile('id_image');
$file2 = $this->request->getFile('id_image2');

if ($file && $file->isValid() && !$file->hasMoved()) {

    // only allow images
    $allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($file->getMimeType(), $allowed)) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Invalid image type'
        ]);
    }

    $idImageName = $file->getRandomName();
$tempPath = $file->getTempName();
$finalPath = FCPATH . 'uploads/ids/' . $idImageName;

$this->compressImage($tempPath, $finalPath, 60);
}

if ($file2 && $file2->isValid() && !$file2->hasMoved()) {

    // only allow images
    $allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

    if (!in_array($file2->getMimeType(), $allowed)) {
        return $this->response->setJSON([
            'status' => 'error',
            'message' => 'Invalid image type'
        ]);
    }

    $idImageName2 = $file2->getRandomName();
  $tempPath = $file2->getTempName();
$finalPath = FCPATH . 'uploads/ids2/' . $idImageName2;

$this->compressImage($tempPath, $finalPath, 60);

}



        // 🔹 TRANSACTION START
        $db->transStart();

        /* ================= INSERT GUEST ================= */
        $guestModel->insert([
            'name'          => $name,
            'mobile'        => $mobile,
            'room_no'       => $roomNo,
            'comingfrom'    => $comingfrom,
            'comingto'      => $comingto,
            'id_number'     => $idNumber,
            'rate'          => $rate,
            'id_type'       => $idType,
            'members'       => $memberCount, // ✅ ONLY NUMBER
            'vehicle_no'    => $vehicleNo,
            'id_image'      => $idImageName,
            'id_image2'      => $idImageName2,
            'advance_paid'  => $advance,
            'reception'     => $reception,
            'status'        => 'checked_in',
            'check_in_time' => date('Y-m-d H:i:s'),
        ]);

        $guestId = $guestModel->getInsertID(); // ✅ NOW SAFE

        /* ================= INSERT ADDITIONAL MEMBERS ================= */
        $membersJson = $this->request->getPost('member_details');

        if (!empty($membersJson)) {
            $members = json_decode($membersJson, true);

            if (is_array($members)) {
                $rows = [];

                foreach ($members as $m) {
                    // skip fully empty member
                    if (
                        empty($m['name']) &&
                        empty($m['age']) &&
                        empty($m['sex']) &&
                        empty($m['id_number'])
                    ) {
                        continue;
                    }

                    $rows[] = [
                        'guest_id'  => $guestId,
                        'name'      => $m['name'] ?? null,
                        'age'       => $m['age'] ?? null,
                        'sex'       => $m['sex'] ?? null,
                        'id_number' => $m['id_number'] ?? null,
                    ];
                }

                if (!empty($rows)) {
                    $db->table('guest_members')->insertBatch($rows);
                }
            }
        }

        /* ================= INSERT ADVANCE PAYMENT ================= */
        if ($advance > 0) {
            $db->table('payments')->insert([
                'guest_id'        => $guestId,
                'amount'          => $advance,
                'payment_method'  => 'cash',
                'status'          => 'paid',
                'type'            => 'advance',
                'created_at'      => date('Y-m-d H:i:s')
            ]);
        }

        // 🔹 TRANSACTION END
        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Check-in failed'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Customer checked in successfully'
        ]);
    }

    /* ================= CHECKED IN LIST ================= */
    public function checkedInGuests()
    {
        $db = \Config\Database::connect();

        $guests = $db->table('guests g')
            ->select('g.id, g.name, g.room_no, g.rate, g.reception , 
                IFNULL(SUM(ec.amount),0) as extra_total', )
            ->join('extra_charges ec', 'ec.guest_id = g.id', 'left')
            ->where('g.status', 'checked_in')
            ->groupBy('g.id')
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'status' => 'success',
            'guests' => $guests
        ]);
    }

    /* ================= SINGLE GUEST ================= */
    public function getGuest($id)
    {
        $db = \Config\Database::connect();

        $guest = $db->table('guests')->where('id', $id)->get()->getRowArray();
        $charges = $db->table('extra_charges')->where('guest_id', $id)->get()->getResultArray();

        $extraTotal = array_sum(array_column($charges, 'amount'));

        $advancePaid = $db->table('payments')
            ->selectSum('amount')
            ->where('guest_id', $id)
            ->where('type', 'advance')
            ->get()
            ->getRow()
            ->amount ?? 0;

        return $this->response->setJSON([
            'status' => 'success',
            'guest' => $guest,
            'charges' => $charges,
            'extra_total' => $extraTotal,
            'advance_paid' => $advancePaid,
        ]);
    }

    /* ================= CHECKOUT ================= */
    public function checkout($id)
    {
        $data = $this->request->getJSON(true);
        $db = \Config\Database::connect();

        $payable = (int)$data['total'];
        $checkoutReceptionist = trim($data['checkout_receptionist'] ?? '');

        if ($checkoutReceptionist === '') {
            return $this->response
                ->setStatusCode(400)
                ->setJSON(['message' => 'Checkout receptionist required']);
        }

        // update guest
        $db->table('guests')
            ->where('id', $id)
            ->update([
                'status' => 'checked_out',
                'check_out_time' => date('Y-m-d H:i:s')
            ]);

        // final payment
        if ($payable > 0) {
            $db->table('payments')->insert([
                'guest_id' => $id,
                'amount' => $payable,
                'payment_method' => $data['payment_method'],
                'status' => 'paid',
                'type' => 'final',
                'checkout_receptionist' => $checkoutReceptionist,
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success'
        ]);
    }
    private function compressImage($sourcePath, $destinationPath, $quality = 60)
{
    $info = getimagesize($sourcePath);
    $mime = $info['mime'];

    if ($mime === 'image/jpeg') {
        $image = imagecreatefromjpeg($sourcePath);
        imagejpeg($image, $destinationPath, $quality);
    } elseif ($mime === 'image/png') {
        $image = imagecreatefrompng($sourcePath);
        imagepng($image, $destinationPath, 8); // 0(best) - 9(max)
    } elseif ($mime === 'image/webp') {
        $image = imagecreatefromwebp($sourcePath);
        imagewebp($image, $destinationPath, $quality);
    } else {
        return false;
    }

    imagedestroy($image);
    return true;
}

}
