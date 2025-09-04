import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, user }) => {
  // Handle null or undefined movie
  if (!movie || !movie._id) {
    console.error('MovieCard received invalid movie data:', movie);
    return null;
  }

  const canApprove = user && user.role === 'admin' && !movie.approved;
  const canEdit = user && (user.role === 'admin' || (movie.createdBy && movie.createdBy._id === user.id));

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="position-relative">
          <img
            src={movie.posterUrl || '/placeholder-poster.jpg'}
            className="card-img-top w-100"
            alt={movie.title}
            style={{ height: '250px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className={`badge ${movie.type === 'movie' ? 'bg-primary' : 'bg-info'} d-none d-sm-inline`}>
              {movie.type === 'movie' ? 'Movie' : 'TV Show'}
            </span>
            <span className={`badge ${movie.type === 'movie' ? 'bg-primary' : 'bg-info'} d-sm-none`}>
              {movie.type === 'movie' ? 'M' : 'TV'}
            </span>
          </div>
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className={`badge ${movie.approved ? 'bg-success' : 'bg-warning'} d-none d-sm-inline`}>
              {movie.approved ? 'Approved' : 'Pending'}
            </span>
            <span className={`badge ${movie.approved ? 'bg-success' : 'bg-warning'} d-sm-none`}>
              {movie.approved ? '✓' : '⏳'}
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column p-3">
          <h6 className="card-title fw-bold mb-2 text-truncate" title={movie.title}>
            {movie.title}
          </h6>
          <p className="card-text text-muted small mb-2">
            {movie.year && <span>{movie.year}</span>}
            {movie.director && <span className="d-none d-md-inline"> • {movie.director}</span>}
          </p>
          <p className="card-text flex-grow-1 small d-none d-sm-block">
            {movie.description ? movie.description.substring(0, 80) + '...' : 'No description available.'}
          </p>
          <div className="mt-auto">
            <Link to={`/movies/${movie._id}`} className="btn btn-warning btn-sm w-100">
              <i className="fas fa-eye me-1"></i>
              <span className="d-none d-sm-inline">View Details</span>
              <span className="d-sm-none">View</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
