import { z } from 'zod';

/**
 * Input Validation Schemas
 * All user inputs are validated against these schemas before processing
 */

// ============ PRODUCT VALIDATION ============
export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100),
  description: z.string().min(0).max(1000).optional().or(z.literal('')),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive('Original price must be positive').optional(),
  category: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  image: z.string().optional().or(z.literal('')).refine(
    (val) => !val || val.startsWith('data:') || val.startsWith('http'),
    'Image must be a valid URL or base64 data URL'
  ),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// ============ ORDER VALIDATION ============
export const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const OrderSchema = z.object({
  userId: z.string(),
  items: z.array(OrderItemSchema).min(1),
  total: z.number().positive(),
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9-+().\s]+$/, 'Invalid phone number'),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().regex(/^[0-9-\s]+$/, 'Invalid zip code'),
    country: z.string().min(2),
  }),
  paymentMethod: z.enum(['card', 'upi', 'wallet']),
});

export type Order = z.infer<typeof OrderSchema>;

// ============ AUTH VALIDATION ============
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUp = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignIn = z.infer<typeof SignInSchema>;

// ============ OFFER VALIDATION ============
export const OfferSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  discount: z.string().min(1),
  discountedPrice: z.string().min(1),
  image: z.string().url('Invalid image URL'),
  endDate: z.string().refine((date) => new Date(date) > new Date(), 'End date must be in the future'),
  description: z.string().min(5).max(500).optional(),
});

export type Offer = z.infer<typeof OfferSchema>;

// ============ SEARCH VALIDATION ============
export const SearchSchema = z.object({
  query: z.string().max(100),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  rating: z.number().min(0).max(5).optional(),
  inStock: z.boolean().optional(),
});

export type Search = z.infer<typeof SearchSchema>;

/**
 * Utility function to validate input
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns { valid, data: T, errors: Record<string, string> }
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: boolean; data: T | null; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { valid: true, data: validated, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.reduce((acc, err) => {
        const path = Array.isArray(err.path) ? err.path.join('.') : 'general';
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { valid: false, data: null, errors };
    }
    return { 
      valid: false, 
      data: null, 
      errors: { general: 'Validation failed' } 
    };
  }
}

/**
 * Sanitize user input
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
