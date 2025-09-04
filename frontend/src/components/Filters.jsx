import React, { useState } from 'react';

const Filters = ({ filters, setFilters, clearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStatusToggle = (status) => {
    setFilters({ ...filters, approved: status });
  };

  return (
    <div className="mb-3">
      <button
        className="btn btn-outline-primary btn-sm d-md-none mb-2"
        onClick={() => setShowFilters(!showFilters)}
      >
        <i className="fas fa-filter me-2"></i>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className={`d-flex flex-wrap align-items-center gap-3 p-3 bg-light rounded shadow-sm ${showFilters ? '' : 'd-none d-md-flex'}`}>
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 w-100">
          <div className="d-flex flex-column flex-sm-row gap-2">
            <select
              className="form-select form-select-sm"
              name="type"
              value={filters.type}
              onChange={handleChange}
              style={{ minWidth: '120px' }}
            >
              <option value="">All Types</option>
              <option value="movie">Movie</option>
              <option value="show">Show</option>
            </select>

            <div className="btn-group btn-group-sm flex-wrap" role="group" aria-label="Status filter">
              <button
                type="button"
                className={`btn btn-outline-primary ${filters.approved === '' ? 'active' : ''}`}
                onClick={() => handleStatusToggle('')}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-outline-success ${filters.approved === 'true' ? 'active' : ''}`}
                onClick={() => handleStatusToggle('true')}
              >
                Approved
              </button>
              <button
                type="button"
                className={`btn btn-outline-warning ${filters.approved === 'false' ? 'active' : ''}`}
                onClick={() => handleStatusToggle('false')}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search title..."
              name="search"
              value={filters.search || ''}
              onChange={handleChange}
              style={{ minWidth: '150px' }}
            />

            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Year from"
                name="yearFrom"
                value={filters.yearFrom || ''}
                onChange={handleChange}
                style={{ width: '90px' }}
              />
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Year to"
                name="yearTo"
                value={filters.yearTo || ''}
                onChange={handleChange}
                style={{ width: '90px' }}
              />
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center">
            <select
              className="form-select form-select-sm"
              name="sort"
              value={filters.sort || ''}
              onChange={handleChange}
              style={{ minWidth: '130px' }}
            >
              <option value="">Sort By</option>
              <option value="year_asc">Year Asc</option>
              <option value="year_desc">Year Desc</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>

            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
