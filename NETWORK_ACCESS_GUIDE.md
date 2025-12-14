# TrackMate Network Access Configuration

## Changes Made to Enable Tailscale/Network Access

### 1. Session Configuration (`config/config.php`)
- Set `session.cookie_domain` to empty string (allows any domain)
- Set `session.cookie_samesite` to 'None' for cross-origin access
- Added CORS headers globally

### 2. API Endpoints
- Added `credentials: 'include'` to all fetch requests
- Added OPTIONS method handling for preflight requests
- Set proper CORS headers in responses

### 3. JavaScript Changes
- Changed API_BASE_URL to use `window.location.origin` (works with any IP)
- Added `credentials: 'include'` to all fetch configurations

### 4. .htaccess
- Added CORS headers
- Allow requests from any origin

## Testing Steps

1. **Clear Browser Cache & Cookies**
   - Important: Old cookies may cause issues
   - In browser DevTools: Application > Clear Storage > Clear site data

2. **Access via Tailscale IP**
   ```
   http://100.81.138.65/trackmate/login.html
   ```

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for CORS errors or cookie warnings
   - Check Network tab for failed requests

## Troubleshooting

### If still not working:

1. **Check PHP Session Settings**
   In XAMPP's `php.ini`, ensure:
   ```ini
   session.cookie_samesite = None
   session.use_only_cookies = 1
   ```

2. **For HTTPS/Secure Connections**
   Uncomment this line in `config/config.php`:
   ```php
   ini_set('session.cookie_secure', '1');
   ```

3. **Verify XAMPP Apache Config**
   In XAMPP Control Panel:
   - Restart Apache after changes
   - Check error logs if issues persist

4. **Browser Specific Issues**
   - Chrome: May block third-party cookies
   - Firefox: Check Enhanced Tracking Protection settings
   - Safari: Most restrictive with cross-origin cookies

### Testing Cookie Creation
Open browser console and run:
```javascript
document.cookie
```
Should show session cookies after login.

### Testing API Connectivity
```javascript
fetch('http://100.81.138.65/trackmate/api/login.php', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'test@test.com', password: 'test123'})
}).then(r => r.json()).then(console.log);
```

## Common Issues

1. **"Not authenticated" errors**
   - Clear browser cookies
   - Check if session is being created on server

2. **CORS errors**
   - Ensure Apache mod_headers is enabled
   - Restart Apache after .htaccess changes

3. **Session not persisting**
   - Check browser cookie settings
   - Verify session.cookie_samesite setting

## Security Note

The current configuration (`Access-Control-Allow-Origin: *`) allows access from any IP for development. For production, you should:

1. Restrict to specific origins
2. Enable HTTPS
3. Set secure cookie flags
4. Use proper authentication tokens

## Files Modified

- `/config/config.php` - Session & CORS configuration
- `/api/login.php` - Added CORS headers
- `/assets/js/auth.js` - Credentials & dynamic API URL
- `/assets/js/dashboard.js` - Added credentials to fetch
- `/assets/js/profile.js` - Added credentials to fetch
- `/.htaccess` - CORS headers

---

**Last Updated:** December 7, 2025
