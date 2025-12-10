import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import PaymentModal from './PaymentModal';
import OrderSuccessModal from './OrderSuccessModal';
import './CartSidebar.css';

function CartSidebar() {
  const { cart, updateQuantity, getTotal, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentData) => {
    try {
      console.log('Processing payment:', paymentData);
      const response = await ordersAPI.create({ 
        items: cart, 
        paymentData
      });
      
      console.log('Order response:', response.data);
      setOrderData(response.data);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setIsCartOpen(false);
    setOrderData(null);
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item._id || item.id} className="cart-item">
                <div className="cart-item-emoji">{item.emoji}</div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-unit">{item.unit}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item._id || item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id || item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{getTotal()}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={handlePayment}
        orderTotal={getTotal()}
      />

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        orderData={orderData}
      />
    
    </>
  );
}

export default CartSidebar;
