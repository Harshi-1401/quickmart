import React from 'react';
import './OrderSuccessModal.css';

function OrderSuccessModal({ isOpen, onClose, orderData }) {
  if (!isOpen || !orderData) return null;

  const formatOrderId = (id) => {
    return `QM${id.slice(-8).toUpperCase()}`;
  };

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-content">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          
          <div className="order-details">
            <div className="order-id">
              <span className="label">Order ID:</span>
              <span className="value">{formatOrderId(orderData._id)}</span>
            </div>
            
            <div className="order-amount">
              <span className="label">Total Amount:</span>
              <span className="value">₹{orderData.total}</span>
            </div>
            
            <div className="payment-method">
              <span className="label">Payment Method:</span>
              <span className="value">{orderData.paymentMethod || 'Cash on Delivery'}</span>
            </div>
          </div>

          <div className="delivery-info">
            <div className="delivery-icon">🚚</div>
            <div className="delivery-text">
              <h3>Estimated Delivery</h3>
              <p>10-15 minutes</p>
            </div>
          </div>

          <div className="order-items">
            <h4>Order Summary ({orderData.items.length} items)</h4>
            <div className="items-list">
              {orderData.items.slice(0, 3).map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
              ))}
              {orderData.items.length > 3 && (
                <div className="more-items">
                  +{orderData.items.length - 3} more items
                </div>
              )}
            </div>
          </div>

          <div className="success-actions">
            <button className="track-btn" onClick={() => {
              onClose();
              window.location.href = '/orders';
            }}>
              Track Order
            </button>
            <button className="continue-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessModal;