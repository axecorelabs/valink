'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MinimalTemplate({ fromName, toName, message, pageId, creatorEmail, isPreview = false }) {
  const [answered, setAnswered] = useState(false);
  const [response, setResponse] = useState(null);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="mb-8 text-6xl"
            >
              🤍
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12 text-4xl font-light tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
            >
              {toName},
              <br />
              <span className="font-normal">will you be my Valentine?</span>
            </motion.h1>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mb-12 border-l-2 border-gray-300 pl-6 text-left"
              >
                <p className="text-xl italic text-gray-700 md:text-2xl">
                  {message}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mb-12 text-right"
            >
              <p className="text-xl text-gray-600">
                — {fromName} ❤️
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <button
                onClick={() => handleResponse('yes')}
                className="rounded-md border-2 border-gray-900 bg-gray-900 px-12 py-4 text-lg font-medium text-white transition-all hover:bg-gray-800 hover:border-gray-800"
              >
                Yes
              </button>

              <button
                onClick={() => handleResponse('no')}
                className="rounded-md border-2 border-gray-300 bg-white px-12 py-4 text-lg font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                No
              </button>
            </motion.div>

            {!isPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 1 }}
                className="mt-16 border-t border-gray-200 pt-8"
              >
                <a
                  href="/"
                  className="inline-block text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Create your own Valentine page 💘
                </a>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center"
          >
            <div className="mb-8 text-6xl">
              {response === 'yes' ? '🤍' : '💔'}
            </div>

            <h2 className="mb-6 text-4xl font-light tracking-tight text-gray-900 md:text-5xl">
              {response === 'yes' ? 'Thank you' : 'Understood'}
            </h2>

            <p className="mb-8 text-xl text-gray-600">
              {response === 'yes'
                ? `${fromName} will be notified of your response.`
                : `${fromName} appreciates your honesty.`}
            </p>

            {message && (
              <div className="mb-8 border-l-2 border-gray-300 pl-6 text-left">
                <p className="text-lg italic text-gray-700">
                  {message}
                </p>
              </div>
            )}

            {!isPreview && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <a
                  href="/"
                  className="inline-block text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Create your own Valentine page 💘
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
