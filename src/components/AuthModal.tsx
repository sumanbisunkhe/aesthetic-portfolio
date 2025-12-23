import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { signInWithGoogle, getAuthErrorMessage } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isClosingRef = useRef(false);

  // Reset cancellation ref when modal opens
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
    }
  }, [isOpen]);

  // Clear error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        if (!isClosingRef.current) setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = () => {
    isClosingRef.current = true;
    setLoading(false);
    setError('');
    onClose();
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      if (!isClosingRef.current) {
        onClose();
      }
    } catch (error: any) {
      if (!isClosingRef.current) {
        setError(getAuthErrorMessage(error));
      }
    } finally {
      if (!isClosingRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[380px]"
          >
            {/* Main Container */}
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">

              {/* Decorative Background Glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-500/10 blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-900/10 blur-[40px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-all duration-300 z-10"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 p-0.5 mb-6 shadow-xl shadow-accent-500/20"
                >
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center">
                    <span className="text-accent-400 font-bold text-2xl font-fascinate">S</span>
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10 group-hover:border-white/20" />

                  <div className="relative flex items-center justify-center gap-3 py-4 px-6">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span className="text-white font-semibold">Continue with Google</span>
                      </>
                    )}
                  </div>
                </motion.button>

                <p className="text-gray-500 text-[10px] text-center px-4 leading-relaxed">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
