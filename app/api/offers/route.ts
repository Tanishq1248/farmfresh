import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
const mockOffers: any[] = [
  { id: '1', title: 'Organic Fresh Vegetables', discount: '10% Off', endDate: '2026-03-15', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Organic Fresh Vegetables – Buy 2 Get 1 Free', discount: 'Free Item', endDate: '2026-03-20', createdAt: new Date(), updatedAt: new Date() },
];

// GET all offers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const offer = mockOffers.find(o => o.id === id);
      return NextResponse.json(offer || { error: 'Offer not found' }, { status: offer ? 200 : 404 });
    }

    return NextResponse.json(mockOffers, { status: 200 });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

// POST - Create a new offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const offer = {
      id: Date.now().toString(),
      title: body.title,
      discount: body.discount,
      endDate: body.endDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOffers.push(offer);
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}

// PUT - Update an offer
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const offer = mockOffers.find(o => o.id === id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    offer.title = body.title;
    offer.discount = body.discount;
    offer.endDate = body.endDate;
    offer.updatedAt = new Date();

    return NextResponse.json({ message: 'Offer updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

// DELETE - Delete an offer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    const index = mockOffers.findIndex(o => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    mockOffers.splice(index, 1);
    return NextResponse.json({ message: 'Offer deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
