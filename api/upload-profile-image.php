<?php
// TrackMate - Upload Profile Image API
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in JSON response

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/config.php';

// Check if GD library is available
if (!extension_loaded('gd')) {
    echo json_encode(['success' => false, 'message' => 'GD library is not installed. Please enable it in php.ini']);
    exit;
}

/**
 * Resize and crop image to square format
 * @param string $sourcePath - Path to source image
 * @param string $mimeType - MIME type of image
 * @param int $width - Target width
 * @param int $height - Target height
 * @return resource|false - GD image resource or false on failure
 */
function resizeAndCropImage($sourcePath, $mimeType, $width, $height) {
    try {
        // Create image from source based on type
        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                $sourceImage = @imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $sourceImage = @imagecreatefrompng($sourcePath);
                break;
            case 'image/gif':
                $sourceImage = @imagecreatefromgif($sourcePath);
                break;
            case 'image/webp':
                if (function_exists('imagecreatefromwebp')) {
                    $sourceImage = @imagecreatefromwebp($sourcePath);
                } else {
                    error_log("WebP support not available");
                    return false;
                }
                break;
            default:
                error_log("Unsupported MIME type: " . $mimeType);
                return false;
        }
        
        if (!$sourceImage) {
            error_log("Failed to create image from source: " . $sourcePath);
            return false;
        }
        
        // Get original dimensions
        $sourceWidth = imagesx($sourceImage);
        $sourceHeight = imagesy($sourceImage);
        
        // Calculate crop dimensions (center crop to square)
        $cropSize = min($sourceWidth, $sourceHeight);
        $cropX = ($sourceWidth - $cropSize) / 2;
        $cropY = ($sourceHeight - $cropSize) / 2;
        
        // Create new image
        $destImage = imagecreatetruecolor($width, $height);
        
        if (!$destImage) {
            imagedestroy($sourceImage);
            error_log("Failed to create destination image");
            return false;
        }
        
        // Preserve transparency for PNG
        imagealphablending($destImage, false);
        imagesavealpha($destImage, true);
        $transparent = imagecolorallocatealpha($destImage, 255, 255, 255, 127);
        imagefilledrectangle($destImage, 0, 0, $width, $height, $transparent);
        imagealphablending($destImage, true);
        
        // Crop and resize
        $result = imagecopyresampled(
            $destImage, 
            $sourceImage, 
            0, 0, 
            $cropX, $cropY, 
            $width, $height, 
            $cropSize, $cropSize
        );
        
        imagedestroy($sourceImage);
        
        if (!$result) {
            imagedestroy($destImage);
            error_log("Failed to resample image");
            return false;
        }
        
        return $destImage;
    } catch (Exception $e) {
        error_log("Error in resizeAndCropImage: " . $e->getMessage());
        return false;
    }
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    $errorMsg = 'No file uploaded';
    if (isset($_FILES['profile_image']['error'])) {
        switch ($_FILES['profile_image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMsg = 'File is too large';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'File was only partially uploaded';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMsg = 'No file was uploaded';
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $errorMsg = 'Missing temporary folder';
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $errorMsg = 'Failed to write file to disk';
                break;
            case UPLOAD_ERR_EXTENSION:
                $errorMsg = 'File upload stopped by extension';
                break;
        }
    }
    echo json_encode(['success' => false, 'message' => $errorMsg]);
    exit;
}

$file = $_FILES['profile_image'];
$userId = $_SESSION['user_id'];

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed']);
    exit;
}

// Validate file size (5MB max)
$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File size exceeds 5MB limit']);
    exit;
}

// Create uploads directory if it doesn't exist
$uploadDir = '../uploads/profile-images/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$fileExtension = 'jpg'; // Always save as JPG for consistency
$newFileName = 'profile_' . $userId . '_' . time() . '.' . $fileExtension;
$targetPath = $uploadDir . $newFileName;

// Resize and crop image to circular format (300x300)
$resizedImage = resizeAndCropImage($file['tmp_name'], $fileType, 300, 300);

if ($resizedImage === false) {
    error_log("Image resize failed for user $userId, file type: $fileType");
    echo json_encode(['success' => false, 'message' => 'Failed to process image. Please try a different image format.']);
    exit;
}

// Save resized image
if (!@imagejpeg($resizedImage, $targetPath, 90)) {
    imagedestroy($resizedImage);
    error_log("Failed to save JPEG for user $userId to: $targetPath");
    echo json_encode(['success' => false, 'message' => 'Failed to save processed image. Check folder permissions.']);
    exit;
}

imagedestroy($resizedImage);

// Update database
try {
    $pdo = getDBConnection();
    $imagePath = 'uploads/profile-images/' . $newFileName;
    
    $stmt = $pdo->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
    $stmt->execute([$imagePath, $userId]);
    
    // Get updated user data
    $stmt = $pdo->prepare("SELECT id, username, email, full_name, profile_image, gender, age, height, weight FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Profile image uploaded successfully',
        'image_path' => $imagePath,
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    // Delete uploaded file if database update fails
    if (file_exists($targetPath)) {
        unlink($targetPath);
    }
    
    error_log("Database error in upload-profile-image.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error in upload-profile-image.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
