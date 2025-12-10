import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      const savedCart = localStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    console.log('Adding product to cart:', product);
    setCart(prevCart => {
      const productId = product._id || product.id;
      console.log('Product ID:', productId);
      const existing = prevCart.find(item => (item._id || item.id) === productId);
      if (existing) {
        console.log('Product exists in cart, updating quantity');
        return prevCart.map(item =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log('Adding new product to cart');
      const newCart = [...prevCart, { ...product, id: productId, _id: productId, quantity: 1 }];
      console.log('New cart:', newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if ((item._id || item.id) === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotal,
      getTotalItems,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
