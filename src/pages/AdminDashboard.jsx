import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [pendingMovies, setPendingMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingMovies();
    fetchUsers();
  }, []);

  const fetchPendingMovies = async () => {
    try {
      const response = await api.get('/movies?approved=false');
      console.log('AdminDashboard - Pending movies response:', response.data);
      console.log('AdminDashboard - Pending movies array:', response.data.movies);
      setPendingMovies(response.data.movies);
    } catch (error) {
      console.error('AdminDashboard - Failed to fetch pending movies:', error);
      setMessage('Failed to fetch pending movies');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      setMessage('Failed to fetch users');
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this movie?')) {
      try {
        await api.put(`/movies/${id}/approve`);
        setMessage('Movie approved successfully!');
        fetchPendingMovies();
      } catch (error) {
        setMessage('Failed to approve movie');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setMessage('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        setMessage('Failed to delete user');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0">
                <i className="fas fa-user-shield text-primary me-3"></i>
                Admin Dashboard
              </h1>
              <p className="text-muted mb-0">Manage pending movies and users</p>
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

      {/* Pending Movies Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Pending Movies for Approval ({pendingMovies.length})
          </h5>
        </div>
        <div className="card-body">
          {pendingMovies.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h5 className="text-muted">No pending movies</h5>
              <p className="text-muted">All movies have been approved!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th><i className="fas fa-image me-1"></i>Poster</th>
                    <th><i className="fas fa-heading me-1"></i>Title</th>
                    <th><i className="fas fa-tags me-1"></i>Type</th>
                    <th><i className="fas fa-user me-1"></i>Created By</th>
                    <th><i className="fas fa-calendar me-1"></i>Year</th>
                    <th><i className="fas fa-cogs me-1"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMovies
                    .filter((movie) => movie && movie._id) // Filter out null or invalid movies
                    .map((movie) => (
                      <tr key={movie._id}>
                        <td>
                          <img
                            src={movie.poster ? movie.poster : 'https://via.placeholder.com/50x75?text=No+Image'}
                            alt={movie.title}
                            className="img-thumbnail"
                            style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className="fw-semibold">{movie.title}</td>
                        <td>
                          <span className={`badge ${movie.type === 'movie' ? 'bg-primary' : 'bg-info'}`}>
                            {movie.type === 'movie' ? 'Movie' : 'TV Show'}
                          </span>
                        </td>
                        <td>{movie.createdBy?.email || 'Unknown'}</td>
                        <td>{movie.year || '-'}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(movie._id)}
                            title="Approve movie"
                          >
                            <i className="fas fa-check"></i> Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            User Management ({users.length})
          </h5>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No users found</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th><i className="fas fa-envelope me-1"></i>Email</th>
                    <th><i className="fas fa-user-tag me-1"></i>Role</th>
                    <th><i className="fas fa-calendar me-1"></i>Joined</th>
                    <th><i className="fas fa-cogs me-1"></i>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="fw-semibold">{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete user"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
