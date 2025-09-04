import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCardNew';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchTrendingContent();
  }, []);

  // Preload images to improve loading performance
  const preloadImages = (movies) => {
    const imagePromises = movies.map((movie) => {
      return new Promise((resolve, reject) => {
        if (!movie.poster) {
          resolve();
          return;
        }

        const img = new Image();
        const imageUrl = `http://localhost:5000${movie.poster}`;

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

  const fetchTrendingContent = async () => {
    try {
      setLoading(true);

      // Build query parameters for movies
      const moviesParams = new URLSearchParams();
      moviesParams.append('type', 'movie');
      moviesParams.append('limit', '8');
      moviesParams.append('sortBy', 'createdAt');
      moviesParams.append('sortOrder', 'desc');

      // Trending sections should ALWAYS show only approved movies for all users
      moviesParams.append('approved', 'true');

      // Build query parameters for shows
      const showsParams = new URLSearchParams();
      showsParams.append('type', 'show');
      showsParams.append('limit', '8');
      showsParams.append('sortBy', 'createdAt');
      showsParams.append('sortOrder', 'desc');

      // Trending sections should ALWAYS show only approved shows for all users
      showsParams.append('approved', 'true');

      // Fetch movies and shows with proper filtering
      const [moviesResponse, showsResponse] = await Promise.all([
        api.get(`/movies?${moviesParams}`),
        api.get(`/movies?${showsParams}`)
      ]);

      const moviesData = moviesResponse.data.movies || [];
      const showsData = showsResponse.data.movies || [];

      setTrendingMovies(moviesData);
      setTrendingShows(showsData);

      // Preload images for both movies and shows
      const allContent = [...moviesData, ...showsData];
      preloadImages(allContent);

    } catch (error) {
      console.error('Failed to fetch trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieSection = (title, movies, viewAllLink, icon) => (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-0">
            <i className={`fas ${icon} text-primary me-3`}></i>
            {title}
          </h2>
          <p className="text-muted mb-0">Discover the latest and most popular content</p>
        </div>
        <Link to={viewAllLink} className="btn btn-outline-primary">
          <i className="fas fa-arrow-right me-2"></i>
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading {title.toLowerCase()}...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-5">
          <i className={`fas ${icon} fa-3x text-muted mb-3`}></i>
          <h5 className="text-muted">No {title.toLowerCase()} available</h5>
          <p className="text-muted">Check back later for new content.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col">
              <MovieCard
                movie={movie}
                user={user}
                onUpdate={fetchTrendingContent}
                isImagePreloaded={imagesLoaded.has(movie._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Welcome Header */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              <i className="fas fa-film me-3"></i>
              Welcome to Moviee Hubb
            </h1>
            <p className="lead text-muted mb-4">
              Discover, explore, and manage your favorite movies and TV shows
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/movies" className="btn btn-primary btn-lg">
                <i className="fas fa-film me-2"></i>
                Browse Movies
              </Link>
              <Link to="/shows" className="btn btn-info btn-lg">
                <i className="fas fa-tv me-2"></i>
                Browse Shows
              </Link>
              {user && user.role !== 'admin' && (
                <Link to="/add-movie" className="btn btn-success btn-lg">
                  <i className="fas fa-plus me-2"></i>
                  Add Movie
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Section */}
      {renderMovieSection('Trending Movies', trendingMovies, '/movies', 'fa-film')}

      {/* Trending Shows Section */}
      {renderMovieSection('Trending Shows', trendingShows, '/shows', 'fa-tv')}

      {/* Quick Stats */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-gradient-primary text-white shadow">
            <div className="card-body p-4">
              <div className="row text-center">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="h2 mb-1">
                    <i className="fas fa-film me-2"></i>
                    {trendingMovies.length}+
                  </div>
                  <div className="text-white-50">Movies Available</div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="h2 mb-1">
                    <i className="fas fa-tv me-2"></i>
                    {trendingShows.length}+
                  </div>
                  <div className="text-white-50">TV Shows Available</div>
                </div>
                <div className="col-md-4">
                  <div className="h2 mb-1">
                    <i className="fas fa-users me-2"></i>
                    1000+
                  </div>
                  <div className="text-white-50">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
