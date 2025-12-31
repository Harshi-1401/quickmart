import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [emailValidated, setEmailValidated] = useState(false);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();



  const validateEmail = async () => {
    if (!formData.email) {
      setError('Please enter an email address');
      return;
    }

    setValidatingEmail(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://quickmart-backend-tvuf.onrender.com/api'}/auth/validate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailValidated(true);
        setError('');
      } else {
        setError(data.message);
        setEmailValidated(false);
      }
    } catch (error) {
      setError('Failed to validate email. Please try again.');
      setEmailValidated(false);
    } finally {
      setValidatingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      // Registration validation
      if (!emailValidated) {
        setError('Please validate your email first');
        return;
      }
      if (!formData.name || !formData.phone || !formData.address) {
        setError('Please fill all fields');
        return;
      }
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🛒 QuickMart</h1>
          <p>Fresh Groceries Delivered in Minutes</p>
        </div>

        <div className="login-tabs">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => {
              setIsLogin(true);
              setEmailValidated(false);
              setError('');
            }}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => {
              setIsLogin(false);
              setEmailValidated(false);
              setError('');
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
              <textarea
                placeholder="Delivery Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </>
          )}
          
          <div className="email-validation-container">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setEmailValidated(false);
              }}
              required
            />
            {!isLogin && (
              <button
                type="button"
                onClick={validateEmail}
                disabled={validatingEmail || emailValidated}
                className={`validate-btn ${emailValidated ? 'validated' : ''}`}
              >
                {validatingEmail ? 'Validating...' : emailValidated ? '✓ Verified' : 'Validate Email'}
              </button>
            )}
          </div>
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>


      </div>
    </div>
  );
}

export default Login;
