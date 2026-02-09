'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlayfulTemplate from '@/components/templates/PlayfulTemplate';
import RomanticTemplate from '@/components/templates/RomanticTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

export default function PreviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('valentineFormData');
    if (!data) {
      router.push('/create');
      return;
    }
    setFormData(JSON.parse(data));
  }, [router]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create page in database
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create page');
      }

      // Store page ID for payment verification
      sessionStorage.setItem('valentinePageId', data.pageId);
      sessionStorage.setItem('valentinePaymentRef', data.paymentReference);

      // Initialize Paystack payment
      const PaystackPop = (await import('@paystack/inline-js')).default;
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: parseInt(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '100000'),
        reference: data.paymentReference,
        onSuccess: (transaction) => {
          // Redirect to success page
          router.push(`/success?ref=${transaction.reference}`);
        },
        onCancel: () => {
          setLoading(false);
          alert('Payment cancelled. You can try again.');
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleChangeTemplate = () => {
    router.push('/create');
  };

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = {
    1: PlayfulTemplate,
    2: RomanticTemplate,
    3: MinimalTemplate,
  }[formData.templateId];

  return (
    <div className="relative">
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-pink-600 px-4 py-3 text-center text-white shadow-lg">
        <p className="mb-3 text-sm font-medium md:text-base">
          ✨ Preview Mode - This is how your Valentine page will look
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!loading && (
            <button
              onClick={handleChangeTemplate}
              className="rounded-full border-2 border-white bg-transparent px-6 py-2 text-sm font-bold text-white transition-all hover:bg-white hover:text-pink-600"
            >
              Change Template
            </button>
          )}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-2 text-sm font-bold text-pink-600 shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              'Continue to Payment (₦200)'
            )}
          </button>
        </div>
      </div>

      {/* Template Preview */}
      <div className="pt-32 md:pt-28">
        <TemplateComponent
          fromName={formData.fromName}
          toName={formData.toName}
          message={formData.message}
          isPreview={true}
        />
      </div>
    </div>
  );
}
