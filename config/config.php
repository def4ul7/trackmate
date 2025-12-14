<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'trackmate');

// Application settings
define('SITE_URL', 'http://localhost/trackmate');
define('APP_NAME', 'TrackMate');

// Session settings
define('SESSION_LIFETIME', 86400); // 24 hours in seconds

// Security settings
define('PASSWORD_HASH_ALGO', PASSWORD_BCRYPT);
define('PASSWORD_HASH_COST', 12);

// Email settings (for password reset)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com'); // Update this
define('SMTP_PASS', 'your-app-password'); // Update this
define('FROM_EMAIL', 'noreply@trackmate.com');
define('FROM_NAME', 'TrackMate');

// Database connection
function getDBConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $conn;
    } catch(PDOException $e) {
        error_log("Database Connection Error: " . $e->getMessage());
        die(json_encode(['success' => false, 'message' => 'Database connection failed']));
    }
}

// Configure session for cross-origin access
if (session_status() === PHP_SESSION_NONE) {
    // Session cookie settings for Tailscale and network access
    ini_set('session.cookie_lifetime', SESSION_LIFETIME);
    ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
    ini_set('session.cookie_domain', ''); // Empty allows any domain
    ini_set('session.cookie_path', '/');
    ini_set('session.cookie_samesite', 'None'); // Allow cross-site cookies
    ini_set('session.cookie_httponly', '1'); // Security
    
    // For Tailscale/network access, you may need to disable secure flag
    // Uncomment next line if using HTTPS
    // ini_set('session.cookie_secure', '1');
    
    session_start();
}

// CORS headers for API access from different IPs
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// CORS headers for API requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
