'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RomanticTemplate({ fromName, toName, message, pageId, creatorEmail, isPreview = false }) {
  const [answered, setAnswered] = useState(false);
  const [response, setResponse] = useState(null);
  const [hearts, setHearts] = useState([]);

  // Generate hearts on client side only to avoid hydration mismatch
  useEffect(() => {
    setHearts(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
      }))
    );
  }, []);

  const handleResponse = (value) => {
    setResponse(value);
    setAnswered(true);

    // Send notification email to creator
    if (!isPreview && pageId) {
      fetch('/api/email/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, response: value }),
      }).catch(err => console.error('Notification error:', err));
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300 p-4">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-4xl opacity-30"
            style={{ left: heart.left, bottom: '-10%' }}
            animate={{
              y: [0, -1000],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl bg-white/60 p-8 shadow-xl backdrop-blur-md md:p-12"
            >
              <motion.div
                className="mb-6 text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💖
              </motion.div>

              <h1 className="mb-6 text-3xl font-bold text-rose-900 md:text-5xl">
                {toName},
              </h1>

              <p className="mb-8 text-xl font-medium text-rose-800 md:text-2xl">
                Will you be my Valentine?
              </p>

              {message && (
                <div className="mb-8 rounded-2xl bg-white/50 p-6">
                  <p className="text-lg italic text-rose-700">
                    &quot;{message}&quot;
                  </p>
                </div>
              )}

              <p className="mb-8 text-base text-rose-600">
                With love, {fromName} 💕
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <motion.button
                  onClick={() => handleResponse('yes')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Yes, of course 💕
                </motion.button>

                <motion.button
                  onClick={() => handleResponse('maybe')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border-2 border-rose-300 bg-white/70 px-10 py-4 text-lg font-bold text-rose-700 shadow-lg transition-all hover:bg-white/90"
                >
                  I need time 😅
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-white/70 p-8 shadow-2xl backdrop-blur-md md:p-12"
            >
              {response === 'yes' ? (
                <>
                  <motion.div
                    className="mb-6"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: 2,
                    }}
                  >
                    <span className="text-8xl">💗</span>
                  </motion.div>

                  <h2 className="mb-4 text-4xl font-bold text-rose-600 md:text-5xl">
                    Thank you! 💕
                  </h2>

                  <p className="mb-6 text-xl text-rose-800">
                    {fromName}&apos;s heart is full of joy!
                  </p>

                  {message && (
                    <div className="mb-6 rounded-2xl bg-rose-50 p-6">
                      <p className="text-lg italic text-rose-700">
                        &quot;{message}&quot;
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6 text-6xl">🥺</div>
                  <h2 className="mb-4 text-3xl font-bold text-rose-600">
                    That&apos;s okay...
                  </h2>
                  <p className="text-lg text-rose-700">
                    {fromName} will be waiting with hope 💕
                  </p>
                </>
              )}

              {!isPreview && (
                <div className="mt-8">
                  <a
                    href="/"
                    className="inline-block rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105"
                  >
                    Create your own Valentine page 💘
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
