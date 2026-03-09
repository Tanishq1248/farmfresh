import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  update,
  remove,
  Database,
  DatabaseReference,
  connectDatabaseEmulator
} from 'firebase/database';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: any;
let database: Database | null = null;
let auth: Auth | null = null;
let initializationError: string | null = null;

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'databaseURL', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    const errorMessage = `Missing Firebase config: ${missingKeys.join(', ')}. Please check your .env.local file.`;
    console.error('❌', errorMessage);
    return { valid: false, error: errorMessage };
  }
  
  console.log('✅ Firebase config validation passed');
  return { valid: true, error: null };
};

// Initialize on client side with network retry logic
let initializationAttempted = false;

export const initializeFirebase = async () => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    // Prevent multiple initialization attempts
    if (initializationAttempted) {
      if (app && auth && database) {
        return true;
      }
      // Wait a bit for initialization to complete
      await new Promise(r => setTimeout(r, 500));
      if (app && auth && database) {
        return true;
      }
      return false;
    }

    if (app) {
      return true;
    }

    initializationAttempted = true;
    console.log('🔄 Initializing Firebase...');
    
    // Validate config first
    const { valid, error } = validateFirebaseConfig();
    if (!valid) {
      initializationError = error;
      console.error('Firebase config validation failed:', error);
      return false;
    }
    
    // Initialize app
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Initialize database
    database = getDatabase(app);
    console.log('✅ Firebase database initialized');
    
    // Initialize auth with persistence
    auth = getAuth(app);
    
    // Set persistence to LOCAL (default in web)
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('✅ Firebase persistence enabled');
    } catch (persistError) {
      console.warn('⚠️ Could not set persistence:', persistError);
    }
    
    console.log('✅ Firebase authentication initialized');
    console.log(`✅ Firebase initialization complete for project: ${firebaseConfig.projectId}`);
    
    return true;
  } catch (error) {
    initializationError = error instanceof Error ? error.message : String(error);
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
};

// Initialize Firebase immediately on module load
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure it initializes after other code
  setTimeout(() => {
    initializeFirebase().catch(error => {
      console.error('❌ Firebase initialization failed:', error);
    });
  }, 0);
}

// Expose initialization status for debugging
export const getFirebaseStatus = () => {
  return {
    initialized: !!app,
    databaseReady: !!database,
    authReady: !!auth,
    error: initializationError,
    config: {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      databaseURL: firebaseConfig.databaseURL
    }
  };
};

// Product Interface
export interface Product {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits';
  originalPrice: number;
  currentPrice: number;
  discount: number; // percentage (0-100)
  unit: string; // e.g., "per kg"
  description?: string;
  image?: string;
  inStock: boolean;
  featured: boolean;
  rating?: number;
  createdAt: number;
  updatedAt: number;
}

// Database References
export const getProductsRef = () => {
  if (!app) initializeFirebase();
  if (!database) {
    throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
  }
  return ref(database, 'products');
};

export const getProductRef = (productId: string) => {
  if (!app) initializeFirebase();
  if (!database) {
    throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
  }
  return ref(database, `products/${productId}`);
};

export const getOffersRef = () => {
  if (!app) initializeFirebase();
  if (!database) {
    throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
  }
  return ref(database, 'offers');
};

// Real-time listener for products
export const subscribeToPanicProducts = (callback: (products: Product[]) => void) => {
  // Ensure Firebase is initialized
  if (!app) initializeFirebase();
  
  if (!database) {
    console.warn('Firebase database not initialized. Products will not load from Firebase.');
    callback([]);
    return () => {}; // Return dummy unsubscribe function
  }

  const productsRef = getProductsRef();
  
  const unsubscribe = onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const productsList = Object.entries(data).map(([id, product]: any) => ({
        id,
        ...product
      })) as Product[];
      
      callback(productsList);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error fetching products:', error);
    callback([]);
  });

  return unsubscribe;
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
    }
    
    const newProductRef = ref(database, `products/${Date.now()}`);
    const productData = {
      ...product,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newProductRef, productData);
    return { id: Date.now().toString(), ...productData };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
    }
    
    const productRef = getProductRef(productId);
    const updateData = {
      ...updates,
      updatedAt: Date.now()
    };
    
    await update(productRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized. Please check your Firebase configuration and environment variables.');
    }
    
    const productRef = getProductRef(productId);
    await remove(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// User Interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: number;
  updatedAt: number;
}

// Helper function to handle Firebase auth errors
export const handleAuthError = (error: any): string => {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';
  
  const errorMap: { [key: string]: string } = {
    'auth/network-request-failed': 'Network error. Please check your internet connection and ensure Firebase services are accessible.',
    'auth/internal-error': 'Firebase authentication service error. If using Google Sign-In, please verify: 1) Google OAuth consent screen is configured, 2) Your domain is added to authorized origins, 3) Google APIs are enabled in Google Cloud Console.',
    'auth/user-not-found': 'User not found. Please check your email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'Email already in use. Please try signing in instead.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/invalid-email': 'Invalid email address. Please check and try again.',
    'auth/operation-not-allowed': 'Email/password authentication is not enabled. Please contact support.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
  };
  
  return errorMap[errorCode] || `Authentication error: ${errorCode || errorMessage}`;
};

// Retry mechanism for network failures
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Retry on network errors or internal errors
      const shouldRetry = (error?.code === 'auth/network-request-failed' || 
                          error?.code === 'auth/internal-error') &&
                         attempt < maxRetries - 1;
      
      if (shouldRetry) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`⚠️ Error (${error?.code}), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError;
};

// Authentication Functions
export const signUp = async (email: string, password: string) => {
  try {
    // Ensure Firebase is initialized
    if (!app || !auth) {
      console.log('🔄 Firebase not ready, initializing...');
      const initialized = await initializeFirebase();
      if (!initialized) {
        console.error('❌ Firebase initialization failed');
        throw new Error(initializationError || 'Firebase failed to initialize');
      }
      // Wait a moment for auth to be ready
      await new Promise(r => setTimeout(r, 100));
    }
    
    if (!auth) {
      throw new Error('Firebase authentication not initialized. Please check your Firebase configuration and ensure email/password auth is enabled in your Firebase project.');
    }
    
    console.log('🔄 Attempting to create user with email:', email);
    
    // Use retry mechanism for network resilience
    const userCredential = await retryWithBackoff(() =>
      createUserWithEmailAndPassword(auth!, email, password)
    );
    const user = userCredential.user;
    
    console.log('✅ User signed up successfully:', user.email);
    
    // Create user profile in database
    if (database) {
      try {
        const userProfileRef = ref(database, `users/${user.uid}`);
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        await set(userProfileRef, userProfile);
        console.log('✅ User profile created in database');
      } catch (dbError) {
        console.warn('⚠️ Could not create user profile in database:', dbError);
      }
    }
    
    return { uid: user.uid, email: user.email };
  } catch (error) {
    console.error('❌ Sign up error:', error);
    const friendlyError = handleAuthError(error);
    throw new Error(friendlyError);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Ensure Firebase is initialized
    if (!app || !auth) {
      console.log('🔄 Firebase not ready, initializing...');
      const initialized = await initializeFirebase();
      if (!initialized) {
        console.error('❌ Firebase initialization failed');
        throw new Error(initializationError || 'Firebase failed to initialize');
      }
      // Wait a moment for auth to be ready
      await new Promise(r => setTimeout(r, 100));
    }
    
    if (!auth) {
      throw new Error('Firebase authentication not initialized. Please check your Firebase configuration and ensure email/password auth is enabled in your Firebase project.');
    }
    
    console.log('🔄 Attempting to sign in with email:', email);
    
    // Use retry mechanism for network resilience
    const userCredential = await retryWithBackoff(() =>
      signInWithEmailAndPassword(auth!, email, password)
    );
    const user = userCredential.user;
    
    console.log('✅ User signed in successfully:', user.email);
    
    return { uid: user.uid, email: user.email };
  } catch (error) {
    console.error('❌ Sign in error:', error);
    const friendlyError = handleAuthError(error);
    throw new Error(friendlyError);
  }
};

export const signInWithGoogle = async () => {
  try {
    // Ensure Firebase is initialized
    if (!app || !auth) {
      console.log('🔄 Firebase not ready, initializing...');
      const initialized = await initializeFirebase();
      if (!initialized) {
        console.error('❌ Firebase initialization failed');
        throw new Error(initializationError || 'Firebase failed to initialize');
      }
      // Wait a moment for auth to be ready
      await new Promise(r => setTimeout(r, 100));
    }
    
    if (!auth) {
      throw new Error('Firebase authentication not initialized. Please check your Firebase configuration.');
    }
    
    console.log('🔄 Attempting Google sign in...');
    
    // Create Google Auth Provider
    const provider = new GoogleAuthProvider();
    
    // Sign in with popup
    const userCredential = await retryWithBackoff(() =>
      signInWithPopup(auth!, provider)
    );
    const user = userCredential.user;
    
    console.log('✅ User signed in with Google:', user.email);
    
    // Create/update user profile in database if needed
    if (database) {
      try {
        const userProfileRef = ref(database, `users/${user.uid}`);
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        await set(userProfileRef, userProfile);
        console.log('✅ Google user profile created in database');
      } catch (dbError) {
        console.warn('⚠️ Could not create Google user profile:', dbError);
      }
    }
    
    return { uid: user.uid, email: user.email, displayName: user.displayName };
  } catch (error) {
    console.error('❌ Google sign in error:', error);
    const friendlyError = handleAuthError(error);
    throw new Error(friendlyError);
  }
};

export const logOut = async () => {
  try {
    // Ensure Firebase is initialized
    if (!app || !auth) {
      const initialized = await initializeFirebase();
      if (!initialized) {
        throw new Error(initializationError || 'Firebase failed to initialize');
      }
    }
    
    if (!auth) {
      throw new Error('Firebase authentication not initialized.');
    }
    
    console.log('🔄 Signing out user...');
    await signOut(auth);
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('❌ Sign out error:', error);
    const friendlyError = handleAuthError(error);
    throw new Error(friendlyError);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  // Ensure Firebase is initialized
  if (!app) initializeFirebase();
  
  if (!auth) {
    console.warn('Firebase authentication not initialized. Defaulting to null user.');
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Get or create user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized.');
    }
    
    const userProfileRef = ref(database, `users/${uid}`);
    return new Promise((resolve, reject) => {
      onValue(userProfileRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val() as UserProfile);
        } else {
          resolve(null);
        }
      }, reject);
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized.');
    }
    
    const userProfileRef = ref(database, `users/${uid}`);
    await update(userProfileRef, {
      ...updates,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Order Interface
export interface Order {
  id: string;
  userId: string;
  items: any[];
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZip: string;
  phoneNumber: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: number;
  updatedAt: number;
}

// Save order to Firebase
export const saveOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized.');
    }

    // Validate total is a valid number
    const total = typeof order.total === 'number' && !isNaN(order.total) ? order.total : 0;
    if (total === 0 && order.items.length > 0) {
      console.warn('Warning: Order total is 0 but has items');
    }
    
    const orderId = Date.now().toString();
    const orderRef = ref(database, `orders/${orderId}`);
    const orderData: Order = {
      ...order,
      total: total,
      id: orderId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(orderRef, orderData);
    return orderId;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      console.warn('Firebase database not initialized.');
      callback([]);
      return () => {};
    }
    
    const ordersRef = ref(database, 'orders');
    return onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userOrders = Object.entries(data)
          .filter(([_, order]: any) => order.userId === userId)
          .map(([id, order]: any) => ({
            id,
            ...order
          })) as Order[];
        
        callback(userOrders);
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    return () => {};
  }
};

// Get all orders (for admin dashboard)
export const getAllOrders = (callback: (orders: Order[]) => void) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      console.warn('Firebase database not initialized.');
      callback([]);
      return () => {};
    }
    
    const ordersRef = ref(database, 'orders');
    return onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allOrders = Object.entries(data)
          .map(([id, order]: any) => ({
            id,
            ...order
          })) as Order[];
        
        callback(allOrders);
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error('Error getting all orders:', error);
    return () => {};
  }
};

// Save/Update user cart in Firebase
export const saveUserCart = async (userId: string, cart: any[]) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized.');
    }
    
    const cartRef = ref(database, `users/${userId}/cart`);
    const cartData = {
      items: cart,
      updatedAt: Date.now()
    };
    
    await set(cartRef, cartData);
    console.log('✅ Cart saved to Firebase for user:', userId);
  } catch (error) {
    console.error('Error saving cart to Firebase:', error);
    throw error;
  }
};

// Get user cart from Firebase
export const getUserCart = (userId: string, callback: (cart: any[]) => void) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      console.warn('Firebase database not initialized.');
      callback([]);
      return () => {};
    }
    
    const cartRef = ref(database, `users/${userId}/cart`);
    return onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback(data.items || []);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error('Error getting user cart:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up cart listener:', error);
    return () => {};
  }
};

// Clear user cart from Firebase
export const clearUserCart = async (userId: string) => {
  try {
    // Ensure Firebase is initialized
    if (!app) initializeFirebase();
    
    if (!database) {
      throw new Error('Firebase database not initialized.');
    }
    
    const cartRef = ref(database, `users/${userId}/cart`);
    await remove(cartRef);
    console.log('✅ Cart cleared from Firebase for user:', userId);
  } catch (error) {
    console.error('Error clearing cart from Firebase:', error);
    throw error;
  }
};

export { database, auth };
