<?php
/**
 * Update User Profile API
 * Updates user profile information
 */

require_once '../config/config.php';

// Set JSON header (CORS headers already set in config.php)
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Session is already started in config.php, no need to start again

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    // Try to get user_id from request body as fallback
    $input = file_get_contents('php://input');
    $requestData = json_decode($input, true);
    
    if (isset($requestData['user_id']) && !empty($requestData['user_id'])) {
        $user_id = intval($requestData['user_id']);
    } else {
        error_log("Session data: " . print_r($_SESSION, true));
        error_log("Cookies: " . print_r($_COOKIE, true));
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated. Please login again.']);
        exit();
    }
} else {
    $user_id = $_SESSION['user_id'];
}

// Get JSON input (if not already read)
$input = file_get_contents('php://input');
$data = json_decode($input, true);
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (empty($data['full_name']) || empty($data['username']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Full name, username, and email are required']);
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

try {
    $conn = getDBConnection();
    
    // Check if username or email already exists for other users
    $checkStmt = $conn->prepare("
        SELECT id FROM users 
        WHERE (username = :username OR email = :email) 
        AND id != :user_id
    ");
    $checkStmt->execute([
        ':username' => $data['username'],
        ':email' => $data['email'],
        ':user_id' => $user_id
    ]);
    
    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
        exit();
    }
    
    // Prepare update query
    $updateFields = [
        'full_name' => $data['full_name'],
        'username' => $data['username'],
        'email' => $data['email'],
        'gender' => !empty($data['gender']) ? $data['gender'] : null,
        'age' => !empty($data['age']) ? intval($data['age']) : null,
        'height' => !empty($data['height']) ? floatval($data['height']) : null,
        'weight' => !empty($data['weight']) ? floatval($data['weight']) : null
    ];
    
    $stmt = $conn->prepare("
        UPDATE users 
        SET full_name = :full_name,
            username = :username,
            email = :email,
            gender = :gender,
            age = :age,
            height = :height,
            weight = :weight,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = :user_id
    ");
    
    $updateFields['user_id'] = $user_id;
    
    if ($stmt->execute($updateFields)) {
        // Fetch updated user data
        $userStmt = $conn->prepare("
            SELECT id, username, email, full_name, profile_image, gender, age, height, weight, 
                   membership_type, created_at 
            FROM users 
            WHERE id = :user_id
        ");
        $userStmt->execute([':user_id' => $user_id]);
        $updatedUser = $userStmt->fetch(PDO::FETCH_ASSOC);
        
        // Update session
        $_SESSION['username'] = $updatedUser['username'];
        $_SESSION['email'] = $updatedUser['email'];
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $updatedUser
        ]);
    } else {
        throw new Exception('Failed to update profile');
    }
    
} catch (PDOException $e) {
    error_log("Database error in update-profile.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    error_log("Error in update-profile.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
