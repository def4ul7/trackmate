<?php
require_once '../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Delete session from database if token exists
    if (isset($_SESSION['session_token'])) {
        $conn = getDBConnection();
        $stmt = $conn->prepare("DELETE FROM sessions WHERE session_token = :token");
        $stmt->execute(['token' => $_SESSION['session_token']]);
    }
    
    // Clear all session data
    $_SESSION = array();
    
    // Delete session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    
    // Destroy session
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
    
} catch(Exception $e) {
    error_log("Logout Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during logout']);
}
?>
