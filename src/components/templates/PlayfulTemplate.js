'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function PlayfulTemplate({ fromName, toName, message, pageId, creatorEmail, isPreview = false }) {
  const [answered, setAnswered] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Generate floating hearts and roses
  useEffect(() => {
    const emojis = ['💕', '🌹', '💖', '🌺', '💗', '🌷', '💝', '🌸'];
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
      size: 20 + Math.random() * 30,
    }));
    setFloatingEmojis(generated);
  }, []);

  const handleYesClick = () => {
    setAnswered(true);

    // Send notification email to creator
    if (!isPreview && pageId) {
      fetch('/api/email/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, response: 'yes' }),
      }).catch(err => console.error('Notification error:', err));
    }
    
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff1493', '#ff69b4'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff1493', '#ff69b4'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNoHover = () => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    setNoButtonPosition({ x: randomX, y: randomY });
    setNoButtonAttempts((prev) => prev + 1);
  };

  const noButtonTexts = [
    'NO 😢',
    'Wait... 🥺',
    'Think again? 💭',
    'Please? 🙏',
    'One more time? 💔',
    "Don't do this! 😭",
  ];

  const currentNoText = noButtonTexts[Math.min(noButtonAttempts, noButtonTexts.length - 1)];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4">
      {/* Floating Hearts and Roses Background */}
      <div className="pointer-events-none absolute inset-0">
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            className="absolute opacity-30"
            style={{
              left: `${item.left}%`,
              fontSize: `${item.size}px`,
            }}
            initial={{ y: '100vh', rotate: 0 }}
            animate={{
              y: '-100vh',
              rotate: 360,
              x: [0, 30, -30, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl text-center">
        {!answered ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="mb-4 text-4xl font-bold text-gray-900 md:text-6xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Will you be my Valentine, {toName}? 💘
            </motion.h1>

            {message && (
              <p className="mb-8 text-lg text-gray-700 md:text-xl">
                {message}
              </p>
            )}

            <p className="mb-8 text-sm text-gray-600 md:text-base">
              From: {fromName} 💕
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                onClick={handleYesClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:shadow-xl"
              >
                YES 💖
              </motion.button>

              <motion.button
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                animate={noButtonPosition}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="rounded-full border-2 border-gray-400 bg-white px-12 py-4 text-xl font-bold text-gray-700 shadow-lg"
              >
                {currentNoText}
              </motion.button>
            </div>

            {noButtonAttempts > 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-lg font-medium text-pink-600"
              >
                Come on, you know you want to say yes! 😊
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm md:p-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="mb-6 text-8xl"
            >
              🎉
            </motion.div>
            
            <h2 className="mb-4 text-4xl font-bold text-pink-600 md:text-5xl">
              Yay!!! 💕
            </h2>
            
            <p className="mb-6 text-xl text-gray-800 md:text-2xl">
              {fromName} is so happy!
            </p>

            {message && (
              <p className="text-lg text-gray-700">
                &quot;{message}&quot;
              </p>
            )}

            {!isPreview && (
              <div className="mt-8">
                <a
                  href="/"
                  className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105"
                >
                  Create your own Valentine page 💘
                </a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
