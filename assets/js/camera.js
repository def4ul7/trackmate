// TrackMate Camera JavaScript

// Check authentication
let user = null;
try {
    const userData = localStorage.getItem('trackmate_user');
    if (userData) {
        user = JSON.parse(userData);
    } else {
        window.location.href = 'login.html';
    }
} catch (e) {
    window.location.href = 'login.html';
}

let cameraStream = null;
let isRecording = false;
let mediaRecorder = null;
let recordedChunks = [];
let aiDetectionInterval = null;
let isAnalyzing = false;
let lastActivity = 'No activity detected yet';

// Update date
function updateDate() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = dateStr;
}

// Start camera
async function startCamera() {
    try {
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        };
        
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        const videoElement = document.getElementById('cameraFeed');
        const placeholder = document.getElementById('videoPlaceholder');
        const liveBadge = document.getElementById('liveBadge');
        
        videoElement.srcObject = cameraStream;
        videoElement.classList.add('active');
        placeholder.classList.add('hidden');
        
        liveBadge.textContent = 'Active';
        liveBadge.classList.remove('inactive');
        liveBadge.classList.add('active');
        
        // Enable controls
        document.getElementById('captureBtn').disabled = false;
        document.getElementById('recordBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false;
        
        // Update status
        document.getElementById('statusText').textContent = 'Camera monitoring is active';
        document.getElementById('cameraToggle').checked = true;
        
        // Add log entry
        addLogEntry('Camera monitoring started', '📷');
        
        // Start AI detection if enabled
        if (document.getElementById('motionDetection').checked) {
            startAIDetection();
        }
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions and try again.');
    }
}

// Stop camera
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        
        const videoElement = document.getElementById('cameraFeed');
        const placeholder = document.getElementById('videoPlaceholder');
        const liveBadge = document.getElementById('liveBadge');
        
        videoElement.classList.remove('active');
        videoElement.srcObject = null;
        placeholder.classList.remove('hidden');
        
        liveBadge.textContent = 'Inactive';
        liveBadge.classList.remove('active');
        liveBadge.classList.add('inactive');
        
        // Disable controls
        document.getElementById('captureBtn').disabled = true;
        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = true;
        
        // Update status
        document.getElementById('statusText').textContent = 'Camera monitoring is currently disabled';
        document.getElementById('cameraToggle').checked = false;
        
        // Stop recording if active
        if (isRecording) {
            toggleRecording();
        }
        
        // Stop AI detection
        stopAIDetection();
        
        addLogEntry('Camera monitoring stopped', '📷');
    }
}

// Capture snapshot
function captureSnapshot() {
    if (!cameraStream) return;
    
    const videoElement = document.getElementById('cameraFeed');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    
    // Convert to blob and create download link
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snapshot-${Date.now()}.png`;
        a.click();
        
        // Add to gallery
        addSnapshotToGallery(url);
        
        addLogEntry('Snapshot captured', '📸');
    });
}

// Toggle recording
function toggleRecording() {
    if (!cameraStream) return;
    
    const recordBtn = document.getElementById('recordBtn');
    
    if (!isRecording) {
        startRecording();
        recordBtn.innerHTML = '<span>⏹️</span> Stop Recording';
        recordBtn.classList.add('active');
        addLogEntry('Recording started', '⏺️');
    } else {
        stopRecording();
        recordBtn.innerHTML = '<span>⏺️</span> Record';
        recordBtn.classList.remove('active');
        addLogEntry('Recording stopped', '⏹️');
    }
}

// Start recording
function startRecording() {
    recordedChunks = [];
    
    mediaRecorder = new MediaRecorder(cameraStream, {
        mimeType: 'video/webm'
    });
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
    };
    
    mediaRecorder.start();
    isRecording = true;
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        isRecording = false;
    }
}

// Add snapshot to gallery
function addSnapshotToGallery(imageUrl) {
    const grid = document.getElementById('snapshotsGrid');
    
    // Remove placeholder if exists
    const placeholder = grid.querySelector('.snapshot-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    const snapshot = document.createElement('div');
    snapshot.className = 'snapshot-item';
    snapshot.style.cssText = `
        aspect-ratio: 16/9;
        background: url(${imageUrl}) center/cover;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.3s ease;
    `;
    
    snapshot.addEventListener('mouseenter', () => {
        snapshot.style.transform = 'scale(1.05)';
    });
    
    snapshot.addEventListener('mouseleave', () => {
        snapshot.style.transform = 'scale(1)';
    });
    
    snapshot.addEventListener('click', () => {
        window.open(imageUrl, '_blank');
    });
    
    grid.appendChild(snapshot);
}

// Add log entry
function addLogEntry(text, icon) {
    const logList = document.getElementById('activityLog');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.innerHTML = `
        <span class="log-time">${timeStr}</span>
        <span class="log-icon">${icon}</span>
        <span class="log-text">${text}</span>
    `;
    
    logList.insertBefore(logItem, logList.firstChild);
}

// Clear log
function clearLog() {
    if (confirm('Clear all activity logs?')) {
        const logList = document.getElementById('activityLog');
        logList.innerHTML = '<div class="log-item"><span class="log-text">No activity yet</span></div>';
    }
}

// View all snapshots
function viewAllSnapshots() {
    alert('Snapshots gallery feature coming soon!');
}

// Camera toggle
document.getElementById('cameraToggle')?.addEventListener('change', (e) => {
    if (e.target.checked) {
        startCamera();
    } else {
        stopCamera();
    }
});

// AI Detection toggle
document.getElementById('motionDetection')?.addEventListener('change', (e) => {
    if (e.target.checked && cameraStream) {
        startAIDetection();
    } else {
        stopAIDetection();
    }
});

// Start AI detection
function startAIDetection() {
    if (aiDetectionInterval) return; // Already running
    
    addLogEntry('AI activity detection enabled', '🤖');
    
    // Analyze frame every 10 seconds
    aiDetectionInterval = setInterval(() => {
        analyzeCurrentFrame();
    }, 10000);
    
    // Analyze first frame immediately
    analyzeCurrentFrame();
}

// Stop AI detection
function stopAIDetection() {
    if (aiDetectionInterval) {
        clearInterval(aiDetectionInterval);
        aiDetectionInterval = null;
        addLogEntry('AI activity detection disabled', '🤖');
    }
}

// Analyze current camera frame with AI
async function analyzeCurrentFrame() {
    if (!cameraStream || isAnalyzing) return;
    
    isAnalyzing = true;
    
    try {
        const videoElement = document.getElementById('cameraFeed');
        const canvas = document.createElement('canvas');
        canvas.width = 320; // Smaller size for faster processing
        canvas.height = 240;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Show analyzing status
        updateDetectionStatus('Analyzing...', 'analyzing');
        
        // Send to API
        const response = await fetch('api/analyze-activity.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        const result = await response.json();
        
        if (result.error) {
            console.error('AI Error:', result.error);
            updateDetectionStatus('AI Error: ' + (result.message || result.error), 'error');
            addLogEntry('AI detection error', '⚠️');
        } else {
            lastActivity = result.activity;
            updateDetectionStatus(result.activity, 'detected');
            addLogEntry(`Detected: ${result.activity}`, '🔍');
        }
        
    } catch (error) {
        console.error('Analysis error:', error);
        updateDetectionStatus('Connection error - Make sure Python server is running', 'error');
    } finally {
        isAnalyzing = false;
    }
}

// Update detection status display
function updateDetectionStatus(text, status) {
    const statusElement = document.getElementById('detectionStatus');
    if (statusElement) {
        statusElement.textContent = text;
        statusElement.className = 'detection-status ' + status;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        fetch('api/logout.php', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            localStorage.clear();
            window.location.href = 'login.html';
        }).catch(error => {
            console.error('Logout error:', error);
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (cameraStream) {
        stopCamera();
    }
});
