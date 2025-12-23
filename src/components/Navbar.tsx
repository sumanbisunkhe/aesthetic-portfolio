import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signOutUser } from '../lib/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

import {
    HomeIcon,
    UserCircleIcon,
    BriefcaseIcon,
    ClockIcon,
    XMarkIcon,
    NewspaperIcon,
    DocumentTextIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';

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

    const [activeSection, setActiveSection] = useState('home');
    const [isSigningOut, setIsSigningOut] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [avatarError, setAvatarError] = useState(false);

    // Effect to listen for authentication state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    // Function to get the correct href based on current location
    const getCorrectHref = (href: string) => {
        if (href.startsWith('/')) return href;
        if (location.pathname !== '/') {
            return `/#${href.substring(1)}`;
        }
        return href;
    };

    // Function to handle navigation clicks
    const handleNavigationClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: targetId } });
            } else {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(targetId);
                }
            }
        } else if (href.startsWith('/')) {
            const routeName = href.substring(1);
            setActiveSection(routeName);
            setMobileMenuOpen(false);
        }
    };

    const navigation: NavItem[] = [
        { name: 'Home', href: '#home', icon: HomeIcon },
        { name: 'Work', href: '#work', icon: BriefcaseIcon },
        { name: 'About', href: '#about', icon: UserCircleIcon },
        { name: 'Experience', href: '#resources-experience', icon: BriefcaseIcon },
        { name: 'Resume', href: '#resources-resume', icon: DocumentTextIcon },
        { name: 'Now', href: '#now', icon: ClockIcon },
        { name: 'Blogs', href: '/blogs', icon: NewspaperIcon },
    ];

    // Scroll spy effect
    useEffect(() => {
        if (location.pathname === '/blogs') {
            setActiveSection('blogs');
        } else if (location.pathname.startsWith('/blogs/')) {
            setActiveSection('blogs');
        } else if (location.pathname === '/') {
            const handleScroll = () => {

                // Increased offset to account for scroll-padding (80px) and section scroll-margins
                const scrollPosition = window.scrollY + 300;

                const sections = [
                    ...navigation
                        .filter(item => item.href?.startsWith('#'))
                        .map(item => item.href!.substring(1)),
                    'contact'
                ];

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
            handleScroll();
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [location.pathname]); // Removed navigation from dependencies to avoid loop, using stable sections

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOutUser();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            setIsSigningOut(false);
        }
    };

    const getFallbackAvatar = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
            >
                <nav
                    className={`bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300`}
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <div className="px-2 sm:px-4 lg:px-8 container mx-auto">
                        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">

                            {/* Left Side: Logo */}
                            <motion.a
                                href="#home"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (location.pathname !== '/') {
                                        navigate('/', { state: { scrollTo: 'home' } });
                                    } else {
                                        const homeElement = document.getElementById('home');
                                        if (homeElement) {
                                            window.scrollTo({
                                                top: 0,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }
                                }}
                                className="relative group z-10 flex items-center gap-1.5 lg:gap-2 shrink-0"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-center ">
                                    <span className="text-yellow-500 font-bold font-fascinate text-sm lg:text-lg">SUMAN</span>
                                </div>
                                <span className="logo-text text-sm lg:text-xl font-bold bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                                    BISUNKHE
                                </span>
                            </motion.a>

                            {/* Center: Desktop Navigation */}
                            <div className="hidden lg:flex items-center flex-1 justify-end pr-8">
                                <div className="flex items-center p-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-inner shadow-black/20">
                                    {navigation.filter(item => item.name !== 'Blogs').map((item) => {
                                        const sectionId = item.href?.startsWith('#') ? item.href.substring(1) : item.name.toLowerCase();
                                        const isActive = activeSection === sectionId;

                                        return item.href?.startsWith('/') ? (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none ${isActive ? 'text-black font-bold' : 'text-gray-300 hover:text-white'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-bg"
                                                        className="absolute inset-0 bg-[#FFFF00] rounded-full shadow-lg shadow-[#FFFF00]/30"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <span className="relative z-10 tracking-wide">{item.name}</span>
                                            </Link>
                                        ) : (
                                            <a
                                                key={item.name}
                                                href={getCorrectHref(item.href || '')}
                                                onClick={(e) => handleNavigationClick(e, item.href || '')}
                                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none ${isActive ? 'text-black font-bold' : 'text-gray-300 hover:text-white'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-bg"
                                                        className="absolute inset-0 bg-[#FFFF00] rounded-full shadow-lg shadow-[#FFFF00]/30"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <span className="relative z-10 tracking-wide">{item.name}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Side: Blogs, Social & Auth */}
                            <div className="flex items-center gap-4 shrink-0">
                                {/* Blogs Tab (Desktop Only, pushed further right) */}
                                <div className="hidden lg:block h-6 w-px bg-white/10 mx-1"></div>
                                <div className="hidden lg:flex items-center p-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-inner shadow-black/20">
                                    {navigation.filter(item => item.name === 'Blogs').map((item) => {
                                        const isActive = activeSection === item.name.toLowerCase();
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href || '/blogs'}
                                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none ${isActive
                                                    ? 'text-black font-bold'
                                                    : 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-bg-blogs"
                                                        className="absolute inset-0 bg-[#FFFF00] rounded-full shadow-lg shadow-[#FFFF00]/30"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <span className="relative z-10 flex items-center gap-2">
                                                    <NewspaperIcon className="w-4 h-4" />
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="hidden lg:block h-6 w-px bg-white/10 mx-1"></div>

                                <div className="hidden lg:flex items-center gap-2">
                                    <a
                                        href="https://github.com/sumanbisunkhe"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub className="w-5 h-5" />
                                    </a>

                                    <motion.a
                                        href="#contact"
                                        onClick={(e) => {
                                            handleNavigationClick(e, '#contact');
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg ${activeSection === 'contact'
                                            ? 'bg-[#FFFF00] text-black shadow-[#FFFF00]/30'
                                            : 'bg-white text-black hover:bg-gray-200 shadow-white/10'
                                            }`}
                                    >
                                        Let's Talk
                                    </motion.a>
                                </div>

                                {/* Auth Buttons (Visible on desktop) */}
                                <div className="hidden lg:flex items-center">
                                    {currentUser ? (
                                        <div className="relative group ml-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                className="relative block"
                                            >
                                                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg shadow-accent-500/20">
                                                    <img
                                                        src={avatarError ? getFallbackAvatar(currentUser?.displayName || 'User') : currentUser?.photoURL || ''}
                                                        alt={currentUser?.displayName || ''}
                                                        className="w-full h-full rounded-full object-cover border-2 border-[#0a0a0a]"
                                                        onError={() => setAvatarError(true)}
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                                            </motion.button>

                                            <div className="absolute right-0 mt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                                                <div className="p-1 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                                                    <div className="p-3 border-b border-white/5 mb-1">
                                                        <p className="text-sm font-bold text-white truncate">{currentUser.displayName}</p>
                                                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                                    </div>
                                                    <button
                                                        onClick={handleSignOut}
                                                        disabled={isSigningOut}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                                                    >
                                                        {isSigningOut ? 'Signing out...' : 'Sign Out'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onOpenAuthModal}
                                            className="ml-2 w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg"
                                        >
                                            <UserIcon className="w-5 h-5 text-gray-300" />
                                        </motion.button>
                                    )}
                                </div>

                                {/* Mobile Toggle */}
                                <div className="lg:hidden flex items-center gap-3">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5"
                                    >
                                        {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                                    </motion.button>
                                </div>
                            </div>

                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] lg:hidden"
                    >
                        {/* Backdrop with enhanced blur */}
                        <div
                            className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Animated background elements for depth */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0],
                                    transition: { duration: 20, repeat: Infinity }
                                }}
                                className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-accent-900/10 rounded-full blur-[100px]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, -90, 0],
                                    transition: { duration: 25, repeat: Infinity }
                                }}
                                className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-yellow-900/5 rounded-full blur-[120px]"
                            />
                        </div>

                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-black/40 border-l border-white/5 p-8 flex flex-col shadow-2xl relative z-10"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                        <span className="text-black font-extrabold font-fascinate text-xl">S</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-yellow-500 tracking-[0.2em] uppercase leading-none mb-1">Navigation</span>
                                        <span className="text-xl font-bold text-white tracking-tight leading-none">Explore</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </motion.button>
                            </div>

                            {/* Mobile Nav Links with Staggered Animation */}
                            <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                                {navigation.map((item, index) => {
                                    const Icon = item.icon;
                                    const sectionId = item.href?.startsWith('#') ? item.href.substring(1) : item.name.toLowerCase();
                                    const isActive = activeSection === sectionId;

                                    return (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                        >
                                            {item.name === 'Blogs' && (
                                                <div className="mt-8 mb-4">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-4">Content</span>
                                                    <div className="mt-2 h-px bg-gradient-to-r from-white/10 to-transparent mx-4" />
                                                </div>
                                            )}
                                            <a
                                                href={item.href || ''}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (item.href?.startsWith('/')) {
                                                        navigate(item.href);
                                                        setMobileMenuOpen(false);
                                                    } else {
                                                        // Close menu first for smoother transition
                                                        setMobileMenuOpen(false);
                                                        // Small timeout to allow menu animation to start closing
                                                        setTimeout(() => {
                                                            handleNavigationClick(e, item.href || '');
                                                        }, 100);
                                                    }
                                                }}
                                                className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-bold transition-all relative overflow-hidden ${isActive
                                                    ? 'text-yellow-400'
                                                    : item.name === 'Blogs'
                                                        ? 'text-white bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/20'
                                                        : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="mobile-active-bg"
                                                        className="absolute inset-0 bg-yellow-400/10 border border-yellow-400/20"
                                                    />
                                                )}
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-yellow-400/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                                        <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'}`} />
                                                    </div>
                                                    <span className="tracking-tight">{item.name}</span>
                                                </div>
                                                <motion.div
                                                    animate={isActive ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
                                                    className="relative z-10"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                                </motion.div>
                                            </a>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mobile Footer Area */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pt-8 mt-6 border-t border-white/10 space-y-6"
                            >
                                {currentUser ? (
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={avatarError ? getFallbackAvatar(currentUser.displayName || 'User') : currentUser.photoURL || ''}
                                                className="w-12 h-12 rounded-2xl bg-gray-700 object-cover border border-white/10 shadow-lg"
                                                alt="User"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-sm truncate">{currentUser.displayName}</p>
                                            <button
                                                onClick={handleSignOut}
                                                className="text-xs text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider mt-1 flex items-center gap-1"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            onOpenAuthModal();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-extrabold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-yellow-500/20"
                                    >
                                        Sign In Provider
                                    </motion.button>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <motion.a
                                            whileHover={{ y: -3 }}
                                            href="https://github.com/sumanbisunkhe"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <FaGithub className="w-5 h-5" />
                                        </motion.a>
                                    </div>
                                    <motion.a
                                        href="#contact"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                            setMobileMenuOpen(false);
                                            setTimeout(() => handleNavigationClick(e, '#contact'), 100);
                                        }}
                                        className="px-6 py-3 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-lg"
                                    >
                                        Let's Chat
                                    </motion.a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
