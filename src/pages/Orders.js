import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'delivered': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="orders-page">
      <div className="container">
        <h2>My Orders</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>📦 No orders yet</p>
            <p>Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <span className="order-item-emoji">{item.emoji}</span>
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-qty">x{item.quantity}</span>
                      <span className="order-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-address">
                    <strong>Delivery Address:</strong> {order.userAddress}
                  </div>
                  <div className="order-total">
                    <strong>Total:</strong> ₹{order.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
