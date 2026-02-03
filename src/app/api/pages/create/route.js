import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import dbConnect from '@/lib/mongodb';
import ValentinePage from '@/models/ValentinePage';
import Partner from '@/models/Partner';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fromName, toName, email, message, templateId, partnerCode } = body;

    // Validation
    if (!fromName || !toName || !email || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (fromName.length > 30 || toName.length > 30) {
      return NextResponse.json(
        { error: 'Names must be 30 characters or less' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (message && message.length > 120) {
      return NextResponse.json(
        { error: 'Message must be 120 characters or less' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Validate and lookup partner code if provided
    let partnerId = null;
    let validPartnerCode = '';
    
    if (partnerCode && partnerCode.trim()) {
      const partner = await Partner.findOne({ partnerCode: partnerCode.trim() });
      if (partner) {
        partnerId = partner._id;
        validPartnerCode = partner.partnerCode;
      }
      // If invalid, silently ignore (per PRD requirement)
    }

    // Generate unique IDs
    const pageId = nanoid(10);
    const paymentReference = `VAL_${nanoid(16)}`;

    // Create page
    const page = await ValentinePage.create({
      pageId,
      fromName,
      toName,
      email,
      message: message || '',
      templateId,
      paymentStatus: 'pending',
      paymentReference,
      partnerCode: validPartnerCode,
      partnerId: partnerId,
    });

    return NextResponse.json({
      success: true,
      pageId: page.pageId,
      paymentReference: page.paymentReference,
    });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
