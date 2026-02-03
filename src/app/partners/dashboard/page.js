'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function PartnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/partners');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/partners/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}?ref=${session.user.partnerCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}?ref=${session.user.partnerCode}`;
  const expectedPayout = (stats?.totalPages || 0) * 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user.name}! 👋</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/partners' })}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {/* Partner Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white shadow-lg md:p-8"
        >
          <div className="mb-4">
            <h2 className="text-sm font-medium text-pink-100">Your Partner Code</h2>
            <p className="text-3xl font-bold">{session.user.partnerCode}</p>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium text-pink-100">Your Referral Link</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 rounded-lg border-2 border-pink-300 bg-white/20 px-4 py-2 text-white placeholder-pink-200 backdrop-blur-sm focus:outline-none"
              />
              <button
                onClick={copyReferralLink}
                className="rounded-lg bg-white px-6 py-2 font-bold text-pink-600 transition-all hover:scale-105"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-2 text-4xl">📊</div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Total Valentine Pages</h3>
            <p className="text-4xl font-bold text-gray-900">{stats?.totalPages || 0}</p>
            <p className="mt-2 text-sm text-gray-500">Paid pages created via your link</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-2 text-4xl">💰</div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Expected Payout</h3>
            <p className="text-4xl font-bold text-gray-900">₦{expectedPayout.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">{stats?.totalPages || 0} pages × ₦200</p>
          </motion.div>
        </div>

        {/* Payout Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-pink-200 bg-pink-50 p-6"
        >
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
            <span>📧</span> Request Payout
          </h3>
          <p className="mb-4 text-gray-700">
            To request your payout, send an email to{' '}
            <a
              href="mailto:support@valink.com.ng"
              className="font-medium text-pink-600 hover:underline"
            >
              support@valink.com.ng
            </a>{' '}
            with your partner code: <span className="font-bold">{session.user.partnerCode}</span>
          </p>
          <a
            href={`mailto:support@valink.com.ng?subject=Payout Request - ${session.user.partnerCode}&body=Hello,%0D%0A%0D%0AI would like to request a payout for my partner account.%0D%0A%0D%0APartner Code: ${session.user.partnerCode}%0D%0ATotal Pages: ${stats?.totalPages || 0}%0D%0AExpected Payout: ₦${expectedPayout.toLocaleString()}%0D%0A%0D%0AThank you!`}
            className="inline-block rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-bold text-white transition-all hover:scale-105"
          >
            Send Payout Request Email
          </a>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            ← Back to Valink Home
          </a>
        </div>
      </div>
    </div>
  );
}
