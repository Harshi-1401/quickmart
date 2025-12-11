import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

function ApiDebug() {
  const [status, setStatus] = useState('Testing...');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setStatus('🔍 Testing API connection...');
      
      // Test products API
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setStatus(`✅ API Working! Found ${response.data.length} products`);
      setError(null);
      
    } catch (err) {
      setStatus('❌ API Connection Failed');
      setError(err.message);
      console.error('API Test Error:', err);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>🔧 API Debug Panel</h4>
      <p><strong>Status:</strong> {status}</p>
      
      {error && (
        <div style={{ color: 'red', fontSize: '12px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {products.length > 0 && (
        <div>
          <p><strong>Sample Products:</strong></p>
          <ul style={{ fontSize: '12px', maxHeight: '100px', overflow: 'auto' }}>
            {products.slice(0, 5).map(product => (
              <li key={product._id}>{product.name} - ₹{product.price}</li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={testApiConnection}
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry Test
      </button>
    </div>
  );
}

export default ApiDebug;