<?php
// Check if upload directory is writable
header('Content-Type: application/json');

$uploadDir = '../uploads/profile-images/';

$exists = file_exists($uploadDir);
$writable = is_writable($uploadDir);

// Try to create if doesn't exist
if (!$exists) {
    $exists = mkdir($uploadDir, 0755, true);
    $writable = is_writable($uploadDir);
}

echo json_encode([
    'exists' => $exists,
    'writable' => $writable,
    'path' => realpath($uploadDir)
]);
?>
