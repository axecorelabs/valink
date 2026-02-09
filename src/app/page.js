'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');
  const createPageUrl = refCode ? `/create?ref=${refCode}` : '/create';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-pink-600 md:text-6xl lg:text-7xl">
            Create a cute Valentine page<br />in 30 seconds 💘
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 md:text-xl">
            Send a personalized "Will You Be My Valentine?" page that's adorable, 
            shareable, and unforgettable. Choose from cute templates, pay once, and share instantly.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="mb-3 text-4xl">⚡</div>
            <h3 className="mb-2 font-semibold text-gray-900">Super Fast</h3>
            <p className="text-sm text-gray-600">Create your page in under 60 seconds</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="mb-3 text-4xl">🎨</div>
            <h3 className="mb-2 font-semibold text-gray-900">Cute Templates</h3>
            <p className="text-sm text-gray-600">Choose from playful, romantic, or minimal designs</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="mb-3 text-4xl">📱</div>
            <h3 className="mb-2 font-semibold text-gray-900">Share Anywhere</h3>
            <p className="text-sm text-gray-600">Perfect for Instagram, WhatsApp, TikTok</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={createPageUrl}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-12 py-5 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <span className="relative z-10">Create My Valentine Page 💖</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </Link>

        {/* Pricing */}
        <p className="mt-6 text-sm text-gray-600">
          One-time payment · ₦200 · Link active until Feb 15
        </p>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">💘</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
