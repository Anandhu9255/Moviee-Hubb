import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MovieCard = ({ movie, user, onUpdate, isImagePreloaded = false }) => {
  const imageLoadedRef = useRef(isImagePreloaded);
  const [imageLoading, setImageLoading] = useState(!imageLoadedRef.current);

  // Handle null or undefined movie
  if (!movie || !movie._id) {
    console.error('MovieCard received invalid movie data:', movie);
    return null;
  }

  // Use a cached image URL to reduce reloads on refresh
  const cachedImageUrl = movie.poster ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden" style={{ minHeight: '400px' }}>
      <div className="position-relative" style={{ height: '250px' }}>
        {imageLoading && (
          <div className="d-flex justify-content-center align-items-center w-100 h-100 bg-light">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <img
          src={cachedImageUrl}
          className="card-img-top"
          alt={movie.title}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            display: imageLoading ? 'none' : 'block',
            maxWidth: '100%'
          }}
          loading="lazy"
          onLoad={() => {
            setImageLoading(false);
            imageLoadedRef.current = true;
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            setImageLoading(false);
            imageLoadedRef.current = true;
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className={`badge ${movie.type === 'movie' ? 'bg-primary' : 'bg-info'}`}>
            {movie.type === 'movie' ? 'Movie' : 'TV Show'}
          </span>
        </div>



      </div>

      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title fw-bold mb-2 text-truncate" title={movie.title}>
          {movie.title}
        </h6>

        <div className="mb-2">
          <small className="text-muted">
            {movie.year && <span>{movie.year}</span>}
            {movie.director && <span> • {movie.director}</span>}
            {movie.duration && <span> • {movie.duration}min</span>}
          </small>
        </div>

        <p className="card-text flex-grow-1 small text-muted">
          {movie.description ? movie.description.substring(0, 100) + '...' : 'No description available.'}
        </p>

        <div className="mt-auto">
          <Link to={`/movies/${movie._id}`} className="btn btn-outline-primary btn-sm w-100">
            <i className="fas fa-eye me-1"></i>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
