const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../awsdb');

const router = express.Router();

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

module.exports = router;
