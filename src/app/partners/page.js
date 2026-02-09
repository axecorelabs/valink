'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Link2, Share2, DollarSign } from 'lucide-react';

export default function PartnersPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Registration successful but login failed');
      }

      // Redirect to dashboard
      router.push('/partners/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        ...loginData,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid email or password');
      }

      // Redirect to dashboard
      router.push('/partners/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="border-b border-pink-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="text-2xl">💘</div>
            <span className="text-xl font-bold text-gray-900">Valink</span>
          </a>
          
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Home
            </a>
            <button
              onClick={() => setShowLoginModal(true)}
              className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-6 py-2 text-sm font-bold text-white transition-all hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 text-6xl">💰</div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Earn ₦200 for every Valentine page created 💘
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700 md:text-xl">
            Share Valink with your audience and earn money every time someone creates a Valentine page.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* <button
              onClick={() => setShowRegisterForm(true)}
              className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Become a Partner
            </button> */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="rounded-full border-2 border-pink-500 bg-white px-8 py-4 text-lg font-bold text-pink-600 transition-all hover:bg-pink-50"
            >
              Partner Login
            </button>
          </div>
        </motion.div>
      </section>

      {/* Who Is This For */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Who Is This For?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
            Our partner program is designed for anyone who wants to earn while spreading love
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Gift Vendors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-pink-200 bg-white p-8 shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-red-500 p-4 text-4xl">
                🎁
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Gift Vendors & Businesses
              </h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Elevate your Valentine packages! Include a personalized Valentine page as part of your gift offerings. Print a QR code on cards, attach it to flower bouquets, or add it to gift boxes.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-pink-600">✓</span>
                  <span className="text-gray-700">Create unique "Will you be my Valentine?" experiences</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600">✓</span>
                  <span className="text-gray-700">Add QR codes to physical gifts for a digital surprise</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600">✓</span>
                  <span className="text-gray-700">Earn ₦200 commission on every page created</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-pink-600">✓</span>
                  <span className="text-gray-700">Stand out from competitors with tech-enhanced gifts</span>
                </div>
              </div>
            </motion.div>

            {/* Content Creators & Influencers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-purple-200 bg-white p-8 shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-4xl">
                📱
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Content Creators & Promoters
              </h3>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Share Valink with your audience and earn passive income. Perfect for social media influencers, bloggers, and anyone with an online presence who wants to monetize their reach.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-gray-700">Share your unique referral link anywhere</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-gray-700">Earn ₦200 for every paid Valentine page</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-gray-700">No limits on how much you can earn</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-gray-700">Perfect for Valentine's season campaigns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-gray-50 to-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
            Start earning in 4 simple steps
          </p>
          
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { number: '1', title: 'Sign up as a partner', icon: FileText, color: 'from-blue-500 to-blue-600' },
              { number: '2', title: 'Get your unique link', icon: Link2, color: 'from-purple-500 to-purple-600' },
              { number: '3', title: 'Share with friends & audience', icon: Share2, color: 'from-pink-500 to-pink-600' },
              { number: '4', title: 'Earn ₦200 per Valentine page', icon: DollarSign, color: 'from-green-500 to-green-600' },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: parseInt(step.number) * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                >
                  <div className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${step.color} p-4 text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mb-2 text-sm font-semibold text-gray-500">
                    Step {step.number}
                  </div>
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <div className="absolute -right-4 -top-4 text-7xl font-bold text-gray-100 opacity-50">
                    {step.number}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission Info */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 p-8 text-center text-white shadow-xl md:p-12">
          <h2 className="mb-6 text-3xl font-bold">Commission Details</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold">₦200</div>
              <p className="text-pink-100">Per paid Valentine page</p>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">∞</div>
              <p className="text-pink-100">No earning limits</p>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">📧</div>
              <p className="text-pink-100">Manual payout on request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Partner Registration</h2>
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-red-500 py-3 font-bold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : 'Create Partner Account'}
              </button>
              
              <p className="text-xs text-gray-600 text-center">
                By signing up, you agree to our{' '}
                <a
                  href="/Valink_Partner_Terms_and_Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 underline hover:text-pink-700"
                >
                  Partner Terms and Conditions
                </a>
              </p>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already a partner?{' '}
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setShowLoginModal(true);
                }}
                className="font-medium text-pink-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </motion.div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Partner Login</h2>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-red-500 py-3 font-bold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            {/* <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterForm(true);
                }}
                className="font-medium text-pink-600 hover:underline"
              >
                Register here
              </button>
            </p> */}
          </motion.div>
        </div>
      )}
    </div>
  );
}
