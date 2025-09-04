const About = () => {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <i className="fas fa-film fa-4x text-primary mb-4"></i>
                <h1 className="display-4 fw-bold text-primary">About Moviee Hubb</h1>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h3 className="text-primary mb-3">
                    <i className="fas fa-star me-2"></i>
                    Our Mission
                  </h3>
                  <p className="lead">
                    MovieApp lets users add, browse, and manage movies/shows with admin approval.
                    We provide a comprehensive platform for movie enthusiasts to discover,
                    organize, and share their favorite films and television shows.
                  </p>
                </div>

                <div className="col-md-6">
                  <h3 className="text-primary mb-3">
                    <i className="fas fa-cogs me-2"></i>
                    Features
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      User-friendly movie/show management
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Admin approval system
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Advanced filtering and search
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Responsive design
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Secure authentication
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="my-5" />

              <div className="text-center">
                <h3 className="text-primary mb-4">Technology Stack</h3>
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <span className="badge bg-primary fs-6 p-2 me-2 mb-2">
                      <i className="fab fa-react me-1"></i>
                      React
                    </span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-success fs-6 p-2 me-2 mb-2">
                      <i className="fab fa-node-js me-1"></i>
                      Node.js
                    </span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-info fs-6 p-2 me-2 mb-2">
                      <i className="fas fa-database me-1"></i>
                      MongoDB
                    </span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-warning fs-6 p-2 me-2 mb-2">
                      <i className="fab fa-bootstrap me-1"></i>
                      Bootstrap
                    </span>
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

export default About;
