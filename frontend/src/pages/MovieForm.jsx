import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const MovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    type: 'movie',
    director: '',
    budget: '',
    location: '',
    duration: '',
    year: '',
    description: ''
  });

  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      const movie = response.data;
      setFormData({
        title: movie.title || '',
        type: movie.type || 'movie',
        director: movie.director || '',
        budget: movie.budget || '',
        location: movie.location || '',
        duration: movie.duration || '',
        year: movie.year || '',
        description: movie.description || ''
      });
      if (movie.poster) {
        setPosterPreview(movie.poster);
      }
    } catch (error) {
      setMessage('Failed to load movie data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Add poster if selected
      if (poster) {
        submitData.append('poster', poster);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditing) {
        await api.put(`/movies/${id}`, submitData, config);
        setMessage('Movie updated successfully!');
      } else {
        await api.post('/movies', submitData, config);
        setMessage('Movie created successfully!');
      }

      setTimeout(() => {
        navigate('/movies');
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'movie',
      director: '',
      budget: '',
      location: '',
      duration: '',
      year: '',
      description: ''
    });
    setPoster(null);
    setPosterPreview('');
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                {isEditing ? 'Edit Movie' : 'Add New Movie'}
              </h3>
            </div>

            <div className="card-body p-4">
              {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show mb-4`}>
                  <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                  {message}
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Poster Upload */}
                  <div className="col-md-4">
                    <div className="text-center">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-image me-1"></i>
                        Poster Image
                      </label>
                      <div className="mb-3">
                        {posterPreview ? (
                          <img
                            src={posterPreview}
                            alt="Poster preview"
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="border border-2 border-dashed rounded d-flex align-items-center justify-content-center"
                            style={{ height: '200px', backgroundColor: '#f8f9fa' }}
                          >
                            <div className="text-center text-muted">
                              <i className="fas fa-image fa-3x mb-2"></i>
                              <p>No image selected</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePosterChange}
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="col-md-8">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-heading me-1"></i>
                          Title *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter movie title"
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-tags me-1"></i>
                          Type *
                        </label>
                        <select
                          className="form-select"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="movie">Movie</option>
                          <option value="show">TV Show</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-user-tie me-1"></i>
                          Director
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="director"
                          value={formData.director}
                          onChange={handleChange}
                          placeholder="Enter director name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-calendar me-1"></i>
                          Year
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="Release year"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-dollar-sign me-1"></i>
                          Budget
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="Budget amount"
                          min="0"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-clock me-1"></i>
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="Duration in minutes"
                          min="0"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          Location
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Filming location"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-align-left me-1"></i>
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Movie description or plot summary"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/movies')}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={resetForm}
                  >
                    <i className="fas fa-undo me-2"></i>
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}></i>
                        {isEditing ? 'Update Movie' : 'Create Movie'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
