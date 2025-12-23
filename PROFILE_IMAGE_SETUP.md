# Profile Image Upload Setup Guide

## Database Migration

To enable profile image uploads, you need to add the `profile_image` column to your database.

### Steps:

1. **Open phpMyAdmin**
   - Navigate to: http://localhost/phpmyadmin
   - Login with your MySQL credentials

2. **Select Database**
   - Click on the `trackmate` database from the left sidebar

3. **Run SQL Query**
   - Click on the "SQL" tab at the top
   - Copy and paste the following SQL code:

```sql
ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL AFTER email;
```

4. **Execute Query**
   - Click the "Go" button to execute the query
   - You should see a success message

5. **Verify Column**
   - Click on the "users" table from the left sidebar
   - Click on the "Structure" tab
   - You should now see the `profile_image` column in the table structure

## Usage

Once the database is updated:

1. Go to your profile page: http://localhost/trackmate/profile.html
2. Click on the camera icon (📷) on your avatar
3. Select an image from your computer (JPG, PNG, GIF, or WebP)
4. The image will be uploaded and displayed immediately
5. Your profile image will also appear on the dashboard

## File Upload Settings

- **Maximum file size**: 5MB
- **Allowed formats**: JPG, JPEG, PNG, GIF, WebP
- **Storage location**: `uploads/profile-images/`

## Troubleshooting

### Image Not Uploading
- Check if the `uploads/profile-images/` folder exists and has write permissions
- Verify the file size is under 5MB
- Make sure the file format is supported

### Image Not Displaying
- Clear your browser cache
- Check the browser console for errors (F12 → Console)
- Verify the image path in the database

### Permission Issues
If you get permission errors, set folder permissions:
```bash
chmod 755 uploads/profile-images/
```

## Notes

- Images are stored with unique filenames: `profile_{userId}_{timestamp}.{extension}`
- Old profile images are not automatically deleted (you may want to add cleanup functionality)
- The database stores the relative path: `uploads/profile-images/filename.jpg`
