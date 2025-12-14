<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || empty(trim($data['email']))) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit();
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id, username, full_name FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    
    // Always return success to prevent email enumeration
    if (!$user) {
        echo json_encode([
            'success' => true,
            'message' => 'If the email exists, a password reset link has been sent.'
        ]);
        exit();
    }
    
    // Generate reset token
    $resetToken = bin2hex(random_bytes(32));
    $tokenExpiry = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry
    
    // Update user with reset token
    $updateStmt = $conn->prepare(
        "UPDATE users SET reset_token = :token, reset_token_expiry = :expiry WHERE id = :id"
    );
    $updateStmt->execute([
        'token' => password_hash($resetToken, PASSWORD_DEFAULT),
        'expiry' => $tokenExpiry,
        'id' => $user['id']
    ]);
    
    // Create reset link
    $resetLink = SITE_URL . "/reset-password.html?token=" . $resetToken . "&email=" . urlencode($email);
    
    // In production, send email here
    // For development, log the link
    error_log("Password Reset Link: " . $resetLink);
    
    // Simulate sending email (in production, use PHPMailer or similar)
    /*
    $to = $email;
    $subject = "Password Reset - TrackMate";
    $message = "Hello " . $user['full_name'] . ",\n\n";
    $message .= "You requested a password reset. Click the link below to reset your password:\n\n";
    $message .= $resetLink . "\n\n";
    $message .= "This link will expire in 1 hour.\n\n";
    $message .= "If you didn't request this, please ignore this email.\n\n";
    $message .= "Best regards,\nTrackMate Team";
    $headers = "From: " . FROM_EMAIL;
    
    mail($to, $subject, $message, $headers);
    */
    
    echo json_encode([
        'success' => true,
        'message' => 'If the email exists, a password reset link has been sent.',
        'debug_link' => $resetLink // Remove this in production!
    ]);
    
} catch(PDOException $e) {
    error_log("Forgot Password Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}
?>
