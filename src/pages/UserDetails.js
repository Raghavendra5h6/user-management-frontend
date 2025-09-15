import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getUserById(id);
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await userAPI.deleteUser(id);
      navigate('/', { 
        state: { message: 'User deleted successfully!' } 
      });
    } catch (err) {
      alert(`Failed to delete user: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error Loading User</h4>
        <p>{error}</p>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={fetchUser}>
            Try Again
          </button>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-danger">
        <h4>User Not Found</h4>
        <p>The user you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="card-title">User Details</h1>
            <div className="d-flex gap-2">
              <Link
                to={`/users/${user.id}/edit`}
                className="btn btn-primary"
              >
                Edit User
              </Link>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>

        <div className="row" style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Personal Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <strong>Name:</strong>
              <p style={{ marginTop: '5px', fontSize: '18px' }}>{user.name}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Email:</strong>
              <p style={{ marginTop: '5px' }}>
                <a href={`mailto:${user.email}`} style={{ color: '#007bff' }}>
                  {user.email}
                </a>
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Phone:</strong>
              <p style={{ marginTop: '5px' }}>
                <a href={`tel:${user.phone}`} style={{ color: '#007bff' }}>
                  {user.phone}
                </a>
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Company:</strong>
              <p style={{ marginTop: '5px', fontSize: '16px' }}>{user.company}</p>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Address Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <strong>Street Address:</strong>
              <p style={{ marginTop: '5px' }}>{user.address.street}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>City:</strong>
              <p style={{ marginTop: '5px' }}>{user.address.city}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Zip Code:</strong>
              <p style={{ marginTop: '5px' }}>{user.address.zip}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Coordinates:</strong>
              <p style={{ marginTop: '5px' }}>
                Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Location on Map:</strong>
              <div style={{ marginTop: '10px' }}>
                <a
                  href={`https://www.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '30px 0' }} />

        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Account Information</h3>
          
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <strong>User ID:</strong>
              <p style={{ marginTop: '5px' }}>{user.id}</p>
            </div>
            
            <div>
              <strong>Created:</strong>
              <p style={{ marginTop: '5px' }}>{formatDate(user.created_at)}</p>
            </div>
            
            <div>
              <strong>Last Updated:</strong>
              <p style={{ marginTop: '5px' }}>{formatDate(user.updated_at)}</p>
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
