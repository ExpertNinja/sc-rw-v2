import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReportSearch.css';

const ReportSearch = () => {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchText, startDate, endDate, page = 0, size = 10) => {
    const trimmed = searchText.trim();
    if (trimmed === "" && !startDate && !endDate) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (trimmed) params.append('q', trimmed);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', page);
      params.append('size', size);

      const response = await axios.get(`http://localhost:8081/api/reports/search?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setResults(response.data.content || response.data); // Handle pagination
    } catch (error) {
      console.error('Error searching reports:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="report-search-container">
      <div className="search-bar-wrapper">
        <div className="search-input-group">
          <input
            type="text"
            className="form-control search-input"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter report name..."
          />
          <button
            className="btn btn-primary search-button"
            onClick={() => handleSearch(query)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="search-results-wrapper">
        {results.length > 0 ? (
          <table className="table table-bordered search-results-table">
            <thead className="table-light">
              <tr>
                <th>Report Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.status}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          query && <p className="no-results-message">No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default ReportSearch;
