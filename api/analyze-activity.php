<?php
/**
 * Analyze Activity API
 * Connects to Python Flask server running the AI model
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get the image data from request
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['image'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No image data provided']);
        exit();
    }
    
    // Forward the request to Python Flask server
    $python_server = 'http://localhost:5000/analyze';
    
    $data = json_encode([
        'image' => $input['image']
    ]);
    
    $ch = curl_init($python_server);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 180); // 3 minutes timeout
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($curl_error) {
        http_response_code(503);
        echo json_encode([
            'error' => 'Cannot connect to AI server',
            'details' => $curl_error,
            'message' => 'Make sure Python Flask server is running on port 5000'
        ]);
        exit();
    }
    
    if ($http_code !== 200) {
        http_response_code($http_code);
        echo json_encode([
            'error' => 'AI server returned error',
            'http_code' => $http_code,
            'response' => $response
        ]);
        exit();
    }
    
    // Return the response from Python server
    echo $response;
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);
}
