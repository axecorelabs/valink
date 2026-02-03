'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fromName: '',
    toName: '',
    email: '',
    message: '',
    templateId: null,
    partnerCode: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasPartnerRef, setHasPartnerRef] = useState(false);

  // Capture partner code from URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData((prev) => ({ ...prev, partnerCode: refCode }));
      setHasPartnerRef(true);
    }
  }, [searchParams]);

  const templates = [
    {
      id: 1,
      name: 'Playful / Funny',
      description: 'The "No" button runs away! 😄',
      emoji: '🎮',
      preview: 'Interactive buttons with a cheeky twist',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 2,
      name: 'Romantic / Soft',
      description: 'Floating hearts and soft animations 💕',
      emoji: '💖',
      preview: 'Dreamy pastel colors and gentle vibes',
      gradient: 'from-pink-400 to-rose-500',
    },
    {
      id: 3,
      name: 'Minimal / Elegant',
      description: 'Clean, simple, and timeless ✨',
      emoji: '🤍',
      preview: 'Pure text with elegant typography',
      gradient: 'from-gray-700 to-gray-900',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setFormData((prev) => ({ ...prev, templateId }));
    if (errors.templateId) {
      setErrors((prev) => ({ ...prev, templateId: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fromName.trim()) {
      newErrors.fromName = 'Your name is required';
    } else if (formData.fromName.length > 30) {
      newErrors.fromName = 'Name must be 30 characters or less';
    }

    if (!formData.toName.trim()) {
      newErrors.toName = "Your Valentine's name is required";
    } else if (formData.toName.length > 30) {
      newErrors.toName = 'Name must be 30 characters or less';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required to receive your link';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.message && formData.message.length > 120) {
      newErrors.message = 'Message must be 120 characters or less';
    }

    if (!formData.templateId) {
      newErrors.templateId = 'Please select a template';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Store form data in session storage for preview page
      sessionStorage.setItem('valentineFormData', JSON.stringify(formData));
      router.push('/preview');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-pink-100 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-pink-600 md:text-5xl">
            Create Your Valentine Page 💘
          </h1>
          <p className="text-gray-700">Fill in the details below to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Names */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Step 1: Tell us the names</h2>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="fromName" className="mb-2 block text-sm font-medium text-gray-700">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fromName"
                  name="fromName"
                  value={formData.fromName}
                  onChange={handleInputChange}
                  placeholder="Daniel"
                  maxLength={30}
                  className={`w-full rounded-lg border ${
                    errors.fromName ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                />
                {errors.fromName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fromName}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.fromName.length}/30 characters
                </p>
              </div>

              <div>
                <label htmlFor="toName" className="mb-2 block text-sm font-medium text-gray-700">
                  Your Valentine&apos;s name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="toName"
                  name="toName"
                  value={formData.toName}
                  onChange={handleInputChange}
                  placeholder="Sarah"
                  maxLength={30}
                  className={`w-full rounded-lg border ${
                    errors.toName ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                />
                {errors.toName && (
                  <p className="mt-1 text-sm text-red-500">{errors.toName}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.toName.length}/30 characters
                </p>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Your email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  We&apos;ll send your Valentine page link here 📧
                </p>
              </div>

              {!hasPartnerRef && (
                <div>
                  <label htmlFor="partnerCode" className="mb-2 block text-sm font-medium text-gray-700">
                    Partner Code (optional)
                  </label>
                  <input
                    type="text"
                    id="partnerCode"
                    name="partnerCode"
                    value={formData.partnerCode}
                    onChange={handleInputChange}
                    placeholder="Enter partner code if any"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Have a partner code? Enter it to support your referrer
                  </p>
                </div>
              )}

              {/* {hasPartnerRef && (
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-900">
                        Partner code applied: <span className="font-mono">{formData.partnerCode}</span>
                      </p>
                      <p className="text-xs text-green-700">
                        Your referrer will earn ₦200 when you complete payment
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Step 2: Template Selection */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Step 2: Choose a template <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-pink-500 bg-pink-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  <div className="mb-3 text-5xl">{template.emoji}</div>
                  <h3 className="mb-2 font-bold text-gray-900">{template.name}</h3>
                  <p className="mb-2 text-sm text-gray-600">{template.description}</p>
                  <p className="text-xs text-gray-500">{template.preview}</p>
                  
                  {selectedTemplate === template.id && (
                    <div className="mt-3 flex items-center text-sm font-medium text-pink-600">
                      <svg className="mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {errors.templateId && (
              <p className="mt-3 text-sm text-red-500">{errors.templateId}</p>
            )}
          </div>

          {/* Step 3: Custom Message */}
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Step 3: Add a message (optional)
            </h2>
            
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                Custom message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="You make my world brighter ❤️"
                maxLength={120}
                rows={3}
                className={`w-full rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.message.length}/120 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Preview My Page 👀
            </button>
            
            <p className="mt-4 text-xs text-gray-600">
              By creating a Valentine page, you agree to our{' '}
              <a
                href="/Valink_Legal_Documents.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 underline hover:text-pink-700"
              >
                Terms and Conditions
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-pink-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">💘</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
