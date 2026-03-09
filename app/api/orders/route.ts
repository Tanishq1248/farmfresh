import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
const mockOrders: any[] = [];

// GET all orders or by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const orders = mockOrders.filter(o => o.userId === userId);
      return NextResponse.json(orders, { status: 200 });
    }

    return NextResponse.json(mockOrders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, total } = body;

    if (!userId || !items || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = {
      id: Date.now().toString(),
      userId,
      items: items.map((item: any) => ({
        productId: item.productId,
        weight: item.weight,
        price: parseFloat(item.price),
      })),
      total: parseFloat(total),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrders.push(order);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const order = mockOrders.find(o => o.id === id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.status = body.status;
    order.updatedAt = new Date();

    return NextResponse.json({ message: 'Order updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
