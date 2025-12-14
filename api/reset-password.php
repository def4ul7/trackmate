<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$required = ['email', 'token', 'password', 'confirm_password'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
        exit();
    }
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$token = $data['token'];
$password = $data['password'];
$confirmPassword = $data['confirm_password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit();
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Get user with reset token
    $stmt = $conn->prepare(
        "SELECT id, reset_token, reset_token_expiry FROM users 
         WHERE email = :email AND reset_token IS NOT NULL"
    );
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
        exit();
    }
    
    // Check if token is expired
    if (strtotime($user['reset_token_expiry']) < time()) {
        echo json_encode(['success' => false, 'message' => 'Reset token has expired. Please request a new one.']);
        exit();
    }
    
    // Verify token
    if (!password_verify($token, $user['reset_token'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid reset token']);
        exit();
    }
    
    // Hash new password
    $hashedPassword = password_hash($password, PASSWORD_HASH_ALGO, ['cost' => PASSWORD_HASH_COST]);
    
    // Update password and clear reset token
    $updateStmt = $conn->prepare(
        "UPDATE users SET password = :password, reset_token = NULL, reset_token_expiry = NULL 
         WHERE id = :id"
    );
    $updateStmt->execute([
        'password' => $hashedPassword,
        'id' => $user['id']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Password reset successfully! You can now login with your new password.'
    ]);
    
} catch(PDOException $e) {
    error_log("Reset Password Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}
?>
