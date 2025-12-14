# TrackMate Installation Guide

## Quick Start Guide

### Step 1: Database Setup

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Run the following SQL commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS trackmate;
USE trackmate;

-- Import the trackmate.sql file from database/ folder
-- OR copy-paste the SQL from database/trackmate.sql
```

### Step 2: Configuration

1. Open `config/config.php`
2. Update these settings if needed:

```php
// Database Settings
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Leave empty for XAMPP default
define('DB_NAME', 'trackmate');

// Application URL
define('SITE_URL', 'http://localhost/trackmate');
```

### Step 3: File Placement

Copy the `trackmate` folder to your XAMPP htdocs directory:

**For standard XAMPP:**
- Windows: `C:\xampp\htdocs\trackmate`
- Mac: `/Applications/XAMPP/htdocs/trackmate`
- Linux: `/opt/lampp/htdocs/trackmate`

**For your network XAMPP:**
```
smb://100.81.138.65/d/XAMPP/htdocs/trackmate
```

### Step 4: Start Services

1. Open XAMPP Control Panel
2. Start **Apache**
3. Start **MySQL**

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost/trackmate/login.html
```

## Testing the Application

### Create a Test Account

1. Go to: `http://localhost/trackmate/signup.html`
2. Fill in the form:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Password: testpass123
   - Confirm Password: testpass123
3. Check "I agree to the Terms"
4. Click "Create Account"

### Login

1. Go to: `http://localhost/trackmate/login.html`
2. Enter:
   - Email: test@example.com
   - Password: testpass123
3. Click "Sign In"

### Test Password Reset

1. Go to: `http://localhost/trackmate/forgot-password.html`
2. Enter your email
3. Check the browser console (F12) for the reset link (development mode)
4. Copy the link and open it in your browser
5. Enter a new password

## File Permissions (Linux/Mac)

If you encounter permission issues:

```bash
cd /path/to/xampp/htdocs
sudo chmod -R 755 trackmate
sudo chown -R daemon:daemon trackmate
```

## Common URLs

- **Login:** `http://localhost/trackmate/login.html`
- **Signup:** `http://localhost/trackmate/signup.html`
- **Forgot Password:** `http://localhost/trackmate/forgot-password.html`
- **Dashboard:** `http://localhost/trackmate/dashboard.html`
- **phpMyAdmin:** `http://localhost/phpmyadmin`

## Troubleshooting

### Problem: "Database connection failed"

**Solution:**
1. Check MySQL is running in XAMPP
2. Verify database name is `trackmate`
3. Check credentials in `config/config.php`

### Problem: "404 Not Found"

**Solution:**
1. Verify files are in `htdocs/trackmate/`
2. Check Apache is running
3. Try: `http://localhost/trackmate/` (with trailing slash)

### Problem: Login button doesn't work

**Solution:**
1. Press F12 to open browser console
2. Check for JavaScript errors
3. Verify `assets/js/auth.js` is loading
4. Check API URL in auth.js matches your setup

### Problem: Can't connect to network XAMPP

**Solution:**
For network XAMPP at `smb://100.81.138.65/d/XAMPP`:

1. Mount the network drive first:
   ```bash
   # Linux/Mac
   mkdir -p ~/network-xampp
   mount -t smbfs //100.81.138.65/d/XAMPP ~/network-xampp
   
   # Or use your file manager to connect to the SMB share
   ```

2. Copy files to: `~/network-xampp/htdocs/trackmate`

3. Access via: `http://100.81.138.65/trackmate/login.html`

## Email Configuration (Optional)

To enable password reset emails:

1. Edit `config/config.php`
2. Update SMTP settings:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
```

3. For Gmail, create an App Password:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Generate App Password
   - Use that password in config.php

## PWA Installation

### Desktop (Chrome/Edge):
1. Open the app in browser
2. Look for install icon in address bar
3. Click to install

### Mobile (Android):
1. Open in Chrome
2. Tap menu (⋮)
3. Select "Add to Home Screen"

### Mobile (iOS):
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

## Next Steps

After installation:

1. ✅ Create a test account
2. ✅ Login successfully
3. ✅ Test forgot password flow
4. ✅ Install as PWA (optional)
5. ✅ Build your dashboard page
6. ✅ Integrate camera monitoring features

## Need Help?

Check these files for more information:
- `README.md` - Full documentation
- `database/trackmate.sql` - Database structure
- `config/config.php` - Configuration options

---

Happy tracking with TrackMate! 🎯
