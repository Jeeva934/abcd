-- SQL Update Query to add forgot password functionality to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL COMMENT 'Password reset token',
ADD COLUMN reset_token_expires TIMESTAMP NULL COMMENT 'Password reset token expiration time';

-- Optional: Add index for better performance on reset token lookups
CREATE INDEX idx_users_reset_token ON users(reset_token);