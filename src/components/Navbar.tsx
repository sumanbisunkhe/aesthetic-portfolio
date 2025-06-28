import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signOutUser } from '../lib/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { HiOutlineUser } from 'react-icons/hi';
import {
  HomeIcon,
  UserCircleIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ClockIcon,
  XMarkIcon,
  LightBulbIcon,
  DocumentTextIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  dropdown?: { name: string; href: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }[];
}

interface NavbarProps {
  onOpenAuthModal: () => void;
}

const Navbar = ({ onOpenAuthModal }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [avatarError, setAvatarError] = useState(false);

  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        console.log('User logged in:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          }
        });
      } else {
        console.log('User logged out');
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to get the correct href based on current location
  const getCorrectHref = (href: string) => {
    if (href.startsWith('/')) return href; // Keep route links as is
    if (location.pathname !== '/') {
      return `/#${href.substring(1)}`; // Add /# for hash links when not on main page
    }
    return href; // Keep hash links as is for main page
  };

  // Function to handle navigation clicks
  const handleNavigationClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      if (location.pathname !== '/') {
        // If not on main page, navigate to main page with hash
        navigate('/', { state: { scrollTo: targetId } });
      } else {
        // If on main page, just scroll to the section
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          // Update active section immediately
          setActiveSection(targetId);
        }
      }
    } else if (href.startsWith('/')) {
      // For route links, update active section based on the route
      const routeName = href.substring(1);
      setActiveSection(routeName);
      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  const navigation: NavItem[] = [
    { name: 'Home', href: '#home', icon: HomeIcon },
    { name: 'Work', href: '#work', icon: BriefcaseIcon },
    { name: 'About', href: '#about', icon: UserCircleIcon },
    {
      name: 'Resources',
      icon: BookOpenIcon,
      dropdown: [
        { name: 'Experience', href: '#resources-experience', icon: BriefcaseIcon },
        { name: 'Resume', href: '#resources-resume', icon: DocumentTextIcon },
      ],
    },
    { name: 'Now', href: '#now', icon: ClockIcon },
    { name: 'Thoughts', href: '/thoughts', icon: LightBulbIcon },
  ];

  // Update active section based on current route
  useEffect(() => {
    if (location.pathname === '/thoughts') {
      setActiveSection('thoughts');
    } else if (location.pathname.startsWith('/thoughts/')) {
      setActiveSection('thoughts');
    } else if (location.pathname === '/') {
      // Only run scroll spy on main page
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
        const scrollPosition = window.scrollY + 100;

        // Check if we're at the top of the page (home section)
        if (scrollPosition < 100) {
          setActiveSection('home');
          return;
        }

        // Check if we're in resources section (either experience or resume)
        const resourcesSection = document.getElementById('resources');
        const experienceSection = document.getElementById('resources-experience');
        const resumeSection = document.getElementById('resources-resume');
        const contactSection = document.getElementById('contact');

        if (contactSection && scrollPosition >= contactSection.offsetTop - 100) {
          setActiveSection('contact');
          return;
        }

        if (resourcesSection) {
          const { offsetTop, offsetHeight } = resourcesSection;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            // Check if we're specifically in experience or resume sections
            if (experienceSection) {
              const expTop = experienceSection.offsetTop;
              const expHeight = experienceSection.offsetHeight;
              if (scrollPosition >= expTop && scrollPosition < expTop + expHeight) {
                setActiveSection('resources-experience');
                return;
              }
            }
            if (resumeSection) {
              const resumeTop = resumeSection.offsetTop;
              const resumeHeight = resumeSection.offsetHeight;
              if (scrollPosition >= resumeTop && scrollPosition < resumeTop + resumeHeight) {
                setActiveSection('resources-resume');
                return;
              }
            }
            // If we're in the resources section but not specifically in experience or resume
            setActiveSection('resources');
            return;
          }
        }

        // Check other sections
        const sections = navigation.flatMap(item => 
          item.dropdown ? item.dropdown.map(subItem => subItem.href.substring(1)) : (item.href ? [item.href.substring(1)] : [])
        );

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
    }
  }, [location.pathname]);

  // Add effect to handle scroll after navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSigningOut(false);
    }
  };

  // Function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to get fallback avatar SVG
  const getFallbackAvatar = (name: string) => {
    const initials = getUserInitials(name);
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4B5563;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad)"/>
        <text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
      </svg>
    `)}`;
  };

  // Effect to handle avatar loading
  useEffect(() => {
    if (currentUser?.photoURL) {
      const img = new Image();
      img.src = currentUser.photoURL;
      img.onload = () => setAvatarError(false);
      img.onerror = () => setAvatarError(true);
    }
  }, [currentUser?.photoURL]);

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
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== '/') {
                  navigate('/', { state: { scrollTo: 'home' } });
                } else {
                  const homeElement = document.getElementById('home');
                  if (homeElement) {
                    homeElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
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
            <div className="hidden xl:flex items-center space-x-1">
              <nav className="flex items-center space-x-1" role="menubar">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.dropdown) {
                    return (
                      <div
                        key={item.name}
                        className="relative group"
                        onMouseEnter={() => setResourcesDropdownOpen(true)}
                        onMouseLeave={() => setResourcesDropdownOpen(false)}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative inline-flex items-center px-3 py-2 text-sm font-medium font-caesar tracking-wider rounded-lg group"
                          aria-expanded={resourcesDropdownOpen}
                          aria-haspopup="true"
                        >
                          <span className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 font-caesar tracking-wider ${
                            resourcesDropdownOpen || 
                            activeSection === 'resources' || 
                            activeSection === 'resources-experience' || 
                            activeSection === 'resources-resume' 
                              ? 'text-accent-900' 
                              : 'text-primary-50 hover:text-accent-200'
                          }`}>
                            <Icon className="w-4 h-4" aria-hidden="true" />
                            <span>{item.name}</span>
                            {/* Dropdown Arrow */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transform transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : 'rotate-0'}`} aria-hidden="true">
                              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                          </span>
                          {(resourcesDropdownOpen || 
                            activeSection === 'resources' || 
                            activeSection === 'resources-experience' || 
                            activeSection === 'resources-resume') && (
                            <motion.div
                              layoutId="nav-pill"
                              className="absolute inset-0 bg-royal-900/20 rounded-lg -z-10"
                              transition={{ type: "spring", duration: 0.5 }}
                            />
                          )}
                        </motion.button>
                        <AnimatePresence>
                          {resourcesDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 mt-2 w-48 rounded-lg shadow-xl bg-black backdrop-blur-md ring-1 ring-primary-700/50 z-50 origin-top"
                            >
                              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="resources-menu-button">
                                {item.dropdown.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isActive = activeSection === subItem.href.substring(1);
                  return (
                                    <a
                                      key={subItem.name}
                                      href={subItem.href}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigationClick(e, subItem.href);
                                        setResourcesDropdownOpen(false);
                                      }}
                                      className={`flex items-center px-4 py-2 text-sm font-caesar tracking-wider ${
                                        isActive 
                                          ? 'bg-primary-700/50 text-accent-900' 
                                          : 'text-primary-50 hover:bg-primary-700/50 hover:text-accent-900'
                                      } transition-colors duration-200`}
                                      role="menuitem"
                                    >
                                      {SubIcon && <SubIcon className="w-4 h-4 mr-2" aria-hidden="true" />}
                                      <span className="font-caesar tracking-wider text-base">{subItem.name}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Default navigation item rendering
                  return item.href?.startsWith('/') ? (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-caesar tracking-wider rounded-lg group"
                    >
                      <Link
                        to={item.href}
                        className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 font-caesar tracking-wider ${
                          activeSection === item.name.toLowerCase()
                            ? 'text-accent-900'
                            : 'text-primary-50 hover:text-accent-200'
                        }`}
                        role="menuitem"
                        aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                      {activeSection === item.name.toLowerCase() && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg -z-10"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.a
                      key={item.name}
                      href={getCorrectHref(item.href || '')}
                      onClick={(e) => handleNavigationClick(e, item.href || '')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-caesar tracking-wider rounded-lg group"
                      role="menuitem"
                      aria-current={activeSection === item.name.toLowerCase() ? 'page' : undefined}
                    >
                      <span className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 font-caesar tracking-wider ${
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
                          className="absolute inset-0 rounded-lg -z-10"
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
                  <FaGithub className="w-5 h-5" />
                </a>
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    handleNavigationClick(e, '#contact');
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 ${
                    activeSection === 'contact'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900'
                  } text-sm font-caesar tracking-wider rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 flex items-center gap-1.5`}
                  aria-label="Open contact section"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Let's Talk
                </motion.a>
              </div>

              {/* Authentication */}
              <div className="flex items-center pl-4 border-l border-primary-700/50">
                {currentUser ? (
                  <div className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="relative">
                        {/* Avatar Container with Gradient Border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                        
                        {/* Avatar Image */}
                      <img
                          src={avatarError ? getFallbackAvatar(currentUser?.displayName || 'User') : currentUser?.photoURL || ''}
                          alt={currentUser?.displayName || ''}
                          className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-accent-900/20 group-hover:ring-accent-900/40 transition-all duration-300 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            setAvatarError(true);
                          }}
                          loading="eager"
                          crossOrigin="anonymous"
                      />
                        
                        {/* Hover Effects */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900/20 to-accent-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900/10 to-accent-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        
                        {/* Active Indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-primary-900 group-hover:ring-accent-900/40 transition-all duration-300">
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        </div>
                      </div>
                    </motion.button>

                    {/* User Menu Dropdown */}
                    <div className="absolute right-0 mt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <div className="bg-gradient-to-b from-primary-800 to-primary-900 rounded-2xl shadow-2xl border border-primary-700/50 overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700" />
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent-900/50 rounded-tl-2xl" />
                        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-accent-900/50 rounded-br-2xl" />

                        {/* User Info Section */}
                        <div className="p-4 border-b border-primary-700/50">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {/* Avatar Container with Gradient Border */}
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                              
                              <img
                                src={avatarError ? getFallbackAvatar(currentUser?.displayName || 'User') : currentUser?.photoURL || ''}
                                alt={currentUser?.displayName || ''}
                                className="relative w-12 h-12 rounded-xl ring-2 ring-accent-900/20 object-cover"
                              />
                              
                              {/* Active Indicator */}
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-primary-900">
                                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary-200 truncate">
                                {currentUser.displayName}
                              </p>
                              <p className="text-xs text-primary-400 truncate">
                                {currentUser.email}
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenAuthModal}
                    className="relative p-2 rounded-lg bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 group"
                    aria-label="Sign in"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-900/20 to-accent-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Mobile menu button and auth */}
            <div className="xl:hidden flex items-center gap-2">
            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-primary-800/50 text-accent-900 hover:bg-primary-700/50"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-primary-900/95 backdrop-blur-xl z-50 xl:hidden shadow-2xl"
            >
              <div className="h-full flex flex-col">
                {/* Header with Logo and Close button */}
                <div className="flex items-center justify-between p-3 border-b border-primary-700/50">
                  <span className="logo-text text-lg">
                    <span className="bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent">
                      SUMAN BISUNKHE
                    </span>
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-primary-800/50 text-accent-900 hover:bg-primary-700/50"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* User Profile Section */}
                {currentUser ? (
                  <div className="p-4 border-b border-primary-700/50 bg-gradient-to-b from-primary-800/50 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {/* Avatar Container with Gradient Border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                        
                        <img
                          src={avatarError ? getFallbackAvatar(currentUser?.displayName || 'User') : currentUser?.photoURL || ''}
                          alt={currentUser?.displayName || ''}
                          className="relative w-12 h-12 rounded-xl ring-2 ring-accent-900/20 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            setAvatarError(true);
                          }}
                        />
                        
                        {/* Active Indicator */}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-primary-900">
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-primary-200 truncate">
                          {currentUser.displayName}
                        </p>
                        <p className="text-xs text-primary-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="p-1.5 rounded-lg bg-primary-800/50 text-primary-200 hover:bg-primary-700/50 hover:text-accent-900 transition-colors duration-200"
                        aria-label="Sign out"
                      >
                        {isSigningOut ? (
                          <div className="w-4 h-4 border-2 border-primary-200 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg 
                            className="w-4 h-4" 
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
                        )}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-primary-700/50 bg-gradient-to-b from-primary-800/50 to-transparent">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onOpenAuthModal();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 font-medium rounded-xl shadow-lg shadow-accent-900/10 hover:shadow-accent-900/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <HiOutlineUser className="w-4 h-4" />
                      <span>Sign In</span>
                    </motion.button>
                  </div>
                )}

                {/* Navigation items */}
                <nav className="flex-1 py-3 px-3">
                  <div className="grid gap-2">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      
                      if (item.dropdown) {
                         return (
                           <div key={item.name} className="space-y-2">
                             <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-accent-900">
                               <Icon className="w-4 h-4" />
                               <span className="font-caesar tracking-wider text-base">{item.name}</span>
                             </div>
                             <div className="pl-6 space-y-2 border-l border-primary-700/50">
                                {item.dropdown.map((subItem) => {
                                   const SubIcon = subItem.icon;
                                   return (
                                     <motion.a
                                        key={subItem.name}
                                        href={subItem.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl font-caesar tracking-wider transition-all duration-200 ${activeSection === subItem.href.substring(1) ? 'bg-primary-800/70 text-accent-900' : 'text-primary-50 hover:bg-primary-800/40 hover:text-accent-200'}`}
                                        onClick={(e) => {
                                           e.preventDefault();
                                           handleNavigationClick(e, subItem.href);
                                           setMobileMenuOpen(false);
                                           setResourcesDropdownOpen(false);
                                        }}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                     >
                                       {SubIcon && <SubIcon className="w-4 h-4" />}
                                       <span className="font-caesar tracking-wider text-base">{subItem.name}</span>
                                     </motion.a>
                                   );
                                })}
                             </div>
                           </div>
                         );
                      }

                      return item.href?.startsWith('/') ? (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link
                            to={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-caesar tracking-wider transition-all duration-200 ${
                              activeSection === item.name.toLowerCase() ? 'text-accent-900' : 'text-primary-50 hover:bg-primary-800/40 hover:text-accent-200'
                            }`}
                            onClick={() => {
                              setActiveSection(item.name.toLowerCase());
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="font-caesar tracking-wider text-base">{item.name}</span>
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.a
                          key={item.name}
                          href={getCorrectHref(item.href || '')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-caesar tracking-wider transition-all duration-200 ${
                            activeSection === item.name.toLowerCase() ? 'text-accent-900' : 'text-primary-50 hover:bg-primary-800/40 hover:text-accent-200'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigationClick(e, item.href || '');
                            setMobileMenuOpen(false);
                          }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-caesar tracking-wider text-base">{item.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </nav>

                {/* Bottom section with social links and contact */}
                <div className="p-4 border-t border-primary-700/50">
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href="https://github.com/sumanbisunkhe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-primary-800/50 text-primary-50 hover:bg-primary-700/50 hover:text-accent-900 transition-all duration-200"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                    <motion.a
                      href="#contact"
                      onClick={(e) => {
                        handleNavigationClick(e, '#contact');
                        setMobileMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 px-4 py-2 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 font-caesar tracking-wider rounded-xl shadow-lg shadow-accent-900/10 hover:shadow-accent-900/20 transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
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