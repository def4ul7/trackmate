-- Add profile_image column to users table
-- Run this SQL script in your MySQL database

ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL AFTER email;

-- Optional: Add index for better performance
CREATE INDEX idx_profile_image ON users(profile_image);
