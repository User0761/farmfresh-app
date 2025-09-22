import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalPrice: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('farmFreshCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmFreshCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === product.id
      );

      let newItems;

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [
          ...prevCart.items,
          { productId: product.id, product, quantity },
        ];
      }

      const newTotalPrice = calculateTotalPrice(newItems);

      return {
        items: newItems,
        totalPrice: newTotalPrice,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.productId !== productId);
      const newTotalPrice = calculateTotalPrice(newItems);

      return {
        items: newItems,
        totalPrice: newTotalPrice,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const newTotalPrice = calculateTotalPrice(newItems);

      return {
        items: newItems,
        totalPrice: newTotalPrice,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalPrice: 0,
    });
  };

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};