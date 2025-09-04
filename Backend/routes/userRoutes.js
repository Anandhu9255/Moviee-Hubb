const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { updateProfileValidation } = require('../middleware/validation');

// All user routes require authentication
router.use(verifyToken);

// GET /api/users - List all users (admin only)
router.get('/', isAdmin, userController.listUsers);

// DELETE /api/users/:id - Delete user by ID (admin only)
router.delete('/:id', isAdmin, userController.deleteUser);

// PUT /api/users/profile - Update own profile
router.put('/profile', updateProfileValidation, userController.updateProfile);

module.exports = router;
