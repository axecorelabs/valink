import { NextResponse } from 'next/server';
import { sendValentineEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, fromName, toName, pageUrl } = body;

    // Validation
    if (!email || !fromName || !toName || !pageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendValentineEmail({
      to: email,
      fromName,
      toName,
      pageUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Send email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
