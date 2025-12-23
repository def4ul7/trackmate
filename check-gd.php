<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GD Library Check - TrackMate</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status {
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .success {
            background: #d4edda;
            color: #155724;
            border: 2px solid #c3e6cb;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 2px solid #f5c6cb;
        }
        
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .info-item:last-child {
            border-bottom: none;
        }
        
        .label {
            font-weight: 600;
            color: #495057;
        }
        
        .value {
            color: #6c757d;
        }
        
        .success-icon {
            color: #28a745;
        }
        
        .error-icon {
            color: #dc3545;
        }
        
        .solution {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .solution h3 {
            color: #856404;
            margin-bottom: 15px;
        }
        
        .solution ol {
            margin-left: 20px;
            color: #856404;
        }
        
        .solution li {
            margin-bottom: 10px;
        }
        
        .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #d63384;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 GD Library Check</h1>
        
        <?php
        $gdEnabled = extension_loaded('gd');
        $gdInfo = [];
        
        if ($gdEnabled) {
            if (function_exists('gd_info')) {
                $gdInfo = gd_info();
            }
            
            echo '<div class="status success">';
            echo '<span class="success-icon">✅</span> ';
            echo 'GD Library is ENABLED and working!';
            echo '</div>';
            
            echo '<div class="info-box">';
            echo '<h3>GD Library Information:</h3>';
            
            if (!empty($gdInfo)) {
                foreach ($gdInfo as $key => $value) {
                    echo '<div class="info-item">';
                    echo '<span class="label">' . htmlspecialchars($key) . '</span>';
                    echo '<span class="value">' . (is_bool($value) ? ($value ? 'Yes' : 'No') : htmlspecialchars($value)) . '</span>';
                    echo '</div>';
                }
            }
            
            echo '<div class="info-item">';
            echo '<span class="label">imagecreatefromjpeg</span>';
            echo '<span class="value">' . (function_exists('imagecreatefromjpeg') ? '✅ Available' : '❌ Not Available') . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">imagecreatefrompng</span>';
            echo '<span class="value">' . (function_exists('imagecreatefrompng') ? '✅ Available' : '❌ Not Available') . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">imagecreatefromwebp</span>';
            echo '<span class="value">' . (function_exists('imagecreatefromwebp') ? '✅ Available' : '❌ Not Available') . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">imagejpeg</span>';
            echo '<span class="value">' . (function_exists('imagejpeg') ? '✅ Available' : '❌ Not Available') . '</span>';
            echo '</div>';
            
            echo '</div>';
            
            // Check upload directory
            $uploadDir = 'uploads/profile-images/';
            echo '<div class="info-box">';
            echo '<h3>Upload Directory:</h3>';
            
            echo '<div class="info-item">';
            echo '<span class="label">Directory Exists</span>';
            echo '<span class="value">' . (file_exists($uploadDir) ? '✅ Yes' : '❌ No') . '</span>';
            echo '</div>';
            
            if (file_exists($uploadDir)) {
                echo '<div class="info-item">';
                echo '<span class="label">Writable</span>';
                echo '<span class="value">' . (is_writable($uploadDir) ? '✅ Yes' : '❌ No') . '</span>';
                echo '</div>';
                
                echo '<div class="info-item">';
                echo '<span class="label">Full Path</span>';
                echo '<span class="value">' . htmlspecialchars(realpath($uploadDir)) . '</span>';
                echo '</div>';
            }
            
            echo '</div>';
            
            // Check PHP settings
            echo '<div class="info-box">';
            echo '<h3>PHP Upload Settings:</h3>';
            
            echo '<div class="info-item">';
            echo '<span class="label">upload_max_filesize</span>';
            echo '<span class="value">' . ini_get('upload_max_filesize') . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">post_max_size</span>';
            echo '<span class="value">' . ini_get('post_max_size') . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">max_execution_time</span>';
            echo '<span class="value">' . ini_get('max_execution_time') . ' seconds</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">memory_limit</span>';
            echo '<span class="value">' . ini_get('memory_limit') . '</span>';
            echo '</div>';
            
            echo '</div>';
            
        } else {
            echo '<div class="status error">';
            echo '<span class="error-icon">❌</span> ';
            echo 'GD Library is NOT ENABLED';
            echo '</div>';
            
            echo '<div class="solution">';
            echo '<h3>How to Enable GD Library in XAMPP:</h3>';
            echo '<ol>';
            echo '<li>Open <code>php.ini</code> file (from XAMPP Control Panel, click "Config" for Apache → PHP (php.ini))</li>';
            echo '<li>Find this line: <code>;extension=gd</code></li>';
            echo '<li>Remove the semicolon (<code>;</code>) to uncomment it: <code>extension=gd</code></li>';
            echo '<li>Save the file</li>';
            echo '<li>Restart Apache from XAMPP Control Panel</li>';
            echo '<li>Refresh this page to verify</li>';
            echo '</ol>';
            echo '</div>';
        }
        
        // Session check
        session_start();
        echo '<div class="info-box">';
        echo '<h3>Session Information:</h3>';
        
        echo '<div class="info-item">';
        echo '<span class="label">Session Active</span>';
        echo '<span class="value">' . (session_status() === PHP_SESSION_ACTIVE ? '✅ Yes' : '❌ No') . '</span>';
        echo '</div>';
        
        if (isset($_SESSION['user_id'])) {
            echo '<div class="info-item">';
            echo '<span class="label">User ID</span>';
            echo '<span class="value">' . htmlspecialchars($_SESSION['user_id']) . '</span>';
            echo '</div>';
            
            echo '<div class="info-item">';
            echo '<span class="label">Logged In</span>';
            echo '<span class="value">✅ Yes</span>';
            echo '</div>';
        } else {
            echo '<div class="info-item">';
            echo '<span class="label">Logged In</span>';
            echo '<span class="value">❌ No (Login required for uploads)</span>';
            echo '</div>';
        }
        
        echo '</div>';
        ?>
        
        <div class="btn-group">
            <a href="profile.html" class="btn btn-primary">Go to Profile</a>
            <a href="javascript:location.reload()" class="btn btn-primary">Refresh Check</a>
        </div>
    </div>
</body>
</html>
