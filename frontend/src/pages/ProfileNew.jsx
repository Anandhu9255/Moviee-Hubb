import { useState, useEffect } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCardNew';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userMovies, setUserMovies] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        username: userData.username || '',
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        confirmPassword: ''
      });
      fetchUserMovies(userData.id);
    }
  }, []);

  const fetchUserMovies = async (userId) => {
    try {
      setMoviesLoading(true);
      const response = await api.get(`/movies?createdBy=${userId}`);
      setUserMovies(response.data.movies || []);
    } catch (error) {
      console.error('Failed to fetch user movies:', error);
    } finally {
      setMoviesLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        name: formData.name,
        email: formData.email
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put('/users/profile', updateData);
      setMessage('Profile updated successfully!');

      // Update localStorage with new data
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Clear password fields
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading profile...</p>
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
                <i className="fas fa-user text-primary me-3"></i>
                My Profile
              </h1>
              <p className="text-muted mb-0">Manage your account and view your movies</p>
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

      <div className="row">
        {/* Profile Form */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-edit me-2"></i>
                Update Profile
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-user me-1"></i>
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-id-card me-1"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-envelope me-1"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-lock me-1"></i>
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-lock me-1"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-user-tag me-1"></i>
                    Account Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.role === 'admin' ? 'Administrator' : 'Regular User'}
                    readOnly
                  />
                  <div className="form-text">Account type cannot be changed</div>
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* User's Movies - Only show for non-admin users */}
        {user.role !== 'admin' && (
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fas fa-film me-2"></i>
                  My Movies ({userMovies.length})
                </h5>
              </div>
              <div className="card-body">
                {moviesLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading your movies...</p>
                  </div>
                ) : userMovies.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-film fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No movies yet</h5>
                    <p className="text-muted">You haven't added any movies or shows yet.</p>
                    <a href="/add-movie" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      Add Your First Movie
                    </a>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                    {userMovies.map((movie) => (
                      <div key={movie._id} className="col">
                        <MovieCard movie={movie} user={user} onUpdate={() => fetchUserMovies(user.id)} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
