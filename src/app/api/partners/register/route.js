import bcrypt from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

// Generate partner codes like VAL-AB12
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 4);

export async function POST(request) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password) {
      return Response.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email already exists
    const existingPartner = await Partner.findOne({ email: email.toLowerCase() });
    if (existingPartner) {
      return Response.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique partner code
    let partnerCode;
    let codeExists = true;
    
    while (codeExists) {
      partnerCode = `VAL-${nanoid()}`;
      const existing = await Partner.findOne({ partnerCode });
      codeExists = !!existing;
    }

    // Create partner
    const partner = await Partner.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      partnerCode,
      role: 'partner',
    });

    return Response.json({
      success: true,
      message: 'Partner account created successfully',
      partnerCode: partner.partnerCode,
    });
  } catch (error) {
    console.error('Partner registration error:', error);
    return Response.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
