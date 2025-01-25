// src/AppProvider.tsx
import React, { createContext, useState } from 'react';

// Тип для товару (спростимо)
interface Product {
  id: string;
  title: string;
  price: number;
}

// Тип контексту кошика
interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
}

// Створюємо контекст
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  clearCart: () => {}
});

// Компонент-провайдер
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
