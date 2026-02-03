import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ValentinePage from '@/models/ValentinePage';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Check if payment was successful
    if (paystackData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment was not successful' },
        { status: 400 }
      );
    }

    // Update page payment status
    await dbConnect();

    const page = await ValentinePage.findOneAndUpdate(
      { paymentReference: reference },
      { paymentStatus: 'paid' },
      { new: true }
    );

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pageId: page.pageId,
      verified: true,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// Webhook handler for Paystack
export async function GET(request) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      await dbConnect();

      await ValentinePage.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: 'paid' }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
