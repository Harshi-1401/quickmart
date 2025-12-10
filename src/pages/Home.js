import React, { useState, useEffect } from 'react';
import { initialProducts, categories } from '../data/products';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to initial products if API fails
      setProducts(initialProducts);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <h2>Fresh Groceries Delivered in 10-15 Minutes</h2>
          <p>Order from 70+ daily essentials at best prices</p>
        </section>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <section className="categories-section">
          <h3>Shop by Category</h3>
          <div className="category-grid">
            {categories.map(cat => (
              <div
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="products-section">
          <h3>
            {selectedCategory === 'all' ? 'All Products' : 
             categories.find(c => c.id === selectedCategory)?.name}
            <span className="product-count"> ({filteredProducts.length})</span>
          </h3>
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-emoji">{product.emoji}</div>
                <h4 className="product-name">{product.name}</h4>
                <p className="product-unit">{product.unit}</p>
                <div className="product-footer">
                  <span className="product-price">₹{product.price}</span>
                  <button 
                    className="add-btn"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add'}
                  </button>
                </div>
                {product.stock < 20 && product.stock > 0 && (
                  <div className="low-stock">Only {product.stock} left</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <CartSidebar />
    </div>
  );
}

export default Home;
