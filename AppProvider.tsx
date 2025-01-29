// src/AppProvider.tsx
import React, { createContext, useState } from 'react';
import { Product } from './types';

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
  removeFromCart: (productId: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  clearCart: () => {},
  removeFromCart: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);
  
  const removeFromCart = (productId: string) => 
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};