<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['username', 'email', 'password', 'full_name'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(['success' => false, 'message' => ucfirst($field) . ' is required']);
        exit();
    }
}

$username = trim($data['username']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];
$full_name = trim($data['full_name']);
$confirm_password = $data['confirm_password'] ?? '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Validate username (alphanumeric and underscore only, 3-50 chars)
if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    echo json_encode(['success' => false, 'message' => 'Username must be 3-50 characters (letters, numbers, underscore only)']);
    exit();
}

// Validate password strength
if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit();
}

// Check if passwords match
if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Check if username exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        exit();
    }
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit();
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_HASH_ALGO, ['cost' => PASSWORD_HASH_COST]);
    
    // Insert user
    $insertStmt = $conn->prepare(
        "INSERT INTO users (username, email, password, full_name) 
         VALUES (:username, :email, :password, :full_name)"
    );
    
    $insertStmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'full_name' => $full_name
    ]);
    
    $userId = $conn->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully! Please login.',
        'data' => [
            'user_id' => $userId,
            'username' => $username,
            'email' => $email
        ]
    ]);
    
} catch(PDOException $e) {
    error_log("Signup Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during registration']);
}
?>
