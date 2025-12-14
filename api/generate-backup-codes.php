<?php
require_once '../config/config.php';

// This endpoint generates backup codes for a user
// Call this after successful signup or from user settings

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || empty($data['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit();
}

$userId = $data['user_id'];

try {
    $conn = getDBConnection();
    
    // Verify user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE id = :id");
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }
    
    // Generate 10 backup codes
    $backupCodes = [];
    $plainCodes = [];
    
    for ($i = 0; $i < 10; $i++) {
        // Generate a random 8-character alphanumeric code
        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        
        // Format: XXXX-XXXX for readability
        $formattedCode = substr($code, 0, 4) . '-' . substr($code, 4, 4);
        
        $plainCodes[] = $formattedCode;
        
        $backupCodes[] = [
            'hash' => password_hash($formattedCode, PASSWORD_DEFAULT),
            'used' => false,
            'created_at' => date('Y-m-d H:i:s')
        ];
    }
    
    // Store hashed backup codes
    $updateStmt = $conn->prepare("UPDATE users SET backup_codes = :codes WHERE id = :id");
    $updateStmt->execute([
        'codes' => json_encode($backupCodes),
        'id' => $userId
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Backup codes generated successfully',
        'codes' => $plainCodes
    ]);
    
} catch(PDOException $e) {
    error_log("Generate Backup Codes Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred generating backup codes']);
}
?>
