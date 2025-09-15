import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await userAPI.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error Loading Users</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchUsers}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="card-title">Users Dashboard</h1>
            <Link to="/users/new" className="btn btn-primary">
              Add New User
            </Link>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center" style={{ padding: '40px' }}>
            <h3>No users found</h3>
            <p className="mb-4">Get started by adding your first user.</p>
            <Link to="/users/new" className="btn btn-primary btn-lg">
              Add First User
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} style={{ color: '#007bff' }}>
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${user.phone}`} style={{ color: '#007bff' }}>
                        {user.phone}
                      </a>
                    </td>
                    <td>{user.company}</td>
                    <td>
                      {user.address.city}, {user.address.zip}
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          View
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={deleteLoading === user.id}
                        >
                          {deleteLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
