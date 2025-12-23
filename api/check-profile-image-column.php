<?php
// Check if profile_image column exists in database
header('Content-Type: application/json');

require_once '../config/config.php';

try {
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'profile_image'");
    $column = $stmt->fetch();
    
    echo json_encode([
        'exists' => $column !== false,
        'column' => $column
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'exists' => false,
        'error' => 'Database error'
    ]);
}
?>
