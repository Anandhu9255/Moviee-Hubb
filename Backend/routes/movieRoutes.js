const express = require('express');
const router = express.Router();
const multer = require('multer');
const movieController = require('../controllers/movieController');
const { verifyToken, isOwnerOrAdmin, isAdmin } = require('../middleware/auth');
const { movieValidation, updateMovieValidation } = require('../middleware/validation');

// Configure multer for poster uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + require('path').extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// All movie routes require authentication
router.use(verifyToken);

// GET /api/movies - Get all movies (with filters)
router.get('/', movieController.getMovies);

// GET /api/movies/:id - Get movie by ID
router.get('/:id', movieController.getMovieById);

// POST /api/movies - Create new movie
router.post('/', upload.single('poster'), movieValidation, movieController.createMovie);

// PUT /api/movies/:id - Update movie
router.put('/:id', updateMovieValidation, isOwnerOrAdmin, movieController.updateMovie);

// DELETE /api/movies/:id - Soft delete movie
router.delete('/:id', isOwnerOrAdmin, movieController.deleteMovie);

// PUT /api/movies/:id/approve - Approve movie (admin only)
router.put('/:id/approve', isAdmin, movieController.approveMovie);

module.exports = router;
