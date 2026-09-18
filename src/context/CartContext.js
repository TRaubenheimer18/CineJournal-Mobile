import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ movie, quantity }]

  const addToCart = (movie) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.movie.id === movie.id);
      if (existing) {
        return prev.map((i) =>
          i.movie.id === movie.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { movie, quantity: 1 }];
    });
  };

  const removeFromCart = (movieId) => {
    setItems((prev) => prev.filter((i) => i.movie.id !== movieId));
  };

  const updateQuantity = (movieId, quantity) => {
    if (quantity <= 0) return removeFromCart(movieId);
    setItems((prev) =>
      prev.map((i) => (i.movie.id === movieId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.movie.price * i.quantity, 0),
    [items]
  );

  const isInCart = (movieId) => items.some((i) => i.movie.id === movieId);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};