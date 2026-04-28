const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// POST /api/auth/signup - Register a new user
router.post('/api/auth/signup', signup);

// POST /api/auth/login - Login an existing user
router.post('/api/auth/login', login);

module.exports = router;