const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../awsdb');

const router = express.Router();

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) {
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If the email exists, a reset link has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to database
      db.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [resetToken, resetTokenExpires, email],
        async (err, result) => {
          if (err) return res.status(500).json({ message: 'Server error' });

          // For now, just return success (you can add email sending later)
          console.log(`Reset token for ${email}: ${resetToken}`);
          console.log(`Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`);
          
          res.json({ 
            message: 'If the email exists, a reset link has been sent',
            // For development only - remove in production
            resetToken: resetToken,
            resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`
          });
        }
      );
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Find user with valid reset token
    db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token],
      async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const user = results[0];
        
        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        db.query(
          'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
          [passwordHash, user.id],
          (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ message: 'Password reset successful' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email transporter configuration (you'll need to configure this with your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email password or app password
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password_hash: passwordHash,
      is_active: true,
      role: 'user'
    };

    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    return res.json({ message: 'Login successful' });
  });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) {
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If the email exists, a reset link has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to database
      db.query(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [resetToken, resetTokenExpires, email],
        async (err, result) => {
          if (err) return res.status(500).json({ message: 'Server error' });

          // Send email with reset link
          const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;
          
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
              <h2>Password Reset Request</h2>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `
          };

          try {
            await transporter.sendMail(mailOptions);
            res.json({ message: 'If the email exists, a reset link has been sent' });
          } catch (emailError) {
            console.error('Email sending error:', emailError);
            res.status(500).json({ message: 'Error sending email' });
          }
        }
      );
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Find user with valid reset token
    db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token],
      async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const user = results[0];
        
        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        db.query(
          'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
          [passwordHash, user.id],
          (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ message: 'Password reset successful' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
