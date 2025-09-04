import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container-fluid px-3">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-8 col-sm-10 col-12">
            <div className="card shadow-lg border-0 rounded-lg text-center">
              <div className="card-body p-5">
                <div className="mb-4">
                  <i className="fas fa-exclamation-triangle fa-5x text-warning mb-4"></i>
                  <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
                  <h2 className="h3 mb-3">Page Not Found</h2>
                  <p className="lead text-muted mb-4">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Link to="/" className="btn btn-primary btn-lg me-md-2">
                    <i className="fas fa-home me-2"></i>
                    Go Home
                  </Link>
                  <Link to="/movies" className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-film me-2"></i>
                    Browse Movies
                  </Link>
                </div>

                <hr className="my-4" />

                <div className="small text-muted">
                  <p className="mb-2">Quick Links:</p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Link to="/about" className="text-decoration-none">
                      <span className="badge bg-secondary">About</span>
                    </Link>
                    <Link to="/contact" className="text-decoration-none">
                      <span className="badge bg-secondary">Contact</span>
                    </Link>
                    <Link to="/profile" className="text-decoration-none">
                      <span className="badge bg-secondary">Profile</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
