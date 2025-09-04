import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to={user ? "/" : "/about"}>
          <i className="fas fa-film me-2 text-warning"></i>
          Moviee Hubb
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user ? (
              user.role === 'admin' ? (
                <>
                  {/* Admin navigation */}
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                      to="/admin"
                    >
                      <i className="fas fa-check-circle me-1"></i>
                      Approve Items
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                      to="/profile"
                    >
                      <i className="fas fa-user me-1"></i>
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* User navigation */}
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/') ? 'active' : ''}`}
                      to="/"
                    >
                      <i className="fas fa-home me-1"></i>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
                      to="/movies"
                    >
                      <i className="fas fa-film me-1"></i>
                      Movies
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/shows') ? 'active' : ''}`}
                      to="/shows"
                    >
                      <i className="fas fa-tv me-1"></i>
                      Shows
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                      to="/profile"
                    >
                      <i className="fas fa-user me-1"></i>
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                      to="/about"
                    >
                      <i className="fas fa-info-circle me-1"></i>
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                      to="/contact"
                    >
                      <i className="fas fa-envelope me-1"></i>
                      Contact
                    </Link>
                  </li>
                </>
              )
            ) : (
              <>
                {/* Public links when not logged in */}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                    to="/about"
                  >
                    <i className="fas fa-info-circle me-1"></i>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                    to="/contact"
                  >
                    <i className="fas fa-envelope me-1"></i>
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning ms-2" to="/signup">
                    <i className="fas fa-user-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
