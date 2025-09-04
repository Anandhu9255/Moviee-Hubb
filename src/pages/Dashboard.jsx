import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Filters from '../components/Filters';
import MovieCard from '../components/MovieCard';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    approved: '',
    search: '',
    yearFrom: '',
    yearTo: '',
    sort: ''
  });

  useEffect(() => {
    fetchMovies();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [filters]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.approved) params.append('approved', filters.approved);
      if (filters.search) params.append('search', filters.search);
      if (filters.yearFrom) params.append('yearFrom', filters.yearFrom);
      if (filters.yearTo) params.append('yearTo', filters.yearTo);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/movies?${params}`);
      console.log('API Response:', response.data);
      console.log('Movies array:', response.data.movies);
      setMovies(response.data.movies);
    } catch (error) {
      setMessage('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      approved: '',
      search: '',
      yearFrom: '',
      yearTo: '',
      sort: ''
    });
  };

  return (
    <div className="container-fluid py-3 py-md-4">
      {/* Header */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="display-4 display-5 fw-bold text-dark mb-2">
                <i className="fas fa-film text-warning me-3"></i>
                Movie Collection
              </h1>
              <p className="text-muted lead mb-0">Discover and manage amazing movies and shows</p>
            </div>
            {user && (
              <Link to="/movies/new" className="btn btn-warning btn-lg btn-md">
                <i className="fas fa-plus me-2"></i>
                <span className="d-none d-sm-inline">Add New Movie</span>
                <span className="d-sm-none">Add</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show mb-4`}>
          <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
          {message}
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

      {/* Movies Grid */}
      <div className="row">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="fas fa-film fa-4x text-muted mb-4"></i>
            <h3 className="text-muted">No movies found</h3>
            <p className="text-muted">Try adjusting your filters or add a new movie!</p>
            {user && (
              <Link to="/movies/new" className="btn btn-warning">
                <i className="fas fa-plus me-2"></i>
                Add Your First Movie
              </Link>
            )}
          </div>
        ) : (
          movies
            .filter((movie) => movie && movie._id) // Filter out null or invalid movies
            .map((movie) => (
              <MovieCard key={movie._id} movie={movie} user={user} />
            ))
        )}
      </div>

      {/* Pagination or Load More could be added here */}
    </div>
  );
};

export default Dashboard;
