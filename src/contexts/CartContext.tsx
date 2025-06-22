
'use client';

import type { CartItemType, Product } from '@/lib/types';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { usePairChat } from './PairChatContext';

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { currentUser } = useAuth();
  const { isPairChatActive, activeInvitation } = usePairChat();

  const [activeCartKey, setActiveCartKey] = useState<string | null>(null);
  const [favKey, setFavKey] = useState<string | null>(null);

  // Effect to determine which cart/favorites key to use
  useEffect(() => {
    if (isPairChatActive && activeInvitation) {
      // In a pair session, use a shared cart key based on the invitation ID
      setActiveCartKey(`socialCartItems_shared_${activeInvitation.id}`);
    } else if (currentUser) {
      // Otherwise, use the user's personal cart key
      setActiveCartKey(`socialCartItems_${currentUser.id}`);
    } else {
      // No user and not in a session
      setActiveCartKey(null);
    }
    
    // Favorites are always personal
    setFavKey(currentUser ? `socialCartFavorites_${currentUser.id}` : null);
  }, [currentUser, isPairChatActive, activeInvitation]);

  // Effect to load cart from localStorage and listen for cross-tab changes
  useEffect(() => {
    if (!activeCartKey) {
      setCartItems([]);
      return;
    }

    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem(activeCartKey);
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
      }
    };
    
    loadCart();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === activeCartKey) {
        loadCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeCartKey]);

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    if (activeCartKey) {
      try {
        if (cartItems.length > 0) {
          localStorage.setItem(activeCartKey, JSON.stringify(cartItems));
        } else {
          localStorage.removeItem(activeCartKey);
        }
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
  }, [cartItems, activeCartKey]);

  // Effect for handling personal favorites
  useEffect(() => {
    if (favKey) {
      try {
        const storedFavorites = localStorage.getItem(favKey);
        setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      } catch (e) {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [favKey]);

  useEffect(() => {
    if (favKey) {
      try {
        if (favorites.length > 0) {
          localStorage.setItem(favKey, JSON.stringify(favorites));
        } else {
          localStorage.removeItem(favKey);
        }
      } catch(e) {
        console.error("Failed to save favorites");
      }
    }
  }, [favorites, favKey]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!activeCartKey) return; // Can't add to cart if not logged in or in a session
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    if (!activeCartKey) return;
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!activeCartKey) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleFavorite = (productId: string) => {
    if (!favKey) return;
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        cartTotal, 
        cartCount,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
