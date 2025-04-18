import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      await register({ email, password, role: 'user' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="#5DFF00" strokeWidth="8" />
                <path d="M35 35L65 65" stroke="#5DFF00" strokeWidth="8" strokeLinecap="round" />
                <path d="M35 65L65 35" stroke="#5DFF00" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Create New Account</h2>
          </div>
          
          {error && (
            <div className="register-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              className="register-button-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Register
                </>
              )}
            </button>
          </form>
          
          <div className="login-section">
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">
              <i className="fas fa-sign-in-alt"></i> Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;