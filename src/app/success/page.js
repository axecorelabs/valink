'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pageId, setPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const qrCodeRef = useRef(null);

  const valentineUrl = pageId 
    ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/v/${pageId}` 
    : '';

  const downloadQRCode = (background = 'white') => {
    const canvas = qrCodeRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Create a high-resolution canvas for download (1024x1024 for crisp printing)
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    const highResSize = 1024;
    
    downloadCanvas.width = highResSize;
    downloadCanvas.height = highResSize;
    
    // Disable image smoothing for crisp QR code
    ctx.imageSmoothingEnabled = false;

    if (background === 'white') {
      // White background - simple draw
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, highResSize, highResSize);
      ctx.drawImage(canvas, 0, 0, highResSize, highResSize);
    } else {
      // Transparent background - need to process pixels
      // First draw the QR code at high resolution
      ctx.drawImage(canvas, 0, 0, highResSize, highResSize);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, highResSize, highResSize);
      const data = imageData.data;
      
      // Make white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        
        // If pixel is white or very light (near white), make it transparent
        if (red > 250 && green > 250 && blue > 250) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }
      
      // Clear the canvas and put the processed image data back
      ctx.clearRect(0, 0, highResSize, highResSize);
      ctx.putImageData(imageData, 0, 0);
    }

    // Download
    const link = document.createElement('a');
    link.download = `valentine-qr-${background}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();
  };

  const verifyPayment = async () => {
    const reference = searchParams.get('ref');
    
    if (!reference) {
      setError('No payment reference found');
      setLoading(false);
      return;
    }

    setRetrying(true);
    setError(null);

    try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setPageId(data.pageId);
        
        // Send email with the Valentine link
        const formData = sessionStorage.getItem('valentineFormData');
        if (formData) {
          const { email, fromName, toName } = JSON.parse(formData);
          const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/v/${data.pageId}`;
          
          // Store email data for potential resend
          setEmailData({ email, fromName, toName, pageUrl });
          
          // Send email asynchronously
          sendEmail({ email, fromName, toName, pageUrl });
        }
        
        sessionStorage.removeItem('valentineFormData');
        sessionStorage.removeItem('valentinePageId');
        sessionStorage.removeItem('valentinePaymentRef');
      } catch (err) {
        console.error('Verification error:', err);
        setRetrying(false);
      }
    };

  const sendEmail = async (data) => {
    setEmailSending(true);
    setEmailError(false);
    setEmailSent(false);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
      } else {
        setEmailError(true);
      }
    } catch (err) {
      console.error('Email error:', err);
      setEmailError(true);
    } finally {
      setEmailSending(false);
    }
  };

  const handleResendEmail = () => {
    if (emailData) {
      sendEmail(emailData);
    }
  };

  useEffect(() => {       
     setLoading(false);

    verifyPayment();
  }, [searchParams]);

  const shareUrl = pageId 
    ? `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/v/${pageId}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Will You Be My Valentine?',
          text: 'Someone sent you a special Valentine message! 💘',
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <p className="text-lg text-gray-700">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">😢</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={verifyPayment}
              disabled={retrying}
              className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {retrying ? 'Retrying...' : 'Try Again 🔄'}
            </button>
            <Link
              href="/"
              className="inline-block rounded-full border-2 border-gray-300 bg-white px-8 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full rounded-3xl bg-white p-8 shadow-2xl md:p-12"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6 text-center text-8xl"
        >
          💖
        </motion.div>

        <h1 className="mb-4 text-center text-3xl font-bold text-pink-600 md:text-4xl">
          Your Valentine page is ready!
        </h1>

        <p className="mb-8 text-center text-gray-700">
          Share this link with your Valentine and make their day special! 💘
        </p>

        {/* Email Status */}
        {emailSending && (
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-800">
              📧 Sending your link via email...
            </p>
          </div>
        )}
        
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-green-50 p-4"
          >
            <p className="text-center text-sm font-medium text-green-800">
              ✅ Email sent successfully! Check your inbox.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={emailSending}
              className="mt-2 w-full text-sm text-green-700 underline hover:text-green-900 disabled:opacity-50"
            >
              Resend Email
            </button>
          </motion.div>
        )}
        
        {emailError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-red-50 p-4"
          >
            <p className="text-center text-sm font-medium text-red-800">
              ❌ Failed to send email. Don't worry, you can still share the link below.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={emailSending}
              className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {emailSending ? 'Sending...' : 'Retry Sending Email 🔄'}
            </button>
          </motion.div>
        )}

        {/* Shareable Link */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Valentine page link:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900"
            />
            <button
              onClick={handleCopy}
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-pink-700"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-6">
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
            QR Code 📱
          </h3>
          <p className="mb-4 text-center text-sm text-gray-600">
            Perfect for physical gifts! Print this QR code on cards, attach to bouquets, or add to gift boxes.
          </p>
          
          <div className="mb-4 flex justify-center" ref={qrCodeRef}>
            <div className="rounded-lg bg-white p-4 shadow-lg">
              <QRCodeCanvas
                value={valentineUrl}
                size={512}
                level="H"
                includeMargin={true}
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={() => downloadQRCode('white')}
              className="rounded-lg bg-white border-2 border-pink-500 px-6 py-2 text-sm font-semibold text-pink-600 transition-all hover:bg-pink-50"
            >
              Download (White BG) ⬇️
            </button>
            <button
              onClick={() => downloadQRCode('transparent')}
              className="rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              Download (Transparent) ⬇️
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Share Link 📤
          </button>

          <Link
            href={`/v/${pageId}`}
            target="_blank"
            className="block w-full rounded-full border-2 border-pink-500 bg-white px-8 py-4 text-center text-lg font-bold text-pink-600 transition-all hover:bg-pink-50"
          >
            Open Page 👀
          </Link>

          <Link
            href="/create"
            className="block w-full rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-center text-lg font-bold text-gray-700 transition-all hover:bg-gray-50"
          >
            Create Another 💕
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg bg-pink-50 p-4 text-center">
          <p className="text-sm text-pink-800">
            ⏰ Your page will be active until <strong>February 15, 2026</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
