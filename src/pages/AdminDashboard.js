import React, { useState, useEffect } from 'react';
import { ordersAPI, productsAPI, usersAPI } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        usersAPI.getAll()
      ]);
      
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      await productsAPI.update(productId, updates);
      const updatedProducts = products.map(product =>
        product._id === productId ? { ...product, ...updates } : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        const updatedProducts = products.filter(p => p._id !== productId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalRevenue = () => {
    return orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h2>Admin Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{users.filter(u => u.role === 'user').length}</div>
            <div className="stat-label">Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{getTotalRevenue()}</div>
            <div className="stat-label">Revenue</div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders Management
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="admin-content">
            <h3>All Orders</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>
                        <div>{order.userName}</div>
                        <div className="small-text">{order.userPhone}</div>
                      </td>
                      <td>{order.items.length} items</td>
                      <td>₹{order.total}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-content">
            <h3>Product Inventory</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product._id.slice(-6)}</td>
                      <td>
                        <div className="product-cell">
                          <span className="product-emoji">{product.emoji}</span>
                          <div>
                            <div>{product.name}</div>
                            <div className="small-text">{product.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        {editingProduct === product._id ? (
                          <input
                            type="number"
                            defaultValue={product.price}
                            onBlur={(e) => updateProduct(product._id, { price: Number(e.target.value) })}
                            className="edit-input"
                          />
                        ) : (
                          `₹${product.price}`
                        )}
                      </td>
                      <td>
                        {editingProduct === product._id ? (
                          <input
                            type="number"
                            defaultValue={product.stock}
                            onBlur={(e) => updateProduct(product._id, { stock: Number(e.target.value) })}
                            className="edit-input"
                          />
                        ) : (
                          <span className={product.stock < 20 ? 'low-stock' : ''}>
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => setEditingProduct(editingProduct === product._id ? null : product._id)}
                        >
                          {editingProduct === product._id ? '✓' : '✏️'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteProduct(product._id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <h3>Registered Users</h3>
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id.slice(-6)}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
