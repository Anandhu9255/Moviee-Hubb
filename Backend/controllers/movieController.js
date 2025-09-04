const Movie = require('../models/Movie');

const movieController = {};

movieController.createMovie = async (req, res) => {
  try {
    const movieData = { ...req.body, createdBy: req.user.id };

    // Handle poster upload
    if (req.file) {
      movieData.poster = `/uploads/${req.file.filename}`;
    }

    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

movieController.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, approved, year, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = { isDeleted: false };

    // For unauthenticated users or non-admin users, only show approved movies
    if (!req.user || req.user.role !== 'admin') {
      query.approved = true;
    }

    if (type) query.type = type;
    if (approved !== undefined) query.approved = approved === 'true';
    if (year) query.year = year;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const movies = await Movie.find(query)
      .populate('createdBy', 'email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

movieController.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('createdBy', 'email');
    if (!movie || movie.isDeleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // For unauthenticated users or non-admin users, only show approved movies
    if (!req.user || (req.user.role !== 'admin' && movie.createdBy._id.toString() !== req.user.id && !movie.approved)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

movieController.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.isDeleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (req.user.role !== 'admin' && movie.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only admin can approve/reject
    if (req.body.approved !== undefined && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can approve/reject' });
    }

    Object.assign(movie, req.body);
    await movie.save();

    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

movieController.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.isDeleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if (req.user.role !== 'admin' && movie.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    movie.isDeleted = true;
    await movie.save();

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

movieController.approveMovie = async (req, res) => {
  try {
    // Only admin can approve movies
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can approve movies' });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.isDeleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.approved = true;
    await movie.save();

    res.json({ message: 'Movie approved successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = movieController;
