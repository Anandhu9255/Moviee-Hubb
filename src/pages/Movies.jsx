import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCardNew';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    yearFrom: '',
    yearTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const moviesPerPage = 12;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchMovies();
  }, [filters, currentPage]);

  // Preload images to improve loading performance
  const preloadImages = (movies) => {
    const imagePromises = movies.map((movie) => {
      return new Promise((resolve, reject) => {
        if (!movie.poster) {
          resolve();
          return;
        }

        const img = new Image();
        const imageUrl = movie.poster;

        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, movie._id]));
          resolve();
        };

        img.onerror = () => {
          resolve(); // Don't reject on error, just resolve
        };

        img.src = imageUrl;
      });
    });

    return Promise.all(imagePromises);
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add pagination
      params.append('page', currentPage);
      params.append('limit', moviesPerPage);
      params.append('type', 'movie');

      // For users, only show approved movies
      // For admins, show all movies (they can filter by status)
      if (user && user.role !== 'admin') {
        params.append('approved', 'true');
      } else if (!user) {
        // If no user logged in, only show approved movies
        params.append('approved', 'true');
      }

      // Add filters
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.yearFrom) {
        params.append('yearFrom', filters.yearFrom);
      }
      if (filters.yearTo) {
        params.append('yearTo', filters.yearTo);
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      const response = await api.get(`/movies?${params}`);
      const moviesData = response.data.movies || [];
      setMovies(moviesData);
      setTotalPages(response.data.totalPages || 1);

      // Preload images in the background
      preloadImages(moviesData);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setMessage('Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      yearFrom: '',
      yearTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav aria-label="Movies pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
              </li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {pages.map(page => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </li>
            </>
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0">
                <i className="fas fa-film text-primary me-3"></i>
                Movies
              </h1>
              <p className="text-muted mb-0">
                {user && user.role === 'admin'
                  ? 'Manage and approve movie submissions'
                  : 'Discover and explore amazing movies'
                }
              </p>
            </div>
            {user && user.role !== 'admin' && (
              <Link to="/add-movie" className="btn btn-primary btn-lg">
                <i className="fas fa-plus me-2"></i>
                Add Movie
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {message}
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-filter me-2"></i>
              Search & Filter
            </h5>
            <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
              <i className="fas fa-times me-2"></i>
              Clear All
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Search Movies</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Year Range */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Year From</label>
              <input
                type="number"
                className="form-control"
                placeholder="From"
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Year To</label>
              <input
                type="number"
                className="form-control"
                placeholder="To"
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Sort */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Sort By</label>
              <select
                className="form-select"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="year-desc">Year (Newest)</option>
                <option value="year-asc">Year (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>

            {/* Status Filter for Admins */}
            {user && user.role === 'admin' && (
              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="status-all"
                    checked={!filters.status || filters.status === 'all'}
                    onChange={() => handleFilterChange('status', 'all')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="status-all">All</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="status-approved"
                    checked={filters.status === 'approved'}
                    onChange={() => handleFilterChange('status', 'approved')}
                  />
                  <label className="btn btn-outline-success" htmlFor="status-approved">Approved</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="status-pending"
                    checked={filters.status === 'pending'}
                    onChange={() => handleFilterChange('status', 'pending')}
                  />
                  <label className="btn btn-outline-warning" htmlFor="status-pending">Pending</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading movies...</p>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <>
          {movies.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-film fa-4x text-muted mb-4"></i>
              <h4 className="text-muted">No movies found</h4>
              <p className="text-muted">Try adjusting your filters or add some movies to get started.</p>
              {user && user.role !== 'admin' && (
                <Link to="/add-movie" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Add Your First Movie
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
                {movies.map((movie) => (
                  <div key={movie._id} className="col">
                    <MovieCard
                      movie={movie}
                      user={user}
                      onUpdate={fetchMovies}
                      isImagePreloaded={imagesLoaded.has(movie._id)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;
