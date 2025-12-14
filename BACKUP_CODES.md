# TrackMate Authentication System - Updated

## 🎨 Design Updates

The authentication system has been updated to match your dashboard UI theme:

- **Softer, card-based design** with subtle shadows
- **Dashboard color scheme**: Orange (#FF9F66) and Cyan (#9CDDDD)
- **Cleaner backgrounds** with minimal gradients
- **Improved form styling** with light card backgrounds
- **Removed Google login** for simpler authentication

## 🔐 Backup Code System

### What are Backup Codes?

Backup codes are one-time recovery codes that allow users to reset their password without email access. They're generated automatically during signup.

### Features:

- **10 backup codes** generated per user
- **Format**: XXXX-XXXX (e.g., A1B2-C3D4)
- **One-time use**: Each code can only be used once
- **Secure storage**: Codes are hashed in the database
- **Easy recovery**: Users can use backup codes on the forgot password page

### How It Works:

1. **Signup**: User creates an account
2. **Code Generation**: 10 backup codes are automatically generated
3. **Display**: Codes are shown in a modal after signup
4. **Save Options**: Users can download or copy codes
5. **Recovery**: Codes can be used on forgot password page
6. **Regeneration**: Users can generate new codes from their settings

### Files Added/Modified:

**Backend:**
- `api/verify-backup-code.php` - Verifies backup codes
- `api/generate-backup-codes.php` - Generates new backup codes
- `database/trackmate.sql` - Added backup_codes column

**Frontend:**
- `forgot-password.html` - Added backup code tab
- `backup-codes.html` - Manage backup codes page
- `assets/js/auth.js` - Added backup code logic
- `assets/css/auth-style.css` - Added modal and tab styles

## 📱 Updated Pages

### Login Page
- Clean, card-based design
- Removed Google login
- Improved input styling
- Remember me option

### Signup Page
- Backup codes generated automatically
- Codes displayed in modal after signup
- Download/copy functionality
- Terms acceptance required

### Forgot Password Page
- **Two recovery methods:**
  1. Email recovery (traditional)
  2. Backup code recovery (new)
- Tab-based interface
- Clean, intuitive design

### Backup Codes Management
- View/regenerate backup codes
- Accessible from dashboard
- Secure confirmation before regeneration

## 🚀 Testing the Backup Code System

### Test Flow:

1. **Create Account:**
   ```
   http://localhost/trackmate/signup.html
   ```
   - Fill in all fields
   - After successful signup, backup codes will be displayed
   - Download or copy the codes

2. **Use Backup Code:**
   ```
   http://localhost/trackmate/forgot-password.html
   ```
   - Click "Backup Code" tab
   - Enter your email
   - Enter one of your backup codes
   - Reset your password

3. **Regenerate Codes:**
   ```
   http://localhost/trackmate/backup-codes.html
   ```
   - Login first
   - Click "Generate Backup Codes"
   - Save the new codes

## 🔒 Security Features

- ✅ Backup codes are hashed using bcrypt
- ✅ Each code can only be used once
- ✅ Used codes are marked with timestamp
- ✅ Codes are stored as JSON in database
- ✅ Secure verification process
- ✅ Token-based password reset

## 📊 Database Schema Update

```sql
ALTER TABLE users ADD COLUMN backup_codes TEXT DEFAULT NULL 
COMMENT 'JSON array of hashed backup codes';
```

The backup_codes column stores JSON with this structure:
```json
[
  {
    "hash": "$2y$12$...",
    "used": false,
    "created_at": "2025-12-06 10:30:00"
  }
]
```

## 🎨 UI Components Added

### Backup Code Modal
- Appears after signup
- Displays 10 codes in a grid
- Download as .txt file
- Copy to clipboard
- Warning about code security

### Recovery Tabs
- Email recovery (default)
- Backup code recovery
- Smooth tab switching
- Independent validation

### Backup Codes Page
- Accessible from dashboard
- Regenerate codes securely
- Confirmation dialog
- Clear instructions

## 💡 Usage Tips

**For Users:**
1. Save backup codes immediately after signup
2. Store codes in a secure location (password manager, safe, etc.)
3. Each code works only once
4. Regenerate codes if lost (requires login)

**For Developers:**
1. Backup codes are generated automatically on signup
2. Implement backup codes link in user dashboard
3. Consider adding email notifications for code usage
4. Monitor used/unused codes in admin panel

## 🔄 Migration Steps

If you already have users in the database:

```sql
-- Add the backup_codes column
ALTER TABLE users ADD COLUMN backup_codes TEXT DEFAULT NULL;

-- Optionally generate codes for existing users via admin panel
-- Or let them generate on their next login
```

## 📝 API Endpoints

### Generate Backup Codes
```
POST /api/generate-backup-codes.php
Body: { "user_id": 123 }
Response: { "success": true, "codes": ["XXXX-XXXX", ...] }
```

### Verify Backup Code
```
POST /api/verify-backup-code.php
Body: { "email": "user@email.com", "backup_code": "XXXX-XXXX" }
Response: { "success": true, "token": "reset-token" }
```

## 🎯 Next Steps

1. Add backup codes link to dashboard navigation
2. Implement email notifications for code usage
3. Add admin view to see code status
4. Consider SMS backup option
5. Add rate limiting for code attempts

---

**Updated UI Theme** ✅  
**Google Login Removed** ✅  
**Backup Codes Implemented** ✅  
**Dashboard Theme Matched** ✅
