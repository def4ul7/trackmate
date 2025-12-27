# TrackMate 🎯

**A Comprehensive Activity Monitoring & Productivity Tracking Application**

TrackMate is a modern, feature-rich Progressive Web Application (PWA) that helps users monitor their daily activities, track productivity, and maintain healthy work habits using AI-powered camera detection, smart timers, detailed analytics, and comprehensive reporting.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![PHP](https://img.shields.io/badge/PHP-8.2-purple)
![License](https://img.shields.io/badge/license-Educational-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation--setup)
- [Configuration](#-configuration)
- [AI Setup](#-ai-detection-setup)
- [Database](#-database-schema)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Security](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🔐 Authentication & Security
- **Complete User Authentication System**
  - Secure login with session management
  - User registration with validation
  - Forgot password functionality
  - Password reset with email verification
  - Backup codes for account recovery
  - Profile image upload with auto-resize & circular crop
  - Session persistence and CSRF protection

### 📊 Dashboard
- **Modern Analytics Dashboard**
  - Real-time activity overview
  - Quick stats cards (work hours, phone usage, activities, focus score)
  - Weekly activity chart with Chart.js
  - AI detection status widget
  - Today's schedule overview
  - Active timers display
  - Quick action buttons
  - User profile with goals & streak tracking
  - Recent activities timeline
  - Smart insights panel
  - **Real-time Notification System**
    - Bell icon with unread badge count
    - Dropdown notification panel
    - Multiple notification types (success, warning, info, alert)
    - Mark as read functionality
    - Auto-close on outside click
    - Persistent storage in localStorage

### 📷 AI-Powered Camera Monitoring
- **Live Activity Detection**
  - Real-time camera feed with WebRTC
  - AI-powered activity recognition using LLaVA 7B model
  - Detects 7 activity types:
    - 📱 Using Phone
    - 💼 Working
    - 📱💼 Phone + Work
    - 😴 Sleeping
    - 🍽️ Eating
    - 🥤 Drinking
    - 🤷 Other
  - Recording and snapshot capabilities
  - Auto-detection every 10 seconds
  - Detection history and analytics

### 📅 Calendar
- **Activity Calendar**
  - Monthly view with navigation
  - Activity indicators on dates
  - Day selection and details
  - Activity type filtering
  - Daily stats panel
  - Color-coded activity types

### ⏰ Timer & Alarms
- **Multi-Function Timer System**
  - **Countdown Timer**: Custom durations with presets (5m, 15m, 30m, 1h)
  - **Stopwatch**: Lap tracking and split times
  - **Alarms**: Multiple alarm management with custom labels
  - **Pomodoro Timer**: 25/5 minute work/break cycles
  - Sound notifications
  - Background persistence

### 📈 Reports & Analytics
- **Comprehensive Reporting**
  - **Daily Reports**: Activity breakdown with doughnut charts
  - **Weekly Reports**: Stacked bar charts for 7-day trends
  - **Monthly Reports**: Line charts for monthly patterns
  - **Yearly Reports**: Bar charts for annual overview
  - Export to JSON
  - Print functionality
  - Date range navigation
  - Chart.js visualizations

### ⚙️ Settings
- **Complete Settings Panel**
  - **General**: Language, timezone, date format
  - **Notifications**: Email, push, in-app toggles
  - **Appearance**: Theme (light/dark), color accents, font size
  - **Privacy & Security**: Data sharing, backup codes, 2FA
  - **Data & Storage**: Storage usage, export/import, clear data
  - **About**: Version info, terms, privacy policy

### 👤 Profile Management
- **User Profile**
  - **Profile Image Upload**
    - Upload JPG, PNG, GIF, WebP (max 5MB)
    - Auto-resize to 300x300px
    - Center crop to square
    - Circular display
    - Shows on profile and dashboard
  - Edit personal information (name, username, email)
  - Update physical stats (gender, age, height, weight)
  - Account settings management
  - Activity summary statistics
  - Membership information

### 📱 Progressive Web App (PWA)
- **Full PWA Support**
  - Installable on desktop and mobile
  - Offline functionality
  - Service worker caching
  - Background sync
  - App manifest
  - Custom splash screens
  - Native-like experience

---

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)** - Vanilla JavaScript
- **Chart.js** - Data visualization
- **WebRTC** - Camera access
- **Service Worker** - PWA functionality

### Backend
- **PHP 8.2** - Server-side logic
- **MySQL** - Relational database
- **PDO** - Database abstraction layer
- **Python 3.x + Flask** - AI server
- **Ollama + LLaVA 7B** - AI model for activity detection

### Libraries & Tools
- **GD Library** - Image processing
- **PHPMailer** (optional) - Email sending
- **Chart.js 3.x** - Charts and graphs
- **Font Awesome** (optional) - Icons

---

## 📁 Project Structure

```
trackmate/
├── 📄 index.html                    # Entry point (redirects to login/dashboard)
├── 📄 login.html                    # Login page
├── 📄 signup.html                   # Registration page
├── 📄 forgot-password.html          # Forgot password page
├── 📄 reset-password.html           # Password reset page
├── 📄 backup-codes.html             # Backup codes page
├── 📄 dashboard.html                # Main dashboard
├── 📄 profile.html                  # User profile page
├── 📄 camera.html                   # Camera monitoring page
├── 📄 calendar.html                 # Activity calendar
├── 📄 timer.html                    # Timer & alarms page
├── 📄 reports.html                  # Analytics reports
├── 📄 settings.html                 # Settings page
├── 📄 offline.html                  # Offline fallback
├── 📄 manifest.json                 # PWA manifest
├── 📄 service-worker.js             # Service worker
├── 📄 model.py                      # Python AI server
├── 📄 start-ai-server.bat          # Windows batch file to start AI
│
├── 📁 api/                          # Backend API endpoints
│   ├── login.php                    # User login
│   ├── signup.php                   # User registration
│   ├── logout.php                   # User logout
│   ├── forgot-password.php          # Request password reset
│   ├── reset-password.php           # Reset password
│   ├── update-profile.php           # Update user profile
│   ├── upload-profile-image.php     # Upload & process profile images
│   ├── generate-backup-codes.php    # Generate backup codes
│   ├── verify-backup-code.php       # Verify backup codes
│   ├── analyze-activity.php         # Bridge to Python AI server
│   ├── check-profile-image-column.php # DB check utility
│   └── check-upload-directory.php   # Upload directory check
│
├── 📁 assets/                       # Static assets
│   ├── 📁 css/
│   │   ├── auth-style.css           # Authentication pages styling
│   │   ├── dashboard.css            # Dashboard styling
│   │   ├── profile.css              # Profile page styling
│   │   └── camera.css               # Camera page styling (auto-generated)
│   ├── 📁 js/
│   │   ├── auth.js                  # Authentication logic
│   │   ├── dashboard.js             # Dashboard functionality
│   │   ├── profile.js               # Profile management
│   │   ├── camera.js                # Camera & AI detection (auto-generated)
│   │   ├── calendar.js              # Calendar functionality (auto-generated)
│   │   ├── timer.js                 # Timer logic (auto-generated)
│   │   ├── reports.js               # Reports & charts (auto-generated)
│   │   └── settings.js              # Settings management (auto-generated)
│   └── 📁 icons/                    # PWA icons (various sizes)
│
├── 📁 config/
│   └── config.php                   # Database & app configuration
│
├── 📁 database/
│   ├── trackmate.sql                # Main database schema
│   └── add_profile_image.sql        # Migration for profile images
│
├── 📁 uploads/
│   ├── .htaccess                    # Security rules
│   └── 📁 profile-images/           # User profile images
│
├── 📁 docs/                         # Documentation
│   ├── AI_DETECTION_SETUP.md        # AI setup guide
│   ├── PROFILE_IMAGE_SETUP.md       # Profile image feature guide
│   ├── PROFILE_IMAGE_IMPLEMENTATION.md # Technical implementation
│   ├── BACKUP_CODES.md              # Backup codes guide
│   ├── NETWORK_ACCESS_GUIDE.md      # Network setup guide
│   └── INSTALL.md                   # Installation instructions
│
├── 🧪 test-upload.html              # Image upload test page
├── 🧪 test-profile-upload.html      # Profile upload test page
├── 🧪 check-gd.php                  # GD library diagnostic
└── 🧪 debug-storage.html            # localStorage debug tool
```

---

## 🚀 Installation & Setup

### Prerequisites

Before installing TrackMate, ensure you have:

1. **XAMPP** (v8.2 or higher)
   - Apache 2.4
   - PHP 8.2
   - MySQL 8.0
   - phpMyAdmin

2. **Python 3.10+** (for AI features)
3. **Ollama** (for AI model hosting)
4. **Modern Web Browser** (Chrome, Firefox, Edge, Safari)

### Step 1: Clone/Download the Project

```bash
# Clone to XAMPP htdocs directory
cd C:\xampp\htdocs
git clone <repository-url> trackmate

# Or download and extract to:
# C:\xampp\htdocs\trackmate
```

### Step 2: Database Setup

1. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Create Database**
   ```bash
   # Access phpMyAdmin: http://localhost/phpmyadmin
   ```

3. **Import Database Schema**
   - Open phpMyAdmin
   - Create new database: `trackmate`
   - Import `database/trackmate.sql`
   - Import `database/add_profile_image.sql` (for profile images)

4. **Verify Tables Created**
   ```sql
   -- Should have these tables:
   - users
   - activities
   - settings
   - timers
   - alarms
   - reports
   - backup_codes
   ```

### Step 3: Enable GD Library (for Profile Images)

1. **Open PHP Configuration**
   ```
   File: C:\xampp\php\php.ini
   ```

2. **Enable GD Extension**
   ```ini
   # Find this line and remove the semicolon:
   ;extension=gd
   
   # Change to:
   extension=gd
   ```

3. **Restart Apache**
   - Stop Apache in XAMPP
   - Start Apache again

4. **Verify GD Library**
   ```
   Visit: http://localhost/trackmate/check-gd.php
   Should show: "GD Library is ENABLED"
   ```

### Step 4: Create Upload Directory

```bash
# Create directory for profile images
mkdir uploads
mkdir uploads\profile-images

# Set permissions (on Windows, usually automatic)
# On Linux/Mac:
chmod 755 uploads
chmod 755 uploads/profile-images
```

### Step 5: Configure Database Connection

Edit `config/config.php`:

```php
<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'trackmate');
define('DB_USER', 'root');        // Default XAMPP user
define('DB_PASS', '');            // Default XAMPP password (empty)

// Application Configuration
define('APP_URL', 'http://localhost/trackmate');
define('APP_NAME', 'TrackMate');

// Email Configuration (optional)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_PORT', 587);
```

### Step 6: Python AI Server Setup (Optional but Recommended)

#### Install Python Dependencies

```bash
cd C:\xampp\htdocs\trackmate

# Install Flask
pip install flask flask-cors pillow

# Install Ollama
# Download from: https://ollama.ai/download
# Or use package manager:
winget install Ollama.Ollama
```

#### Download AI Model

```bash
# Pull LLaVA 7B model (2.2GB)
ollama pull llava:7b

# Verify model downloaded
ollama list
```

#### Start AI Server

**Option 1: Using Batch File (Windows)**
```bash
# Double-click: start-ai-server.bat
# Or from command prompt:
start-ai-server.bat
```

**Option 2: Manual Start**
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Flask server
python model.py
```

#### Verify AI Server Running

```bash
# Check Flask server
http://localhost:5000/health

# Check Ollama
http://localhost:11434/
```

**Detailed AI Setup Guide**: See [AI_DETECTION_SETUP.md](docs/AI_DETECTION_SETUP.md)

### Step 7: Access the Application

1. **Open Browser**
   ```
   http://localhost/trackmate
   ```

2. **Create Account**
   - Click "Sign Up"
   - Fill in details
   - Create account

3. **Login**
   - Use credentials
   - Access dashboard

---

## ⚙️ Configuration

### Database Configuration

Edit `config/config.php` to match your environment:

```php
// Development
define('DB_HOST', 'localhost');
define('DB_NAME', 'trackmate');
define('DB_USER', 'root');
define('DB_PASS', '');

// Production (example)
define('DB_HOST', 'your-production-host');
define('DB_NAME', 'your_database');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_secure_password');
```

### Application Settings

```php
// Base URL (change for production)
define('APP_URL', 'http://localhost/trackmate');

// Upload Settings
define('MAX_UPLOAD_SIZE', 5242880);  // 5MB in bytes
define('ALLOWED_IMAGES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Session Settings
define('SESSION_LIFETIME', 86400);   // 24 hours
```

### PWA Manifest Configuration

Edit `manifest.json` for branding:

```json
{
  "name": "TrackMate - Activity Tracker",
  "short_name": "TrackMate",
  "start_url": "/trackmate/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FF9F66",
  "orientation": "portrait-primary"
}
```

### AI Server Configuration

Edit `model.py` for custom settings:

```python
# Server settings
HOST = '0.0.0.0'
PORT = 5000
DEBUG = False  # Set to False in production

# Ollama settings
OLLAMA_API = 'http://localhost:11434/api/generate'
MODEL_NAME = 'llava:7b'

# Detection settings
CONFIDENCE_THRESHOLD = 0.7
IMAGE_MAX_SIZE = 1024  # pixels
```

---

## 🤖 AI Detection Setup

### System Requirements for AI

- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 3GB free space for model
- **GPU**: Optional (CUDA/ROCm for faster inference)
- **Internet**: Required for initial model download

### Quick Start AI Features

1. **Start Ollama Service**
   ```bash
   ollama serve
   ```

2. **Download Model** (first time only)
   ```bash
   ollama pull llava:7b
   ```

3. **Start Flask Server**
   ```bash
   python model.py
   ```

4. **Open Camera Page**
   ```
   http://localhost/trackmate/camera.html
   ```

5. **Enable Camera**
   - Click "Enable Camera"
   - Allow browser camera permissions
   - Click "Start Detection"

### Activity Detection

The AI automatically detects:

| Activity | Description | Trigger |
|----------|-------------|---------|
| 📱 Using Phone | Phone visible in frame | Phone detected |
| 💼 Working | Laptop/computer visible | Work device detected |
| 📱💼 Phone + Work | Both detected | Multitasking |
| 😴 Sleeping | Eyes closed, lying down | Rest detected |
| 🍽️ Eating | Food/utensils visible | Eating activity |
| 🥤 Drinking | Beverage visible | Drinking action |
| 🤷 Other | Unrecognized activity | Default |

### AI Configuration Options

**Modify detection frequency** in `camera.js`:
```javascript
// Change detection interval (default 10 seconds)
const DETECTION_INTERVAL = 10000;  // milliseconds
```

**Adjust confidence threshold** in `model.py`:
```python
# Minimum confidence for detection
CONFIDENCE_THRESHOLD = 0.7  # 70%
```

---

## 🗄 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    full_name VARCHAR(100),
    gender ENUM('male', 'female', 'other'),
    age INT,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reset_token VARCHAR(64) DEFAULT NULL,
    reset_expires DATETIME DEFAULT NULL
);
```

### Activities Table

```sql
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('phone', 'working', 'phone_work', 'sleeping', 'eating', 'drinking', 'other'),
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration INT,  -- seconds
    confidence DECIMAL(3,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Timers Table

```sql
CREATE TABLE timers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    timer_type ENUM('countdown', 'stopwatch', 'pomodoro'),
    duration INT,  -- seconds
    remaining INT,  -- seconds
    status ENUM('running', 'paused', 'stopped'),
    start_time DATETIME,
    end_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Reports Table

```sql
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    report_date DATE NOT NULL,
    total_work_time INT,  -- seconds
    total_phone_time INT,
    total_break_time INT,
    activities_count INT,
    focus_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📖 Usage

### Getting Started

1. **Create Account**
   - Navigate to signup page
   - Enter username, email, password
   - Verify email (if configured)
   - Login to dashboard

2. **Set Up Profile**
   - Click profile icon
   - Upload profile image
   - Update personal information
   - Set goals and preferences

3. **Enable Camera Monitoring**
   - Go to Camera page
   - Allow camera permissions
   - Start detection
   - AI will track activities automatically

### Daily Workflow

#### Morning Routine
1. Login to dashboard
2. Review yesterday's stats
3. Check today's schedule
4. Start timer for first activity

#### During Work
1. Enable camera monitoring
2. AI tracks activities automatically
3. Use Pomodoro timer (25min work, 5min break)
4. Check notifications for breaks

#### Evening Review
1. View Reports page
2. Review daily activity breakdown
3. Check weekly trends
4. Adjust tomorrow's goals

### Feature Usage

#### Dashboard
- **Quick Stats**: Overview of today's metrics
- **Charts**: Visual representation of activities
- **Recent Activities**: Timeline of latest actions
- **Notifications**: Click bell icon to see updates

#### Camera Monitoring
```
1. Click "Enable Camera" button
2. Allow browser permissions
3. Click "Start Detection"
4. AI analyzes frame every 10 seconds
5. View detection history below video
```

#### Profile Image Upload
```
1. Go to Profile page
2. Click camera icon on avatar
3. Select image (JPG, PNG, GIF, WebP, max 5MB)
4. Image auto-resizes to 300x300px circular
5. Appears on profile and dashboard
```

#### Setting Timers
```
Countdown: Set duration → Start
Stopwatch: Start → Lap → Stop
Pomodoro: Auto 25min work / 5min break
Alarms: Set time + label + sound
```

#### Viewing Reports
```
1. Select period: Daily/Weekly/Monthly/Yearly
2. Navigate dates with arrows
3. View charts and statistics
4. Export to JSON or Print
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### POST /api/login.php
**Login user**

```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Success Response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "full_name": "John Doe",
    "profile_image": "uploads/profile-images/profile_1_1234567890.jpg"
  }
}

// Error Response
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST /api/signup.php
**Register new user**

```json
// Request
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "securePass123",
  "confirm_password": "securePass123"
}

// Success Response
{
  "success": true,
  "message": "Account created successfully"
}
```

#### POST /api/logout.php
**Logout user**

```json
// Success Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/forgot-password.php
**Request password reset**

```json
// Request
{
  "email": "user@example.com"
}

// Success Response
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### POST /api/reset-password.php
**Reset password with token**

```json
// Request
{
  "token": "abc123...",
  "password": "newPassword123",
  "confirm_password": "newPassword123"
}

// Success Response
{
  "success": true,
  "message": "Password reset successful"
}
```

### Profile Endpoints

#### POST /api/update-profile.php
**Update user profile**

```json
// Request
{
  "full_name": "John Doe",
  "email": "newemail@example.com",
  "gender": "male",
  "age": 25,
  "height": 175.5,
  "weight": 70.0
}

// Success Response
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

#### POST /api/upload-profile-image.php
**Upload profile image**

```javascript
// Request (multipart/form-data)
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/upload-profile-image.php', {
  method: 'POST',
  body: formData
})

// Success Response
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "image_url": "uploads/profile-images/profile_1_1234567890.jpg"
}

// Error Response
{
  "success": false,
  "message": "File is too large. Maximum size is 5MB"
}
```

### Backup Codes Endpoints

#### POST /api/generate-backup-codes.php
**Generate backup codes**

```json
// Success Response
{
  "success": true,
  "codes": [
    "ABCD-1234-EFGH",
    "IJKL-5678-MNOP",
    // ... 8 more codes
  ]
}
```

#### POST /api/verify-backup-code.php
**Verify backup code**

```json
// Request
{
  "code": "ABCD-1234-EFGH"
}

// Success Response
{
  "success": true,
  "message": "Backup code verified"
}
```

### AI Detection Endpoint (Python Server)

#### POST http://localhost:5000/analyze
**Analyze image for activity detection**

```json
// Request
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}

// Response
{
  "activity": "working",
  "confidence": 0.85,
  "description": "Person working on laptop",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔒 Security Features

### Authentication Security
- ✅ **Password Hashing**: bcrypt with cost factor 10
- ✅ **SQL Injection Prevention**: PDO prepared statements
- ✅ **XSS Protection**: Input sanitization and htmlspecialchars()
- ✅ **CSRF Protection**: Session tokens (recommended to implement)
- ✅ **Session Security**: HTTP-only cookies, secure flags
- ✅ **Password Strength**: Minimum 6 characters (configurable)
- ✅ **Email Validation**: RFC 5322 compliant

### File Upload Security
- ✅ **File Type Validation**: Only image files (JPG, PNG, GIF, WebP)
- ✅ **File Size Limit**: Maximum 5MB per upload
- ✅ **Image Re-encoding**: GD library re-encodes all images as JPEG
- ✅ **Filename Sanitization**: Generated filenames prevent directory traversal
- ✅ **Directory Protection**: .htaccess restricts direct PHP execution
- ✅ **Path Validation**: Absolute paths prevent file inclusion attacks

### Database Security
- ✅ **Prepared Statements**: All queries use PDO prepared statements
- ✅ **Password Storage**: bcrypt hashing, never plain text
- ✅ **Foreign Keys**: Cascade deletions maintain referential integrity
- ✅ **Input Validation**: Server-side validation of all inputs
- ✅ **Error Handling**: Generic error messages prevent information leakage

### Session Management
- ✅ **Session Timeout**: Configurable session lifetime (default 24h)
- ✅ **Logout Cleanup**: Sessions destroyed completely on logout
- ✅ **Concurrent Sessions**: User data synced via localStorage
- ✅ **Auto-refresh**: Page visibility API reloads user data

### Best Practices Implemented
```php
// Password hashing
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

// Prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);

// Input sanitization
$username = htmlspecialchars(trim($_POST['username']), ENT_QUOTES, 'UTF-8');

// File type validation
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($fileType, $allowedTypes)) {
    throw new Exception('Invalid file type');
}
```

---

## 🐛 Troubleshooting

### Database Issues

#### "Database connection failed"
```bash
Solutions:
1. Ensure MySQL is running in XAMPP Control Panel
2. Check config/config.php credentials:
   - DB_HOST should be 'localhost'
   - DB_USER should be 'root' (default)
   - DB_PASS should be '' (empty, default)
3. Verify database 'trackmate' exists in phpMyAdmin
4. Check MySQL error logs: C:\xampp\mysql\data\mysql_error.log
```

#### "Table 'trackmate.users' doesn't exist"
```bash
Solutions:
1. Import database/trackmate.sql via phpMyAdmin
2. Run SQL manually:
   mysql -u root -p trackmate < database/trackmate.sql
3. Verify tables created: SHOW TABLES;
```

#### "Unknown column 'profile_image'"
```bash
Solutions:
1. Import database/add_profile_image.sql
2. Or run manually:
   ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL AFTER email;
```

### Image Upload Issues

#### "Upload failed: GD library is not installed"
```bash
Solutions:
1. Open C:\xampp\php\php.ini
2. Find: ;extension=gd
3. Change to: extension=gd
4. Restart Apache in XAMPP
5. Verify: http://localhost/trackmate/check-gd.php
```

#### "Failed to move uploaded file"
```bash
Solutions:
1. Check uploads/profile-images/ directory exists
2. Set permissions (Windows usually automatic):
   mkdir uploads\profile-images
3. On Linux/Mac:
   chmod 755 uploads
   chmod 755 uploads/profile-images
```

#### "Image is too large"
```bash
Solutions:
1. Max file size is 5MB
2. Increase in upload-profile-image.php:
   define('MAX_FILE_SIZE', 10485760); // 10MB
3. Also increase in php.ini:
   upload_max_filesize = 10M
   post_max_size = 10M
4. Restart Apache
```

### Authentication Issues

#### "Login not working"
```bash
Solutions:
1. Open browser console (F12) → Console tab
2. Check for JavaScript errors
3. Verify API endpoint in assets/js/auth.js:
   const API_URL = 'http://localhost/trackmate/api';
4. Check network tab for 404 or 500 errors
5. Enable error reporting in PHP:
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
```

#### "Session not persisting"
```bash
Solutions:
1. Check browser allows cookies
2. Verify session_start() in PHP files
3. Check PHP session configuration:
   session.save_path in php.ini
4. Clear browser cache and cookies
```

#### "Forgot password not working"
```bash
Solutions:
1. Email requires SMTP configuration in config.php
2. For Gmail, use App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
3. Test with PHPMailer or mail() function
4. Check PHP error logs for SMTP errors
```

### AI Detection Issues

#### "AI server not responding"
```bash
Solutions:
1. Check Ollama is running:
   http://localhost:11434/
2. Check Flask server is running:
   http://localhost:5000/health
3. Start services:
   Terminal 1: ollama serve
   Terminal 2: python model.py
```

#### "Model not found: llava:7b"
```bash
Solutions:
1. Download model:
   ollama pull llava:7b
2. Verify downloaded:
   ollama list
3. Check Ollama is running:
   ollama serve
```

#### "Camera not accessible"
```bash
Solutions:
1. Allow camera permissions in browser
2. Use HTTPS or localhost (required for camera access)
3. Check camera not in use by other app
4. Verify getUserMedia support:
   navigator.mediaDevices.getUserMedia
```

#### "Detection too slow"
```bash
Solutions:
1. Reduce detection interval in camera.js:
   const DETECTION_INTERVAL = 15000; // 15 seconds
2. Use smaller image resolution
3. Use GPU for Ollama:
   - Install CUDA (NVIDIA) or ROCm (AMD)
   - Ollama will auto-detect GPU
4. Increase RAM allocation for Ollama
```

### PWA Issues

#### "PWA not installing"
```bash
Solutions:
1. Must use http:// or https:// (not file://)
2. Check manifest.json is accessible:
   http://localhost/trackmate/manifest.json
3. Verify service worker registered:
   - Open DevTools (F12)
   - Application tab → Service Workers
4. Check service-worker.js has no errors
5. Clear browser cache
```

#### "Offline mode not working"
```bash
Solutions:
1. Service worker must be registered
2. Check cached files in:
   DevTools → Application → Cache Storage
3. Update cache version in service-worker.js
4. Unregister and re-register service worker
```

### Performance Issues

#### "Dashboard loading slowly"
```bash
Solutions:
1. Optimize database queries with indexes
2. Limit data fetched (pagination)
3. Enable browser caching
4. Minify CSS/JS files
5. Use CDN for Chart.js
```

#### "High memory usage"
```bash
Solutions:
1. Camera: Lower video resolution
2. AI: Reduce detection frequency
3. Charts: Limit data points displayed
4. Clear localStorage periodically
```

### Network Issues

#### "404 Not Found" errors
```bash
Solutions:
1. Check files in correct directory:
   C:\xampp\htdocs\trackmate\
2. Verify Apache is running in XAMPP
3. Check .htaccess file not blocking access
4. Verify URL path matches file structure
```

#### "CORS errors"
```bash
Solutions:
1. For Python server, flask-cors is installed
2. Check Access-Control-Allow-Origin headers
3. Use same domain for frontend/backend
4. For production, configure proper CORS headers
```

### Browser-Specific Issues

#### **Chrome/Edge**
- Clear cache: Ctrl+Shift+Delete
- Check console: F12 → Console
- Check network: F12 → Network

#### **Firefox**
- Clear cache: Ctrl+Shift+Delete
- Check console: F12 → Console
- Disable tracking protection if blocking requests

#### **Safari**
- Clear cache: Cmd+Option+E
- Enable developer tools: Preferences → Advanced
- Check console: Develop → Show JavaScript Console

---

## 📸 Screenshots

### Dashboard
> Main dashboard with activity overview, charts, and notifications

### Camera Monitoring
> Live camera feed with AI-powered activity detection

### Profile Management
> User profile with image upload and personal information

### Reports & Analytics
> Comprehensive reports with Chart.js visualizations

### Timer & Alarms
> Multiple timer types with Pomodoro technique support

---

## 🤝 Contributing

This is an educational project. Feel free to fork and customize for your needs.

### Development Guidelines
1. Follow existing code structure
2. Comment complex logic
3. Test thoroughly before committing
4. Update documentation
5. Keep security in mind

---

## 📄 License

This project is for **educational purposes**. 

- ✅ Use for learning
- ✅ Modify for personal use
- ✅ Share with attribution
- ❌ Commercial use without permission

---

## 🙏 Acknowledgments

- **Chart.js** - Beautiful charts and graphs
- **Ollama** - Local AI model hosting
- **LLaVA** - Vision-language AI model
- **Flask** - Python web framework
- **PHP Community** - Excellent documentation
- **MDN Web Docs** - Web development resources

---

## 📞 Support & Contact

### Documentation
- [Installation Guide](docs/INSTALL.md)
- [AI Setup Guide](docs/AI_DETECTION_SETUP.md)
- [Profile Image Setup](docs/PROFILE_IMAGE_SETUP.md)
- [Network Access Guide](docs/NETWORK_ACCESS_GUIDE.md)
- [Backup Codes Guide](docs/BACKUP_CODES.md)

### Troubleshooting
1. Check browser console for errors (F12)
2. Check PHP error logs: `C:\xampp\apache\logs\error.log`
3. Check MySQL error logs: `C:\xampp\mysql\data\mysql_error.log`
4. Enable PHP error display for debugging

### System Requirements
- **PHP**: 8.0 or higher
- **MySQL**: 5.7 or higher
- **Python**: 3.10 or higher (for AI)
- **RAM**: 4GB minimum (8GB+ for AI)
- **Storage**: 5GB free space
- **Browser**: Modern browser with WebRTC support

---

## 🎯 Roadmap

### Planned Features
- [ ] Mobile app (React Native/Flutter)
- [ ] Real-time notifications from backend
- [ ] Social features (friends, leaderboards)
- [ ] Integration with fitness trackers
- [ ] Advanced AI models for emotion detection
- [ ] Voice commands
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export to PDF/CSV
- [ ] API rate limiting
- [ ] Two-factor authentication (2FA)
- [ ] OAuth login (Google, Facebook)

---

## 📊 Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | PHP 8.2 |
| **Database** | MySQL 8.0 |
| **AI Server** | Python 3.10, Flask, Ollama |
| **AI Model** | LLaVA 7B |
| **Charts** | Chart.js 3.x |
| **PWA** | Service Worker, Manifest |
| **Image Processing** | GD Library |
| **Server** | Apache 2.4 (XAMPP) |
| **Version Control** | Git |

---

## 🌟 Features Summary

✨ **User Management**: Registration, login, profile, password reset  
📊 **Dashboard**: Real-time stats, charts, activity timeline  
📷 **AI Detection**: Camera monitoring with LLaVA model  
📅 **Calendar**: Activity tracking and scheduling  
⏰ **Timers**: Countdown, stopwatch, Pomodoro, alarms  
📈 **Reports**: Daily, weekly, monthly, yearly analytics  
⚙️ **Settings**: Comprehensive app configuration  
🔔 **Notifications**: Real-time updates with badge counts  
👤 **Profile Images**: Upload with auto-resize and crop  
📱 **PWA**: Installable, offline-capable progressive web app  

---

**Built with ❤️ for productivity enthusiasts**

TrackMate © 2024 - Monitor Your Life, Master Your Time
