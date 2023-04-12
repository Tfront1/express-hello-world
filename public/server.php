<?php
header('Content-Type: application/json');

// зчитуємо дані з запиту
$data = json_decode(file_get_contents('php://input'), true);

// проводимо валідацію
$errors = array();
if (!preg_match('/^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґ]+$/', $data['name'])) {
  $errors['name'] = 'Invalid name';
}
if (!preg_match('/^.*-\d{2}$/', $data['group'])) {
  $errors['group'] = 'Invalid group';
}
if (!in_array($data['gender'], array('male', 'female', 'MALE', 'FEMALE'))) {
  $errors['gender'] = 'Invalid gender';
}
if (!preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $data['birthday'])) {
  $errors['birthday'] = 'Invalid birth date';
}

// відповідаємо на запит
if (count($errors) > 0) {
  $response = array('success' => false, 'errors' => $errors);
} else {
  $response = array('success' => true, 'message' => 'Дані успішно збережено');
}

echo json_encode($response);
?>