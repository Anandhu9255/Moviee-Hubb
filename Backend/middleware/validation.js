const { body, validationResult } = require('express-validator');

const validation = {};

validation.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

validation.signupValidation = [
  body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validation.handleValidationErrors
];

validation.loginValidation = [
  body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
  body('password').exists(),
  validation.handleValidationErrors
];

validation.movieValidation = [
  body('title').trim().isLength({ min: 1 }),
  body('type').isIn(['movie', 'show']),
  body('director').optional().trim(),
  body('budget').optional().isNumeric(),
  body('location').optional().trim(),
  body('duration').optional().isNumeric(),
  body('year').optional().isNumeric({ min: 1800, max: new Date().getFullYear() }),
  validation.handleValidationErrors
];

validation.updateMovieValidation = [
  body('title').optional().trim().isLength({ min: 1 }),
  body('type').optional().isIn(['movie', 'show']),
  body('director').optional().trim(),
  body('budget').optional().isNumeric(),
  body('location').optional().trim(),
  body('duration').optional().isNumeric(),
  body('year').optional().isNumeric({ min: 1800, max: new Date().getFullYear() }),
  body('approved').optional().isBoolean(),
  validation.handleValidationErrors
];

validation.updateProfileValidation = [
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  validation.handleValidationErrors
];

module.exports = validation;
