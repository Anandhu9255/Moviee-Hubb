import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Simulate form submission
    setTimeout(() => {
      setMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="row">
            {/* Contact Form */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">
                    <i className="fas fa-envelope me-2"></i>
                    Send us a Message
                  </h3>
                </div>
                <div className="card-body p-4">
                  {message && (
                    <div className="alert alert-success alert-dismissible fade show mb-4">
                      <i className="fas fa-check-circle me-2"></i>
                      {message}
                      <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-user me-1"></i>
                          Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-envelope me-1"></i>
                          Email *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-comment me-1"></i>
                          Message *
                        </label>
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Tell us how we can help you..."
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-lg-4">
              <div className="card shadow mb-4">
                <div className="card-header bg-info text-white">
                  <h4 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Contact Info
                  </h4>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-3"></i>
                    <strong>Address:</strong><br />
                    123 Movie Street<br />
                    Cinema City, CC 12345
                  </div>

                  <div className="mb-3">
                    <i className="fas fa-phone text-primary me-3"></i>
                    <strong>Phone:</strong><br />
                    +1 (555) 123-4567
                  </div>

                  <div className="mb-3">
                    <i className="fas fa-envelope text-primary me-3"></i>
                    <strong>Email:</strong><br />
                    support@movieehubb.com
                  </div>

                  <div className="mb-3">
                    <i className="fas fa-clock text-primary me-3"></i>
                    <strong>Hours:</strong><br />
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat - Sun: 10:00 AM - 4:00 PM
                  </div>
                </div>
              </div>

              <div className="card shadow">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">
                    <i className="fas fa-question-circle me-2"></i>
                    Quick Help
                  </h4>
                </div>
                <div className="card-body">
                  <h6>Frequently Asked Questions:</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <i className="fas fa-chevron-right text-muted me-2"></i>
                      How to add a new movie?
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-chevron-right text-muted me-2"></i>
                      Admin approval process
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-chevron-right text-muted me-2"></i>
                      Account management
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-chevron-right text-muted me-2"></i>
                      Technical support
                    </li>
                  </ul>
                  <p className="small text-muted mt-3">
                    Check our FAQ section or contact us for immediate assistance.
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

export default Contact;
