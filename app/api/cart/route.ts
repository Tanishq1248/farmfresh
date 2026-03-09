import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
const mockCarts: Map<string, any> = new Map();

// GET user's cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let cart = mockCarts.get(userId);
    if (!cart) {
      cart = { id: Date.now().toString(), userId, items: [], createdAt: new Date() };
      mockCarts.set(userId, cart);
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, weight } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let cart = mockCarts.get(userId);
    if (!cart) {
      cart = { id: Date.now().toString(), userId, items: [], createdAt: new Date() };
      mockCarts.set(userId, cart);
    }

    const existingItem = cart.items.find((i: any) => i.productId === productId);
    if (existingItem) {
      existingItem.weight = (existingItem.weight || 1) + (weight || 1);
    } else {
      cart.items.push({ productId, weight: weight || 1 });
    }
    cart.updatedAt = new Date();

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// PUT - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    const body = await request.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
    }

    const cart = mockCarts.get(userId);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const item = cart.items.find((i: any) => i.productId === productId);
    if (item) {
      item.weight = body.weight;
    }
    cart.updatedAt = new Date();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
    }

    const cart = mockCarts.get(userId);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter((i: any) => i.productId !== productId);
    cart.updatedAt = new Date();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
