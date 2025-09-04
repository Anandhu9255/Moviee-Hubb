import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMovie();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      setMessage('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(`/movies/${id}/approve`);
      setMessage('Movie approved successfully!');
      fetchMovie();
    } catch (error) {
      setMessage('Failed to approve movie');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await api.delete(`/movies/${id}`);
        navigate('/movies');
      } catch (error) {
        setMessage('Failed to delete movie');
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Movie not found</div>
      </div>
    );
  }

  const canApprove = user && user.role === 'admin' && !movie.approved;
  const canEdit = user && (user.role === 'admin' || movie.createdBy._id === user.id);

  return (
    <div className="container-fluid py-3 py-md-5">
      <div className="row">
        <div className="col-lg-4 col-md-5 mb-4">
          <img
            src={movie.poster ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            className="img-fluid rounded shadow w-100"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-lg-8 col-md-7">
          <h1 className="display-4 display-5 fw-bold mb-3">{movie.title}</h1>
          <div className="mb-3">
            <span className={`badge fs-6 me-2 ${movie.type === 'movie' ? 'bg-primary' : 'bg-info'}`}>
              {movie.type === 'movie' ? 'Movie' : 'TV Show'}
            </span>
            <span className={`badge fs-6 ${movie.approved ? 'bg-success' : 'bg-warning'}`}>
              {movie.approved ? 'Approved' : 'Pending'}
            </span>
          </div>
          <div className="row mb-4">
            <div className="col-sm-6">
              <p className="mb-2"><strong>Year:</strong> {movie.year || 'N/A'}</p>
              <p className="mb-2"><strong>Director:</strong> {movie.director || 'N/A'}</p>
              <p className="mb-2"><strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-2"><strong>Location:</strong> {movie.location || 'N/A'}</p>
              <p className="mb-2"><strong>Duration:</strong> {movie.duration ? `${movie.duration} minutes` : 'N/A'}</p>
              <p className="mb-2 d-none d-sm-block"><strong>Created By:</strong> {movie.createdBy?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="h5">Description</h4>
            <p className="lead">{movie.description || 'No description available.'}</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left me-2"></i>Back
            </button>
            {canEdit && (
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/movies/${id}/edit`)}>
                <i className="fas fa-edit me-2"></i>Edit
              </button>
            )}
            {canApprove && (
              <button className="btn btn-success btn-sm" onClick={handleApprove}>
                <i className="fas fa-check me-2"></i>Approve
              </button>
            )}
            {canEdit && (
              <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                <i className="fas fa-trash me-2"></i>Delete
              </button>
            )}
          </div>
        </div>
      </div>
      {message && (
        <div className={`alert mt-4 ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
