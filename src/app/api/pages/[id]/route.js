import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ValentinePage from '@/models/ValentinePage';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const page = await ValentinePage.findOne({ pageId: id });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check if page has expired
    if (new Date() > new Date(page.expiresAt)) {
      return NextResponse.json(
        { error: 'Page has expired', expired: true },
        { status: 410 }
      );
    }

    // Check if payment is completed
    if (page.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', paymentPending: true },
        { status: 402 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        fromName: page.fromName,
        toName: page.toName,
        message: page.message,
        templateId: page.templateId,
        createdAt: page.createdAt,
      },
    });
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
