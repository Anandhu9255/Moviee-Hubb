const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {};

auth.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

auth.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Require admin role.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

auth.isOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'admin') {
      return next();
    }
    // For ownership check, the controller should set req.resourceOwnerId
    if (req.resourceOwnerId && req.resourceOwnerId.toString() === req.user.id) {
      return next();
    }
    return res.status(403).json({ message: 'Not authorized.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = auth;
