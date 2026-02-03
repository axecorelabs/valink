import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import ValentinePageModel from '@/models/ValentinePage';
import Partner from '@/models/Partner';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get partner details
    const partner = await Partner.findOne({ email: session.user.email });

    if (!partner) {
      return Response.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Count paid Valentine pages created with this partner code
    const totalPages = await ValentinePageModel.countDocuments({
      partnerId: partner._id,
      paymentStatus: 'paid',
    });

    return Response.json({
      success: true,
      stats: {
        totalPages,
        partnerCode: partner.partnerCode,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
