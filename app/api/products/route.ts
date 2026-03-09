import { NextRequest, NextResponse } from 'next/server';
import { validateInput, ProductSchema, sanitizeInput } from '@/lib/validation';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';

// Note: Products are managed client-side with Firebase Realtime Database
// This API route provides validation and structured responses for product operations
// Actual data persistence is handled by the client-side Firebase SDK

// GET all products or by ID
export async function GET(request: NextRequest) {
  try {
    const startTime = performance.now();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Note: GET by ID is handled client-side with Firebase
      logger.apiCall('GET', '/api/products?id=' + id, 200, 0);
      return successResponse({ 
        message: 'Products are fetched client-side from Firebase',
        id: id 
      });
    }

    // Get all products
    // Note: GET all is handled client-side with Firebase
    logger.apiCall('GET', '/api/products', 200, 0, { count: 0 });
    return successResponse({ 
      message: 'Products are fetched client-side from Firebase',
      data: []
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/products');
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const startTime = performance.now();

    const body = await request.json();

    // Handle price logic - if price (discounted) is not provided, use originalPrice
    let price = body.price ? parseFloat(body.price) : undefined;
    const originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : undefined;
    
    if (!price && originalPrice) {
      price = originalPrice;
    }

    // Validate input
    const validation = validateInput(ProductSchema, {
      name: sanitizeInput(body.name),
      description: sanitizeInput(body.description || ''),
      price: price,
      originalPrice: originalPrice,
      category: sanitizeInput(body.category),
      unit: sanitizeInput(body.unit || 'per kg'),
      image: body.image || '',
      inStock: body.inStock !== false,
      featured: body.featured === true,
      rating: body.rating ? parseFloat(body.rating) : undefined,
    });

    if (!validation.valid) {
      const duration = performance.now() - startTime;
      logger.apiCall('POST', '/api/products', 400, duration, { errors: validation.errors });
      return errorResponse('Invalid product data', 400, { errors: validation.errors });
    }

    const productId = Date.now().toString();
    const product = {
      id: productId,
      ...validation.data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const duration = performance.now() - startTime;
    logger.apiCall('POST', '/api/products', 201, duration, { productId });
    
    // Note: Actual Firebase persistence is handled by client-side SDK
    // Admin page will trigger context update via setProducts
    return successResponse(product, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/products');
  }
}

// PUT - Update a product
export async function PUT(request: NextRequest) {
  try {
    const startTime = performance.now();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Product ID is required', 400);
    }

    const body = await request.json();

    // Handle price logic
    let price = body.price !== undefined ? (body.price ? parseFloat(body.price) : undefined) : undefined;
    const originalPrice = body.originalPrice !== undefined ? parseFloat(body.originalPrice) : undefined;
    
    if (price === undefined && originalPrice) {
      price = originalPrice;
    }

    const updatedProduct = {
      id: id,
      name: body.name,
      description: body.description || '',
      price: price,
      originalPrice: originalPrice,
      category: body.category,
      unit: body.unit || 'per kg',
      image: body.image || '',
      inStock: body.inStock !== false,
      featured: body.featured === false ? false : (body.featured === true),
      discount: body.discount || 0,
      rating: body.rating ? parseFloat(body.rating) : undefined,
      updatedAt: Date.now(),
    };

    const duration = performance.now() - startTime;
    logger.apiCall('PUT', `/api/products?id=${id}`, 200, duration);
    
    // Note: Actual Firebase persistence is handled by client-side SDK
    return successResponse(updatedProduct, 200);
  } catch (error) {
    return handleApiError(error, 'PUT /api/products');
  }
}

// DELETE - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const startTime = performance.now();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Product ID is required', 400);
    }

    const duration = performance.now() - startTime;
    logger.apiCall('DELETE', `/api/products?id=${id}`, 200, duration);
    
    // Note: Actual Firebase persistence is handled by client-side SDK
    return successResponse({ message: 'Product deleted successfully', id }, 200);
  } catch (error) {
    return handleApiError(error, 'DELETE /api/products');
  }
}
