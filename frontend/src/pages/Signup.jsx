import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Signup = (props) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Signup successful!');
      // Call handleLogin from props to update app state
      if (typeof props.onLogin === 'function') {
        props.onLogin(response.data.user);
      }
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-success text-white text-center py-4">
                <h2 className="mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Join MovieApp
                </h2>
                <p className="mb-0 mt-2">Create your account to get started</p>
              </div>
              <div className="card-body p-5">
                {message && (
                  <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                    <i className={`fas ${message.includes('successful') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                    {message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-success"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username (3-20 characters)"
                      required
                      minLength="3"
                      maxLength="20"
                    />
                    <div className="form-text">
                      Username must be 3-20 characters and contain only letters, numbers, and underscores
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2 text-success"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="fas fa-lock me-2 text-success"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength="6"
                    />
                    <div className="form-text">
                      Password must be at least 6 characters long
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-semibold">
                      <i className="fas fa-user-tag me-2 text-success"></i>
                      Account Type
                    </label>
                    <select
                      className="form-control form-control-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success btn-lg w-100 mb-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>
                <div className="text-center">
                  <p className="mb-0">Already have an account?
                    <Link to="/login" className="text-success fw-semibold ms-2 text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
