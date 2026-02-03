import PlayfulTemplate from '@/components/templates/PlayfulTemplate';
import RomanticTemplate from '@/components/templates/RomanticTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import ValentinePageModel from '@/models/ValentinePage';

async function getPageData(id) {
  try {
    await dbConnect();

    const page = await ValentinePageModel.findOne({ pageId: id });

    if (!page) {
      return { error: 'Page not found' };
    }

    // Check if page has expired
    if (new Date() > new Date(page.expiresAt)) {
      return { error: 'Page has expired', expired: true };
    }

    // Check if payment is completed
    if (page.paymentStatus !== 'paid') {
      return { error: 'Payment not completed', paymentPending: true };
    }

    return {
      page: {
        fromName: page.fromName,
        toName: page.toName,
        message: page.message,
        templateId: page.templateId,
        createdAt: page.createdAt,
        pageId: page.pageId,
        creatorEmail: page.email,
      },
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return { error: 'Failed to load page' };
  }
}

export default async function ValentinePage({ params }) {
  const { id } = await params;
  const { page, error, expired, paymentPending } = await getPageData(id);

  // Error states
  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">💔</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            This Valentine page has expired
          </h1>
          <p className="mb-6 text-gray-700">
            Valentine&apos;s Day has passed, but love is eternal! Create a new message anytime.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Create Your Own 💘
          </Link>
        </div>
      </div>
    );
  }

  if (paymentPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">⏳</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Payment Pending
          </h1>
          <p className="mb-6 text-gray-700">
            This page is waiting for payment confirmation. Please complete the payment to activate.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">😢</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="mb-6 text-gray-700">
            {error || "We couldn't find this Valentine page. It may have been removed or the link is incorrect."}
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Create Your Own 💘
          </Link>
        </div>
      </div>
    );
  }

  // Render appropriate template
  const TemplateComponent = {
    1: PlayfulTemplate,
    2: RomanticTemplate,
    3: MinimalTemplate,
  }[page.templateId];

  if (!TemplateComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">❌</div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Invalid Template
          </h1>
          <Link
            href="/"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TemplateComponent
      fromName={page.fromName}
      toName={page.toName}
      message={page.message}
      pageId={page.pageId}
      creatorEmail={page.creatorEmail}
      isPreview={false}
    />
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { page } = await getPageData(id);

  if (!page) {
    return {
      title: 'Valentine Page Not Found',
      description: 'Create your own Valentine page',
    };
  }

  return {
    title: `${page.fromName} has a Valentine message for ${page.toName} 💘`,
    description: `Will you be my Valentine? A special message from ${page.fromName}`,
    openGraph: {
      title: `${page.fromName} has a Valentine message for ${page.toName} 💘`,
      description: 'Open to see your special Valentine message!',
    },
  };
}
