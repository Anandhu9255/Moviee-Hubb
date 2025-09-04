import { useState, useEffect } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCardNew';

const AdminDashboard = () => {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalShows, setTotalShows] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchPendingMovies();
    fetchStats();
  }, []);

  const fetchPendingMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/movies?approved=false&limit=20');
      setPendingMovies(response.data.movies || []);
    } catch (error) {
      console.error('Failed to fetch pending movies:', error);
      setMessage('Failed to fetch pending movies');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const moviesResponse = await api.get('/movies?approved=true&type=movie');
      setTotalMovies(moviesResponse.data.movies.length);

      const showsResponse = await api.get('/movies?approved=true&type=show');
      setTotalShows(showsResponse.data.movies.length);

      const usersResponse = await api.get('/users');
      setUsers(usersResponse.data.users || []);
      setTotalUsers(usersResponse.data.users.length);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApproveMovie = async (movieId) => {
    try {
      await api.put(`/movies/${movieId}/approve`);
      setMessage('Movie approved successfully!');
      // Update state locally to avoid flickering
      setPendingMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to approve movie');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await api.delete(`/movies/${movieId}`);
      setMessage('Movie deleted successfully!');
      // Update state locally to avoid flickering
      setPendingMovies((prev) => prev.filter((movie) => movie._id !== movieId));
      fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete movie');
    }
  };

  const renderPendingMovies = () => (
    <div className="row">
      {pendingMovies.length === 0 ? (
        <div className="col-12">
          <div className="text-center py-5">
            <i className="fas fa-check-circle fa-4x text-success mb-4"></i>
            <h4 className="text-muted">No pending movies</h4>
            <p className="text-muted">All movies have been reviewed and approved.</p>
          </div>
        </div>
      ) : (
        pendingMovies.map((movie) => (
          <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img
                  src={movie.poster || '/placeholder-poster.jpg'}
                  className="card-img-top w-100"
                  alt={movie.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder-poster.jpg';
                  }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-warning">
                    {movie.type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                </div>
                <div className="position-absolute bottom-0 start-0 m-2">
                  <span className="badge bg-warning">Pending</span>
                </div>
              </div>

              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold mb-2 text-truncate" title={movie.title}>
                  {movie.title}
                </h6>

                <div className="mb-2">
                  <small className="text-muted">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.director && <span> • {movie.director}</span>}
                  </small>
                </div>

                <p className="card-text flex-grow-1 small text-muted">
                  {movie.description ? movie.description.substring(0, 80) + '...' : 'No description available.'}
                </p>

                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm flex-fill"
                      onClick={() => handleApproveMovie(movie._id)}
                    >
                      <i className="fas fa-check me-1"></i>
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleDeleteMovie(movie._id)}
                    >
                      <i className="fas fa-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0">
                <i className="fas fa-cog text-primary me-3"></i>
                Admin Dashboard
              </h1>
              <p className="text-muted mb-0">Manage movies, shows, and users</p>
            </div>
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

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x mb-2"></i>
              <h4 className="mb-1">{pendingMovies.length}</h4>
              <small>Pending Approvals</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-film fa-2x mb-2"></i>
              <h4 className="mb-1">{totalMovies}</h4>
              <small>Total Movies</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-tv fa-2x mb-2"></i>
              <h4 className="mb-1">{totalShows}</h4>
              <small>Total Shows</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4 className="mb-1">{totalUsers}</h4>
              <small>Total Users</small>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Movies Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-white">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Pending Movies ({pendingMovies.length})
              </h5>
            </div>
            <div className="card-body">
              {renderPendingMovies()}
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Users ({totalUsers})
              </h5>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No users found</h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.name || '-'}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
