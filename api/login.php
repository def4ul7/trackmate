<?php
require_once '../config/config.php';

// Set JSON header
header('Content-Type: application/json');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Get user by email - fetch all user data
    $stmt = $conn->prepare("SELECT id, username, email, password, full_name, profile_image, gender, age, height, weight, membership_type, is_active FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit();
    }
    
    if (!$user['is_active']) {
        echo json_encode(['success' => false, 'message' => 'Account is deactivated. Please contact support.']);
        exit();
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit();
    }
    
    // Update last login
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
    $updateStmt->execute(['id' => $user['id']]);
    
    // Create session token
    $sessionToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);
    
    $sessionStmt = $conn->prepare(
        "INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at) 
         VALUES (:user_id, :token, :ip, :user_agent, :expires)"
    );
    $sessionStmt->execute([
        'user_id' => $user['id'],
        'token' => $sessionToken,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        'expires' => $expiresAt
    ]);
    
    // Set session data
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['session_token'] = $sessionToken;
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'id' => $user['id'],
            'user_id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'profile_image' => $user['profile_image'],
            'gender' => $user['gender'],
            'age' => $user['age'],
            'height' => $user['height'],
            'weight' => $user['weight'],
            'membership_type' => $user['membership_type'],
            'session_token' => $sessionToken
        ]
    ]);
    
} catch(PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during login']);
}
?>
