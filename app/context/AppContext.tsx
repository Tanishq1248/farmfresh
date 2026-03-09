"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToPanicProducts, subscribeToOffers, onAuthChange, signUp, signIn, logOut, getUserOrders, getAllOrders, signInWithGoogle, getUserCart, saveUserCart, clearUserCart, saveOrder, createOffer, updateOffer, deleteOffer } from '@/lib/firebase';

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [cartUnsubscribe, setCartUnsubscribe] = useState<(() => void) | null>(null);

  // PERSISTENT AUTHENTICATION - Check if user is already logged in when app loads
  useEffect(() => {
    setAuthLoading(true);
    console.log('🔍 Checking for existing authentication session...');
    
    let unsubscribeOrders: (() => void) | null = null;
    
    const unsubscribeAuth = onAuthChange((firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('✅ User already logged in:', firebaseUser.email);
          // Case-insensitive email comparison for admin check
          const isAdmin = firebaseUser.email?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
          console.log('🔐 Admin check:', { email: firebaseUser.email, adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL, isAdmin });
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isAdmin: isAdmin,
            displayName: firebaseUser.displayName || null
          };
          
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          // Load user's orders and cart from Firebase
          unsubscribeOrders = loadUserOrdersAndCart(firebaseUser.uid);
        } else {
          console.log('ℹ️ No active user session');
          setUser(null);
          localStorage.removeItem('user');
          setOrders([]);
          setCart([]);
          
          // Cleanup orders subscription
          if (unsubscribeOrders) {
            unsubscribeOrders();
            unsubscribeOrders = null;
          }
        }
      } finally {
        // Always set loading to false after auth state is determined
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) {
        unsubscribeOrders();
      }
    };
  }, []);

  // Function to load user's orders and cart from Firebase
  const loadUserOrdersAndCart = (userId: string) => {
    // Subscribe to user's orders
    const unsubscribeOrders = getUserOrders(userId, (userOrders) => {
      console.log('📋 Loaded user orders from Firebase:', userOrders.length);
      setOrders(userOrders);
    });

    // Subscribe to user's cart
    const unsubscribeCart = getUserCart(userId, (userCart) => {
      console.log('🛒 Loaded user cart from Firebase:', userCart.length);
      setCart(userCart);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeCart();
    };
  };

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Subscribe to Firebase products
  useEffect(() => {
    try {
      const unsubscribe = subscribeToPanicProducts((firebaseProducts) => {
        console.log('📦 Loaded products from Firebase:', firebaseProducts.length);
        setProducts(firebaseProducts);
        setFirebaseConnected(true);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Firebase not configured. Using local products.');
      setFirebaseConnected(false);
    }
  }, []);

  // SYNC CART TO FIREBASE when user is logged in and cart changes
  useEffect(() => {
    if (user && user.uid && cart.length > 0) {
      // Sync cart to Firebase
      const syncTimeout = setTimeout(() => {
        saveUserCart(user.uid, cart)
          .then(() => console.log('✅ Cart synced to Firebase'))
          .catch((err) => console.error('⚠️ Failed to sync cart:', err));
      }, 1000); // Debounce cart saves

      return () => clearTimeout(syncTimeout);
    }
  }, [cart, user]);

  // Save cart to localStorage whenever it changes (offline backup)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Authentication Logic - Firebase
  const handleSignUp = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      await signUp(email, password);
      // User will be automatically logged in by onAuthStateChanged
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      await signIn(email, password);
      // User will be automatically logged in by onAuthStateChanged
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      const result = await signInWithGoogle();
      // User will be automatically logged in by onAuthStateChanged
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      
      // Save cart to Firebase before logging out
      if (user && user.uid && cart.length > 0) {
        try {
          await saveUserCart(user.uid, cart);
          console.log('✅ Cart saved before logout');
        } catch (error) {
          console.error('⚠️ Failed to save cart before logout:', error);
        }
      }
      
      // Clear Firebase cart on logout
      if (user && user.uid) {
        try {
          await clearUserCart(user.uid);
          console.log('✅ Firebase cart cleared on logout');
        } catch (error) {
          console.error('⚠️ Failed to clear Firebase cart:', error);
        }
      }
      
      await logOut();
      setUser(null);
      setOrders([]);
      setCart([]);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const isAdmin = () => user?.isAdmin === true;
  const isAuthenticated = () => user !== null;

  // Cart Logic
  const addToCart = (product: any) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCart = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Logic
  const toggleWishlist = (product: any) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order Logic
  const placeOrder = async (orderData: any) => {
    if (cart.length === 0) return null;
    
    try {
      const total = cart.reduce((sum: number, item: any) => sum + (item.currentPrice || item.price || 0) * (item.quantity || 1), 0);
      
      // Prepare order data for Firebase (without id, createdAt, updatedAt as they're added by saveOrder)
      const orderForFirebase = { 
        userId: user?.uid || 'anonymous',
        date: new Date().toLocaleDateString(), 
        items: cart, 
        total,
        ...orderData,
        status: 'pending'
      };
      
      // Save order to Firebase
      let orderId = Date.now().toString();
      if (user && user.uid) {
        try {
          const savedOrderId = await saveOrder(orderForFirebase);
          orderId = savedOrderId;
          console.log('✅ Order saved to Firebase:', orderId);
        } catch (error) {
          console.error('⚠️ Failed to save order to Firebase:', error);
          // Continue with local order even if Firebase fails
        }
      }
      
      // Create local order object with the Firebase order ID
      const newOrder = {
        id: orderId,
        ...orderForFirebase,
        createdAt: Date.now()
      };
      
      // Clear cart from Firebase
      if (user && user.uid) {
        try {
          await clearUserCart(user.uid);
          console.log('✅ Cart cleared from Firebase after order');
        } catch (error) {
          console.error('⚠️ Failed to clear Firebase cart:', error);
        }
      }
      
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  // Admin Product Management
  const addProduct = (product: any) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: number, updatedProduct: any) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Admin Offer Management
  const addOffer = (offer: any) => {
    const newOffer = { ...offer, id: Date.now() };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const updateOffer = (id: number, updatedOffer: any) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, ...updatedOffer } : o));
  };

  const deleteOffer = (id: number) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <AppContext.Provider value={{
      // Auth
      user, 
      authLoading,
      isAuthenticated,
      handleSignUp, 
      handleSignIn,
      handleGoogleSignIn,
      handleLogout,
      isAdmin,
      // Cart
      cart, addToCart, removeFromCart, updateCart, clearCart,
      // Wishlist
      wishlist, toggleWishlist,
      // Orders
      orders, placeOrder,
      // Products
      products, addProduct, updateProduct, deleteProduct, setProducts,
      // Offers
      offers, addOffer, updateOffer, deleteOffer,
      // Firebase
      firebaseConnected
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);