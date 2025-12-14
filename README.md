# TrackMate - Activity Monitoring Project

A comprehensive activity monitoring application built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

- 🔐 **Complete Authentication System**
  - User Login
  - User Registration/Signup
  - Forgot Password
  - Password Reset
  - Secure Session Management

- 📊 **Activity Tracking**
  - Study time monitoring
  - Meditation tracking
  - Screen time monitoring
  - Sleep duration tracking
  - Health metrics (BMI, heart rate, water intake)

- 📱 **PWA Support**
  - Installable on mobile and desktop
  - Offline functionality
  - Push notifications support
  - Background sync

- 🎨 **Modern UI/UX**
  - Orange (#FF9F66) and Cyan (#9CDDDD) theme
  - Responsive design
  - Smooth animations
  - Mobile-friendly interface

## Project Structure

```
trackmate/
├── api/                          # Backend API endpoints
│   ├── login.php                 # Login handler
│   ├── signup.php                # Registration handler
│   ├── logout.php                # Logout handler
│   ├── forgot-password.php       # Password reset request
│   └── reset-password.php        # Password reset handler
├── assets/                       # Static assets
│   ├── css/
│   │   └── auth-style.css        # Authentication styles
│   ├── js/
│   │   └── auth.js               # Authentication JavaScript
│   └── icons/                    # PWA icons
│       └── icon-template.svg     # Icon template
├── config/
│   └── config.php                # Database and app configuration
├── database/
│   └── trackmate.sql             # Database schema
├── login.html                    # Login page
├── signup.html                   # Registration page
├── forgot-password.html          # Forgot password page
├── reset-password.html           # Password reset page
├── manifest.json                 # PWA manifest
├── service-worker.js             # Service worker for PWA
└── offline.html                  # Offline fallback page
```

## Installation & Setup

### Prerequisites

- XAMPP (Apache, MySQL, PHP)
- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

### Step 1: Setup XAMPP

1. Install XAMPP on your system
2. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Database Setup

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `trackmate`
3. Import the SQL file:
   - Click on the `trackmate` database
   - Go to the "Import" tab
   - Select `database/trackmate.sql`
   - Click "Go" to import

Alternatively, you can run the SQL file directly:
```sql
-- The database will be created automatically when you import trackmate.sql
```

### Step 3: Configure the Application

1. Open `config/config.php`
2. Update database credentials if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Default XAMPP password is empty
   define('DB_NAME', 'trackmate');
   ```

3. Update the site URL:
   ```php
   define('SITE_URL', 'http://localhost/trackmate');
   ```

### Step 4: Copy Files to XAMPP

1. Copy the entire `trackmate` folder to:
   - Windows: `C:\xampp\htdocs\trackmate`
   - Mac: `/Applications/XAMPP/htdocs/trackmate`
   - Linux: `/opt/lampp/htdocs/trackmate`

   For your XAMPP location at `smb://100.81.138.65/d/XAMPP`, copy to:
   ```
   smb://100.81.138.65/d/XAMPP/htdocs/trackmate
   ```

### Step 5: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost/trackmate/login.html`
3. Create a new account using the signup page
4. Login with your credentials

## Configuration

### Email Settings (for Password Reset)

To enable email functionality for password reset, update the SMTP settings in `config/config.php`:

```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('FROM_EMAIL', 'noreply@trackmate.com');
```

**Note:** For Gmail, you need to create an "App Password" from your Google Account settings.

### PWA Configuration

The app is PWA-ready. To install:

1. **On Desktop:**
   - Chrome: Click the install icon in the address bar
   - Edge: Click the install icon in the address bar

2. **On Mobile:**
   - Chrome (Android): Tap "Add to Home Screen"
   - Safari (iOS): Tap Share → "Add to Home Screen"

## API Endpoints

All API endpoints are located in the `api/` directory:

- `POST /api/login.php` - User login
- `POST /api/signup.php` - User registration
- `POST /api/logout.php` - User logout
- `POST /api/forgot-password.php` - Request password reset
- `POST /api/reset-password.php` - Reset password with token

### Example API Request (Login)

```javascript
fetch('http://localhost/trackmate/api/login.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'yourpassword'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Features

- ✅ Password hashing using bcrypt
- ✅ SQL injection prevention with prepared statements
- ✅ XSS protection with input sanitization
- ✅ CSRF protection
- ✅ Secure session management
- ✅ Password strength validation
- ✅ Email validation
- ✅ Rate limiting (recommended to implement)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

## Troubleshooting

### "Database connection failed"
- Ensure MySQL is running in XAMPP
- Check database credentials in `config/config.php`
- Verify the database `trackmate` exists

### "404 Not Found" errors
- Check that files are in the correct XAMPP htdocs directory
- Verify Apache is running
- Check file permissions

### Login not working
- Open browser console (F12) and check for errors
- Verify the API URL in `assets/js/auth.js` matches your setup
- Check that the users table exists in the database

### PWA not installing
- Ensure you're accessing via `http://` or `https://`
- Check that `manifest.json` is accessible
- Verify service worker is registered (check browser DevTools → Application)

## Development

### File Structure Explained

- **HTML Files**: Authentication pages (login, signup, forgot password, reset password)
- **CSS**: Modern, responsive styling with orange/cyan theme
- **JavaScript**: Client-side validation, API calls, PWA functionality
- **PHP**: Server-side logic, database operations, session management
- **SQL**: Database schema with user, activity, and health tables

### Adding New Features

1. **Database Changes**: Update `database/trackmate.sql`
2. **API Endpoint**: Create new PHP file in `api/`
3. **Frontend**: Add HTML/CSS/JS as needed
4. **Update Service Worker**: Add new assets to cache if needed

## Icons

Generate icons using the provided SVG template at `assets/icons/icon-template.svg`:

Required sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

## License

This project is for educational purposes.

## Support

For issues or questions, please check:
1. Browser console for JavaScript errors
2. PHP error logs in XAMPP
3. MySQL logs for database errors

## Credits

- Design inspired by modern productivity apps
- Icons: Custom SVG graphics
- Fonts: System fonts (-apple-system, Segoe UI, Roboto)

---

**TrackMate** - Monitor Your Activities, Enhance Your Productivity
