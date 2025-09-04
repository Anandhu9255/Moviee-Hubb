import { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({ ...formData, email: userData.email });
    }
  }, []);

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
      const updateData = { email: formData.email };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put('/users/profile', updateData);
      setMessage('Profile updated successfully!');

      // Update localStorage with new email
      const updatedUser = { ...user, email: response.data.user.email };
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
    return <div className="text-center py-5">Loading...</div>;
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
                Profile Management
              </h1>
              <p className="text-muted mb-0">Update your account information</p>
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

      {/* Profile Form */}
      <div className="row justify-content-center">
        <div className="col-md-6">
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
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.role}
                    readOnly
                  />
                  <div className="form-text">Role cannot be changed</div>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
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
      </div>
    </div>
  );
};

export default Profile;
