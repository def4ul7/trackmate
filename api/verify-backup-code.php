<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$required = ['email', 'backup_code'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
        exit();
    }
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$backupCode = trim($data['backup_code']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Get user with backup codes
    $stmt = $conn->prepare("SELECT id, username, backup_codes FROM users WHERE email = :email AND is_active = 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or backup code']);
        exit();
    }
    
    if (!$user['backup_codes']) {
        echo json_encode(['success' => false, 'message' => 'No backup codes found for this account. Please use email recovery.']);
        exit();
    }
    
    // Decode backup codes
    $backupCodes = json_decode($user['backup_codes'], true);
    
    if (!is_array($backupCodes) || empty($backupCodes)) {
        echo json_encode(['success' => false, 'message' => 'No backup codes available. Please use email recovery.']);
        exit();
    }
    
    // Check if backup code matches any of the stored codes
    $codeValid = false;
    $usedCodeIndex = -1;
    
    foreach ($backupCodes as $index => $storedCode) {
        if (isset($storedCode['used']) && $storedCode['used']) {
            continue; // Skip used codes
        }
        
        if (password_verify($backupCode, $storedCode['hash'])) {
            $codeValid = true;
            $usedCodeIndex = $index;
            break;
        }
    }
    
    if (!$codeValid) {
        echo json_encode(['success' => false, 'message' => 'Invalid or already used backup code']);
        exit();
    }
    
    // Mark the backup code as used
    $backupCodes[$usedCodeIndex]['used'] = true;
    $backupCodes[$usedCodeIndex]['used_at'] = date('Y-m-d H:i:s');
    
    // Generate reset token
    $resetToken = bin2hex(random_bytes(32));
    $tokenExpiry = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry
    
    // Update user with marked backup code and reset token
    $updateStmt = $conn->prepare(
        "UPDATE users SET backup_codes = :codes, reset_token = :token, reset_token_expiry = :expiry WHERE id = :id"
    );
    $updateStmt->execute([
        'codes' => json_encode($backupCodes),
        'token' => password_hash($resetToken, PASSWORD_DEFAULT),
        'expiry' => $tokenExpiry,
        'id' => $user['id']
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Backup code verified successfully!',
        'token' => $resetToken
    ]);
    
} catch(PDOException $e) {
    error_log("Verify Backup Code Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}
?>
