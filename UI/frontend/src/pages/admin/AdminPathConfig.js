import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminPathConfig.css';

const AdminPathConfig = () => {
  const { token } = useAuth();
  const [alert, setAlert] = useState('');
  const [pathConfigs, setPathConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPathConfigs = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/path-configs', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setPathConfigs(response.data);
      } catch (error) {
        console.error('Error fetching path configs:', error);
        setPathConfigs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPathConfigs();
  }, [token]);

  // Removed handleApiCall function as per requirements

  return (
    <div className="admin-path-config">
      <h2>Path Configuration</h2>
      <table className="path-config-table">
        <thead>
          <tr>
            <th>AD Group</th>
            <th>Description</th>
            <th>Path</th>
            <th>Reports</th>
          </tr>
        </thead>
        <tbody>
          {pathConfigs.map((config, index) => (
            <tr key={index}>
              <td>{config.adGroup}</td>
              <td>{config.description}</td>
              <td>{config.path}</td>
              <td>{config.reports}</td>
              <td>
                {/* No action button needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {alert && <div className="alert">{alert}</div>}
    </div>
  );
};

export default AdminPathConfig;
