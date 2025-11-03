import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Users.css';

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAdGroup, setFilterAdGroup] = useState('');

  const handleRevokeAccess = async (userId, username) => {
    try {
      // Commented API call - uncomment when backend is ready
      /*
      const response = await fetch(`http://localhost:8081/api/users/${userId}/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Access revoked for user: ${username}`);
        // Refresh the users list
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: 'Inactive' } : user
        ));
      } else {
        alert('Failed to revoke access');
      }
      */

      // Static behavior for demo
      alert(`Access revoked for user: ${username}`);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: 'Inactive' } : user
      ));
    } catch (error) {
      console.error('Error revoking access:', error);
      alert('Failed to revoke access');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.bankId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    const matchesAdGroup = filterAdGroup === '' || user.adGroups.includes(filterAdGroup);

    return matchesSearch && matchesStatus && matchesAdGroup;
  });

  const allAdGroups = [...new Set(users.flatMap(u => u.adGroups))];

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">User Management</h2>
        <p className="text-muted">Manage user access and permissions</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h3 className="text-primary">{users.length}</h3>
              <p className="mb-0 text-muted">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body text-center">
              <h3 className="text-success">{users.filter(u => u.status === 'Active').length}</h3>
              <p className="mb-0 text-muted">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-secondary">
            <div className="card-body text-center">
              <h3 className="text-secondary">{users.filter(u => u.status === 'Inactive').length}</h3>
              <p className="mb-0 text-muted">Inactive Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-3">Filter Users</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small text-muted">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Bank ID, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">AD Group</label>
              <select
                className="form-select"
                value={filterAdGroup}
                onChange={(e) => setFilterAdGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                {allAdGroups.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
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
                  <th className="p-3">Bank ID</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">AD Groups</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="p-3 align-middle">
                        <span className="badge bg-secondary">{user.bankId}</span>
                      </td>
                      <td className="p-3 align-middle">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-circle me-2 fs-5 text-primary"></i>
                          {user.username}
                        </div>
                      </td>
                      <td className="p-3 align-middle">{user.email}</td>
                      <td className="p-3 align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {user.adGroups.map((group, index) => (
                            <span key={index} className="badge bg-info text-dark">
                              {group}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 align-middle">
                        <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 align-middle">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRevokeAccess(user.id, user.username)}
                          disabled={user.status === 'Inactive'}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No users found matching your filters
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

export default Users;
