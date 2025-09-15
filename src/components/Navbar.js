import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            User Management Dashboard
          </Link>
          
          <div className="d-flex gap-3">
            <Link
              to="/"
              className="btn"
              style={{
                backgroundColor: isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                textDecoration: 'none'
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/users/new"
              className="btn"
              style={{
                backgroundColor: isActive('/users/new') ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                textDecoration: 'none'
              }}
            >
              Add User
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
