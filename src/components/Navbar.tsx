import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signOutUser } from '../lib/auth';
import {
  CodeBracketIcon,
  CommandLineIcon,
  HomeIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ClockIcon,
  XMarkIcon,
  Bars3Icon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavbarProps {
  onOpenAuthModal: () => void;
}

const navigation: NavItem[] = [
  { name: 'Home', href: '#home', icon: HomeIcon },
  { name: 'Work', href: '#work', icon: BriefcaseIcon },
  { name: 'About', href: '#about', icon: UserCircleIcon },
  { name: 'Resources', href: '#resources', icon: BookOpenIcon },
  { name: 'Now', href: '#now', icon: ClockIcon },
  { name: 'Thoughts', href: '#thoughts', icon: LightBulbIcon },
];

const Navbar = ({ onOpenAuthModal }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy functionality
      const sections = navigation.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutUser();
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-3 sm:py-4 bg-primary-900/95 backdrop-blur-lg shadow-lg' 
            : 'py-4 sm:py-6 bg-primary-900'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative group z-10 shrink-0"
              aria-label="Go to home section"
            >
              <span className="logo-text text-base sm:text-lg md:text-xl lg:text-2xl">
                <span className="bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent">
                  SUMAN BISUNKHE
                </span>
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-accent-900 to-accent-700"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <nav className="flex items-center space-x-1" role="menubar">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg group"
                      role="menuitem"
                      aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                    >
                      <span className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 ${
                        activeSection === item.name.toLowerCase()
                          ? 'text-accent-900'
                          : 'text-primary-50 hover:text-accent-200'
                      }`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{item.name}</span>
                      </span>
                      {activeSection === item.name.toLowerCase() && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-royal-900/20 rounded-lg -z-10"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </motion.a>
                  );
                })}
              </nav>

              {/* Social Links & Contact */}
              <div className="flex items-center pl-4 space-x-3 border-l border-primary-700/50">
                <a
                  href="https://github.com/sumanbisunkhe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary-800/50 text-primary-50 hover:bg-primary-700/50 hover:text-accent-900 transition-colors duration-200"
                  aria-label="Visit my GitHub profile"
                >
                  <CodeBracketIcon className="w-5 h-5" aria-hidden="true" />
                </a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-shadow duration-200 flex items-center gap-1.5"
                  aria-label="Open contact section"
                >
                  <CommandLineIcon className="w-4 h-4" aria-hidden="true" />
                  Let's Talk
                </motion.a>
              </div>

              {/* Authentication */}
              <div className="flex items-center pl-4 border-l border-primary-700/50">
                {auth.currentUser ? (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <img
                        src={auth.currentUser.photoURL || ''}
                        alt={auth.currentUser.displayName || ''}
                        className="w-8 h-8 rounded-full ring-2 ring-accent-900/20 group-hover:ring-accent-900/40 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900/20 to-accent-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>

                    {/* User Menu Dropdown */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute right-0 mt-3 w-64 bg-gradient-to-b from-primary-800 to-primary-900 rounded-2xl shadow-2xl border border-primary-700/50 overflow-hidden z-50"
                          >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700" />
                            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent-900/50 rounded-tl-2xl" />
                            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-accent-900/50 rounded-br-2xl" />

                            {/* User Info Section */}
                            <div className="p-4 border-b border-primary-700/50">
                              <div className="flex items-center gap-3">
                                <img
                                  src={auth.currentUser.photoURL || ''}
                                  alt={auth.currentUser.displayName || ''}
                                  className="w-12 h-12 rounded-xl ring-2 ring-accent-900/20"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-primary-200 truncate">
                                    {auth.currentUser.displayName}
                                  </p>
                                  <p className="text-xs text-primary-400 truncate">
                                    {auth.currentUser.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="w-full px-4 py-3 text-left text-sm text-primary-200 hover:bg-primary-700/50 hover:text-accent-900 rounded-xl transition-colors duration-200 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSigningOut ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-primary-200 border-t-transparent rounded-full animate-spin" />
                                    <span>Signing out...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg 
                                      className="w-5 h-5 text-primary-400 group-hover:text-accent-900 transition-colors duration-200" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                      />
                                    </svg>
                                    <span>Sign Out</span>
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenAuthModal}
                    className="relative p-2 rounded-lg bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 group"
                    aria-label="Sign in"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-900/20 to-accent-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-lg bg-primary-800/50 text-accent-900 hover:bg-primary-700/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-primary-900/95 backdrop-blur-xl z-50 lg:hidden shadow-2xl"
            >
              <div className="h-full flex flex-col">
                {/* Header with Logo and Close button */}
                <div className="flex items-center justify-between p-4 border-b border-primary-700/50">
                  <span className="logo-text text-xl">
                    <span className="bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent">
                      SUMAN BISUNKHE
                    </span>
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-primary-800/50 text-accent-900 hover:bg-primary-700/50"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="grid gap-3">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            activeSection === item.name.toLowerCase()
                              ? 'bg-primary-800/70 text-accent-900'
                              : 'text-primary-50 hover:bg-primary-800/40 hover:text-accent-200'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium text-lg">{item.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </nav>

                {/* Bottom section with social links and contact */}
                <div className="p-6 border-t border-primary-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <a
                      href="https://github.com/sumanbisunkhe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-primary-800/50 text-primary-50 hover:bg-primary-700/50 hover:text-accent-900 transition-all duration-200"
                    >
                      <CodeBracketIcon className="w-6 h-6" />
                    </a>
                    <motion.a
                      href="#contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 font-medium rounded-xl shadow-lg shadow-accent-900/10 hover:shadow-accent-900/20 transition-all duration-200 flex items-center gap-2 w-2/3 justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <CommandLineIcon className="w-5 h-5" />
                      Let's Talk
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 