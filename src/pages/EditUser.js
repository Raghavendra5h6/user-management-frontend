import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      zip: '',
      geo: {
        lat: '',
        lng: '',
      },
    },
  });

  // Wrap fetchUser in useCallback to avoid missing dependency warning
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.getUserById(id);
      const data = response.data;

      // Ensure nested address and geo fields merge properly
      setFormData(prev => ({
        ...prev,
        ...data,
        address: {
          ...prev.address,
          ...data.address,
          geo: {
            ...prev.address.geo,
            ...data.address?.geo,
          },
        },
      }));
    } catch (err) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // fetchUser included here to satisfy ESLint

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.zip.trim()) newErrors.zip = 'Zip code is required';
    if (!formData.address.geo.lat.trim()) newErrors.lat = 'Latitude is required';
    if (!formData.address.geo.lng.trim()) newErrors.lng = 'Longitude is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // More lenient phone regex (feel free to adjust)
    const phoneRegex = /^\+?[0-9\s\-().]{7,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    const lat = parseFloat(formData.address.geo.lat);
    const lng = parseFloat(formData.address.geo.lng);

    if (formData.address.geo.lat && (isNaN(lat) || lat < -90 || lat > 90)) {
      newErrors.lat = 'Latitude must be between -90 and 90';
    }

    if (formData.address.geo.lng && (isNaN(lng) || lng < -180 || lng > 180)) {
      newErrors.lng = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev) => {
        const newData = { ...prev };
        if (keys.length === 2) {
          newData[keys[0]] = {
            ...prev[keys[0]],
            [keys[1]]: value,
          };
        } else if (keys.length === 3) {
          newData[keys[0]] = {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value,
            },
          };
        }
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      await userAPI.updateUser(id, formData);
      navigate(`/users/${id}`, {
        state: { message: 'User updated successfully!' },
      });
    } catch (error) {
      alert(`Failed to update user: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/users/${id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading user data...</p>
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
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Edit User: {formData.name}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row" style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
                {errors.phone && <div className="error-message">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  name="company"
                  className={`form-control ${errors.company ? 'error' : ''}`}
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
                {errors.company && <div className="error-message">{errors.company}</div>}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '20px', color: '#333' }}>Address Information</h4>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address.street"
                  className={`form-control ${errors.street ? 'error' : ''}`}
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                />
                {errors.street && <div className="error-message">{errors.street}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="address.city"
                  className={`form-control ${errors.city ? 'error' : ''}`}
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
                {errors.city && <div className="error-message">{errors.city}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Zip Code *</label>
                <input
                  type="text"
                  name="address.zip"
                  className={`form-control ${errors.zip ? 'error' : ''}`}
                  value={formData.address.zip}
                  onChange={handleInputChange}
                  placeholder="Enter zip code"
                />
                {errors.zip && <div className="error-message">{errors.zip}</div>}
              </div>

              <h5 style={{ marginBottom: '15px', color: '#666' }}>Geographic Coordinates</h5>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="address.geo.lat"
                    className={`form-control ${errors.lat ? 'error' : ''}`}
                    value={formData.address.geo.lat}
                    onChange={handleInputChange}
                    placeholder="e.g., 40.7128"
                  />
                  {errors.lat && <div className="error-message">{errors.lat}</div>}
                </div>

                <div style={{ flex: 1 }}>
                  <label className="form-label">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="address.geo.lng"
                    className={`form-control ${errors.lng ? 'error' : ''}`}
                    value={formData.address.geo.lng}
                    onChange={handleInputChange}
                    placeholder="e.g., -74.0060"
                  />
                  {errors.lng && <div className="error-message">{errors.lng}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
