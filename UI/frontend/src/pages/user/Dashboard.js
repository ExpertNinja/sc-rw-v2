import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css';
import ReportSearch from '../../components/Reportsearch/ReportSearch';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [subscribedGroups, setSubscribedGroups] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribedGroups: 0,
    pendingRequests: 3,
    newReports: 12
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch subscribed groups
        const groupsResponse = await axios.get(`http://localhost:8081/api/subscriptions/${user}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setSubscribedGroups(groupsResponse.data);

        // Fetch recent reports
        const reportsResponse = await axios.get('http://localhost:8081/api/reports/recent?page=0&size=10', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setRecentReports(reportsResponse.data.content || reportsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSubscribedGroups([]);
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchUserData();
    }
  }, [user, token]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groupsPerPage = 4;
  const totalPages = Math.ceil(subscribedGroups.length / groupsPerPage);

  const currentGroups = subscribedGroups.slice(
    currentIndex * groupsPerPage,
    (currentIndex + 1) * groupsPerPage
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const handleCheckboxChange = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allReportIds = recentReports.map(report => report.id);
      setSelectedReports(allReportIds);
    } else {
      setSelectedReports([]);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedReports.length === 0) {
      alert('Please select at least one report to download.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8081/api/reports/download/bulk', selectedReports, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reports.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading reports:', error);
      alert('Failed to download reports.');
    }
  };

  const handleBookmark = (reportId, reportName) => {
    alert(`Report "${reportName}" has been bookmarked!`);
  };

  const handleIndividualDownload = async (reportId, reportName) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/reports/download/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', reportName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report.');
    }
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedReports([]); // Clear selected reports when switching groups
  };

  const handleBackToRecent = () => {
    setSelectedGroup(null);
    setSelectedReports([]); // Clear selected reports when going back
  };

  // Determine which reports to display
  const displayedReports = selectedGroup
    ? []
    : recentReports;

  return (
    <div className="container-fluid p-4">
      <div className="dashboard-header mb-4">
        <div className="dashboard-header-left">
          <h2 className="fw-bold text-dark mb-1">User Dashboard</h2>
          <p className="text-muted">Welcome back! Here's your overview.</p>
        </div>
        <div className="dashboard-header-right">
          <ReportSearch />
        </div>
      </div>

      

      <div className="groups-section mb-4">
        <h5 className="text-dark mb-3 groups-title">My subscribed Groups</h5>
        
        <div className="groups-carousel position-relative">
          <button 
            className="carousel-btn carousel-btn-prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ‹
          </button>

          <div className="groups-grid-container">
            <div className="row g-3">
              {currentGroups.map((group) => (
                <div key={group.id} className="col-md-3">
                  <div className="card h-100 group-card" onClick={() => handleGroupClick(group)}>
                    <div className="card-body text-center">
                      <div className="group-icon mb-2">{group.icon}</div>
                      <h6 className="card-title group-card-title">{group.name}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-btn carousel-btn-next"
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1}
          >
            ›
          </button>
        </div>

        <div className="page-indicator">
          <span className="text-muted">
            Page {currentIndex + 1} of {totalPages}
          </span>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <div className="card-header-content">
            {selectedGroup && (
              <button
                className="btn btn-outline-secondary btn-sm back-button"
                onClick={handleBackToRecent}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            )}
            <h5 className="reports-title-header">
              {selectedGroup ? `${selectedGroup.name} Reports` : 'Recent Reports'}
            </h5>
          </div>
          <div className="card-header-actions">
            <button
              className="btn btn-success btn-sm"
              onClick={handleBulkDownload}
              disabled={selectedReports.length === 0}
            >
              <i className="bi bi-download me-2"></i>
              Download Selected ({selectedReports.length})
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Report Name</th>
                <th scope="col">Group</th>
                <th scope="col">Date Accessed</th>
                <th scope="col" className="action-column-header">
                  <i className="bi bi-star-fill"></i>
                </th>
                <th scope="col" className="action-column-header">
                  <i className="bi bi-download"></i>
                </th>
                <th scope="col" className="action-column-header">
                  <input
                    type="checkbox"
                    className="form-check-input table-checkbox"
                    onChange={handleSelectAll}
                    checked={selectedReports.length === displayedReports.length && displayedReports.length > 0}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.map((report, index) => (
                <tr key={report.id} className="reports-table">
                  <th scope="row">{index + 1}</th>
                  <td>{report.reportName}</td>
                  <td>{report.groupName}</td>
                  <td>{report.dateAccessed}</td>
                  <td className="action-column-cell">
                    <i
                      className="bi bi-star action-icon star-icon"
                      onClick={() => handleBookmark(report.id, report.reportName)}
                    ></i>
                  </td>
                  <td className="action-column-cell">
                    <i
                      className="bi bi-download action-icon download-icon"
                      onClick={() => handleIndividualDownload(report.id, report.reportName)}
                    ></i>
                  </td>
                  <td className="action-column-cell">
                    <input
                      type="checkbox"
                      className="form-check-input table-checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleCheckboxChange(report.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
