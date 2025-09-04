const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/validation');

// POST /api/auth/signup
router.post('/signup', signupValidation, authController.signup);

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
