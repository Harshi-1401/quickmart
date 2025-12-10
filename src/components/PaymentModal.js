import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ isOpen, onClose, onPayment, orderTotal }) {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when your order arrives'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '📱',
      description: 'PhonePe, GPay, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported'
    }
  ];

  const finalAmount = orderTotal;

  const handlePayment = () => {
    const paymentData = {
      method: selectedMethod,
      amount: finalAmount,
      ...(selectedMethod === 'card' && { cardDetails }),
      ...(selectedMethod === 'upi' && { upiId })
    };
    
    onPayment(paymentData);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h3>💳 Choose Payment Method</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="payment-summary">
          <div className="summary-row total-row">
            <span>Total Amount:</span>
            <span>₹{finalAmount.toFixed(0)}</span>
          </div>
        </div>

        <div className="payment-methods">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="method-info">
                <span className="method-icon">{method.icon}</span>
                <div>
                  <div className="method-name">{method.name}</div>
                  <div className="method-description">{method.description}</div>
                </div>
              </div>
              <div className="method-radio">
                <input
                  type="radio"
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {selectedMethod === 'card' && (
          <div className="card-form">
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              maxLength="19"
            />
            <div className="card-row">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                maxLength="5"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                maxLength="3"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="upi-form">
            <input
              type="text"
              placeholder="Enter UPI ID (e.g., user@paytm)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        <div className="payment-footer">
          <button className="pay-btn" onClick={handlePayment}>
            {selectedMethod === 'cod' ? 'Place Order' : `Pay ₹${finalAmount.toFixed(0)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;