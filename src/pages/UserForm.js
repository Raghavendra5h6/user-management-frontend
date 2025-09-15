import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const UserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
        lng: ''
      }
    }
  });

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.zip.trim()) newErrors.zip = 'Zip code is required';
    if (!formData.address.geo.lat.trim()) newErrors.lat = 'Latitude is required';
    if (!formData.address.geo.lng.trim()) newErrors.lng = 'Longitude is required';

    // Email validation
    const emailRegex= /^\+\d{1,3}\(\d{2,4}\)\d{6,8}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^\+\d{1,3}\(\d{2,4}\)\d{6,8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Coordinate validation
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
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await userAPI.createUser(formData);
      navigate('/', { 
        state: { message: 'User created successfully!' } 
      });
    } catch (error) {
      alert(`Failed to create user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Add New User</h1>
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
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
