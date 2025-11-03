import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    approvedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await axios.get('http://localhost:8081/api/admin/stats', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setStats(statsResponse.data);

        // Fetch access requests
        const requestsResponse = await axios.get('http://localhost:8081/api/access-requests', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setRequests(requestsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalUsers: 0,
          pendingRequests: 0,
          approvedToday: 0
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [token]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAdGroup, setFilterAdGroup] = useState('');

  const handleGrantAccess = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:8081/api/subscription-requests/${requestId}/approve`, {
        adminEmail: user // Assuming user is the admin email from AuthContext
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Remove the approved request from the list
        setRequests(requests.filter(req => req.id !== requestId));
        alert(`Access granted for request ID: ${requestId}`);
      } else {
        alert('Failed to grant access');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Failed to grant access');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.id.toString().includes(searchTerm) ||
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.adGroup.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAdGroup = filterAdGroup === '' || request.adGroup === filterAdGroup;

    return matchesSearch && matchesAdGroup;
  });

  const uniqueAdGroups = [...new Set(requests.map(r => r.adGroup))];

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Dashboard</h2>
        <p className="text-muted">Access Request Management</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary">
                <i className="bi bi-people"></i>
              </div>
              <div>
                <h3 className="fs-2 fw-bold mb-0 text-dark">{stats.totalUsers}</h3>
                <p className="mb-0 text-muted small">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-warning">
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <h3 className="fs-2 fw-bold mb-0 text-dark">{requests.length}</h3>
                <p className="mb-0 text-muted small">Pending Requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="stat-icon bg-success">
                <i className="bi bi-check-circle"></i>
              </div>
              <div>
                <h3 className="fs-2 fw-bold mb-0 text-dark">{stats.approvedToday}</h3>
                <p className="mb-0 text-muted small">Approved Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-3">Filter Requests</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label small text-muted">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, username, or AD group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label small text-muted">Filter by AD Group</label>
              <select
                className="form-select"
                value={filterAdGroup}
                onChange={(e) => setFilterAdGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                {uniqueAdGroups.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterAdGroup('');
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="fw-bold text-dark p-3">Bank ID</th>
                  <th className="fw-bold text-dark p-3">Username</th>
                  <th className="fw-bold text-dark p-3">AD Group</th>
                  <th className="fw-bold text-dark p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="p-3 align-middle">
                        <span className="bank-id-badge">{request.bankId}</span>
                      </td>
                      <td className="p-3 align-middle">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-circle me-2 fs-5 text-secondary"></i>
                          {request.username}
                        </div>
                      </td>
                      <td className="p-3 align-middle">{request.adGroup}</td>
                      <td className="p-3 align-middle">
                        <button 
                          className="btn btn-grant-access px-3 py-2"
                          onClick={() => handleGrantAccess(request.id)}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Grant Access
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No requests found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
