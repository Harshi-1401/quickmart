import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">🛒 QuickMart</Link>
          
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/orders">My Orders</Link>
            {user?.role === 'admin' && (
              <Link to="/admin">Admin Panel</Link>
            )}
          </nav>

          <div className="header-actions">
            <div className="user-info">
              <span>👤 {user?.name}</span>
            </div>
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              🛍️ Cart ({getTotalItems()})
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
