import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
  setupRecaptcha,
  getAuthErrorMessage
} from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'phone';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Clear error after 2 seconds with smooth fade out
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!verificationId) {
        const recaptchaVerifier = setupRecaptcha('recaptcha-container');
        const confirmationResult = await signInWithPhone(phoneNumber, recaptchaVerifier);
        setVerificationId(confirmationResult.verificationId);
      } else {
        // Verify code
        // Implementation depends on your Firebase setup
      }
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setError('');
    setLoading(true);

    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
      onClose();
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-[90vw] max-w-md mx-auto"
          >
            <div className="relative bg-gradient-to-b from-primary-800 to-primary-900 rounded-2xl shadow-2xl p-8 border border-primary-700/50">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 rounded-t-2xl" />
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent-900/50 rounded-tl-2xl" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-accent-900/50 rounded-br-2xl" />

              {/* Header */}
              <motion.div 
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 className="text-2xl font-oldenburg text-white mb-1">
                    {mode === 'signup' ? 'Create Account' : mode === 'phone' ? 'Phone Sign In' : 'Welcome Back'}
                  </h2>
                  <p className="text-primary-300 text-sm">
                    {mode === 'signup' ? 'Join our community' : mode === 'phone' ? 'Sign in with your phone' : 'Sign in to continue'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-primary-700/50 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-primary-200" />
                </motion.button>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      height: 'auto',
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -10, 
                      height: 0,
                      transition: {
                        duration: 0.2,
                        ease: "easeInOut"
                      }
                    }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-2 h-2 rounded-full bg-red-400"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-full h-full rounded-full bg-red-400"
                        />
                      </motion.div>
                      <motion.span
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                      >
                        {error}
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auth Modes */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === 'phone' ? (
                    <form onSubmit={handlePhoneAuth} className="space-y-4">
                      {!verificationId ? (
                        <>
                          <div className="relative group">
                            <label className="block text-sm font-medium text-primary-200 mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-accent-900 transition-colors" />
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-primary-900/50 border border-primary-700/50 rounded-xl text-white focus:outline-none focus:border-accent-900/50 focus:ring-2 focus:ring-accent-900/20 transition-all duration-200"
                                placeholder="+1234567890"
                                required
                              />
                            </div>
                          </div>
                          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                        </>
                      ) : (
                        <div className="relative group">
                          <label className="block text-sm font-medium text-primary-200 mb-2">
                            Verification Code
                          </label>
                          <div className="relative">
                            <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-accent-900 transition-colors" />
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-primary-900/50 border border-primary-700/50 rounded-xl text-white focus:outline-none focus:border-accent-900/50 focus:ring-2 focus:ring-accent-900/20 transition-all duration-200"
                              placeholder="Enter code"
                              required
                            />
                          </div>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 rounded-xl hover:shadow-lg hover:shadow-accent-900/20 transition-all duration-200 disabled:opacity-50 font-medium relative"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </div>
                        ) : (
                          verificationId ? 'Verify Code' : 'Send Code'
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <div className="relative group">
                        <label className="block text-sm font-medium text-primary-200 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-accent-900 transition-colors" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-primary-900/50 border border-primary-700/50 rounded-xl text-white focus:outline-none focus:border-accent-900/50 focus:ring-2 focus:ring-accent-900/20 transition-all duration-200"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="block text-sm font-medium text-primary-200 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-accent-900 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 bg-primary-900/50 border border-primary-700/50 rounded-xl text-white focus:outline-none focus:border-accent-900/50 focus:ring-2 focus:ring-accent-900/20 transition-all duration-200"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-accent-900 transition-colors"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 rounded-xl hover:shadow-lg hover:shadow-accent-900/20 transition-all duration-200 disabled:opacity-50 font-medium relative"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </div>
                        ) : (
                          mode === 'signup' ? 'Create Account' : 'Sign In'
                        )}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Social Auth Buttons */}
              <div className="mt-8 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-primary-800 text-primary-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialAuth('google')}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10"
                  >
                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                    Google
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#1864D9] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-lg shadow-[#1877F2]/20 hover:shadow-xl hover:shadow-[#1877F2]/30"
                  >
                    <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
                    Facebook
                  </motion.button>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="mt-8 text-center space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-accent-900 hover:text-accent-800 text-sm font-medium"
                >
                  {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode(mode === 'phone' ? 'signin' : 'phone')}
                  className="text-accent-900 hover:text-accent-800 text-sm font-medium block w-full"
                >
                  {mode === 'phone' ? 'Use email instead' : 'Sign in with phone number'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 