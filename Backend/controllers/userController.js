const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {};

// List all users (admin only)
userController.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a user by ID (admin only)
userController.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user.id === userId) {
      return res.status(400).json({ message: 'Admin cannot delete themselves' });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile (name, email, password)
userController.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = userController;
