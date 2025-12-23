import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, doc } from 'firebase/firestore';
import { fetchBlogPosts, type BlogPost } from '../lib/contentful';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import AuthModal from './AuthModal';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

// Initialize EmailJS
emailjs.init("VXCt9Zz9CXdcj9zIF");

interface Comment {
  id: string;
  text: string;
  userName: string;
  userAvatar: string;
  createdAt: Timestamp;
}

// Define interfaces for Contentful rich text structure used in search
interface ContentItem {
  value?: string;
}

interface ContentBlock {
  content?: ContentItem[];
}

const Thoughts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'comments' | 'views' | 'favorites'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [postViews, setPostViews] = useState<{ [key: string]: number }>({});
  const [postLoves, setPostLoves] = useState<{ [key: string]: number }>({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.fields.tags || [])));

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  // useEffect to load posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
        setFilteredPosts(blogPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Real-time listener for post analytics (views, loves, and current user's liked status)
  useEffect(() => {
    if (posts.length === 0) return;

    const unsubscribes: (() => void)[] = [];

    posts.forEach(post => {
      const postRef = doc(db, 'posts', post.sys.id);
      const unsubscribe = onSnapshot(postRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const views = data.views || 0;
          const loves = data.likedBy?.length || 0;

          setPostViews(prev => ({ ...prev, [post.sys.id]: views }));
          setPostLoves(prev => ({ ...prev, [post.sys.id]: loves }));

          if (auth.currentUser) {
            setLikedPosts(prev => ({
              ...prev,
              [post.sys.id]: data.likedBy?.includes(auth.currentUser?.uid) || false
            }));
          }
        }
      });
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [posts, auth.currentUser]);

  // Modify the filter and sort effect
  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.fields.title.toLowerCase().includes(query) ||
        post.fields.content?.content.some((content: ContentBlock) =>
          content.content?.some((item: ContentItem) =>
            item.value?.toLowerCase().includes(query)
          )
        )
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter(post =>
        selectedTags.every(tag => post.fields.tags?.includes(tag))
      );
    }

    // Apply favorites filter
    if (showFavorites) {
      result = result.filter(post => likedPosts[post.sys.id]);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.fields.publishedDate || b.sys.createdAt).getTime() -
            new Date(a.fields.publishedDate || a.sys.createdAt).getTime();
        case 'comments':
          return (comments[b.sys.id]?.length || 0) - (comments[a.sys.id]?.length || 0);
        case 'views':
          return (postViews[b.sys.id] || 0) - (postViews[a.sys.id] || 0);
        case 'favorites':
          return (postLoves[b.sys.id] || 0) - (postLoves[a.sys.id] || 0);
        default:
          return 0;
      }
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTags, sortBy, comments, showFavorites, likedPosts, postViews, postLoves]);

  // Load comments for all posts
  useEffect(() => {
    if (posts.length === 0) return;

    const unsubscribes: (() => void)[] = [];

    posts.forEach(post => {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', post.sys.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];

        setComments(prev => ({
          ...prev,
          [post.sys.id]: postComments
        }));
      }, (error) => {
        console.error('Error loading comments:', error);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [posts]);



  const handlePostClick = (post: BlogPost) => {
    navigate(`/blogs/${post.fields.slug}`);
  };

  const handleNotifyMe = async () => {
    if (!auth.currentUser) {
      // toast.error('Sign in to get notified');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingNotify(true);
    try {
      await emailjs.send(
        'service_erfg3dm',
        'template_galc3xd',
        {
          from_name: auth.currentUser.displayName || 'Architect',
          from_email: auth.currentUser.email,
          message: `Technical Notification Request: User ${auth.currentUser.displayName} (${auth.currentUser.email}) wants to be notified about new technical masterclasses and blog threads.`,
          to_email: 'sumanbisunkhe304@gmail.com'
        }
      );

      toast.success(
        () => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Notified Successfully !</p>
            </div>
          </div>
        ),
        { style: { background: '#111', border: '1px solid rgba(255, 215, 0, 0.2)' } }
      );
    } catch (error) {
      console.error('Error sending notification request:', error);
      toast.error('Failed to process request');
    } finally {
      setIsSubmittingNotify(false);
    }
  };

  return (
    <section id="thoughts" className="min-h-screen pt-24 sm:pt-32 pb-24 bg-[#050505] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-accent-900/10 rounded-full blur-[80px] sm:blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          className="absolute top-1/2 -right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-900/10 rounded-full blur-[60px] sm:blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-900 font-josefin text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 block font-bold">In-depth Articles</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-oldenburg font-bold text-white mb-6 sm:mb-8 tracking-tight">
              THE <span className="text-accent-900">BLOG</span>
            </h1>
            <p className="text-gray-400 font-josefin text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Exploring the intersections of Java development, modern web architecture, and design patterns.
            </p>
          </motion.div>

          {/* Cinematic Stats Section - Responsive Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-12"
          >
            {[
              { icon: BookOpenIcon, label: 'Articles', value: posts.length },
              { icon: ChatBubbleLeftIcon, label: 'Threads', value: Object.values(comments).reduce((acc, curr) => acc + curr.length, 0) },
              { icon: EyeIcon, label: 'Views', value: Object.values(postViews).reduce((acc, curr) => acc + curr, 0).toLocaleString() },
              { icon: HeartIcon, label: 'Loved', value: Object.values(postLoves).reduce((acc, curr) => acc + curr, 0).toLocaleString() }
            ].map((stat, i) => (
              <div key={i} className="group relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-accent-900/50 hover:bg-white/10">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-900 shrink-0" />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-white font-bold font-josefin leading-none mb-1 text-base sm:text-lg truncate w-full">{stat.value}</span>
                  <span className="text-gray-500 font-josefin text-[8px] sm:text-[10px] uppercase tracking-widest font-bold truncate w-full">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Improved Search & Search-Bar Section */}
        <div className="max-w-5xl mx-auto mb-10 sm:mb-16 px-2 sm:px-4">
          <div className="relative group">
            {/* Search Input Container */}
            <div className={`relative transition-all duration-500 ${showFilters ? 'mb-4 sm:mb-6' : 'mb-0'}`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-900/20 to-blue-900/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Explore thoughts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 sm:px-8 py-4 sm:py-5 pl-12 sm:pl-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-900/30 font-josefin text-base sm:text-lg transition-all"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-focus-within:text-accent-900 transition-colors" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>

                {/* Filter Controls Bar */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`flex-1 sm:flex-none h-full min-h-[50px] sm:min-h-0 px-4 sm:px-6 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-josefin font-bold transition-all border ${showFavorites
                      ? 'bg-accent-900 text-black border-accent-900'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                      }`}
                  >
                    {showFavorites ? <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5" /> : <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span className="sm:inline text-sm sm:text-base">Loved</span>
                  </button>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex-1 sm:flex-none h-full min-h-[50px] sm:min-h-0 px-4 sm:px-6 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-josefin font-bold transition-all border ${showFilters
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                      }`}
                  >
                    <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:inline text-sm sm:text-base">Filters</span>
                  </button>

                  <div className="relative flex-1 sm:flex-none h-full min-h-[50px] sm:min-h-0 flex items-center">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'comments' | 'views' | 'favorites')}
                      className="w-full h-full pl-4 sm:pl-6 pr-8 sm:pr-10 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white font-josefin font-bold focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all outline-none text-sm sm:text-base"
                    >
                      <option value="date" className="bg-[#111]">Latest</option>
                      <option value="comments" className="bg-[#111]">Threads</option>
                      <option value="views" className="bg-[#111]">Popular</option>
                      <option value="favorites" className="bg-[#111]">Loved</option>
                    </select>
                    <div className="absolute right-3 sm:right-4 pointer-events-none text-gray-500">
                      <svg className="w-3 h-3 sm:w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tag Filter Chips */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-2 p-4 sm:p-6 bg-white/5 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/10"
                >
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-josefin font-bold transition-all flex items-center gap-1.5 sm:gap-2 ${selectedTags.includes(tag)
                        ? 'bg-accent-900 text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                        }`}
                    >
                      <TagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {tag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Banner */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="h-px w-8 sm:w-12 bg-white/10" />
          <p className="text-gray-500 font-josefin text-[10px] sm:text-sm uppercase tracking-widest font-bold">
            Showing {filteredPosts.length} Masterpieces
          </p>
          <div className="h-px w-8 sm:w-12 bg-white/10" />
        </div>

        {/* Premium Blog Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-accent-900/30 border-t-accent-900 rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/5 border-dashed px-4">
            <XMarkIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg sm:text-xl font-oldenburg">No Article Found.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedTags([]); setShowFavorites(false); }} className="text-accent-900 mt-4 font-josefin hover:underline text-sm sm:text-base">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.sys.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => handlePostClick(post)}
                className="group cursor-pointer flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-accent-900/30 hover:bg-[#111] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden p-2 sm:p-3 pb-0">
                  <div className="w-full h-full relative rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src={post.fields.coverImage?.fields?.file?.url || '/fallback-image.jpg'}
                      alt={post.fields.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                    {/* Floating Date Badge */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/60 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/10">
                      <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-900" />
                      <span className="text-[8px] sm:text-[10px] font-josefin font-bold text-white uppercase tracking-wider">
                        {format(new Date(post.fields.publishedDate || post.sys.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {/* Primary Tag */}
                    {post.fields.tags && post.fields.tags[0] && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <span className="px-2 sm:px-3 py-1 bg-accent-900 rounded-full text-[8px] sm:text-[10px] font-bold text-black uppercase tracking-wider shadow-lg shadow-black/20">
                          {post.fields.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-oldenburg font-bold text-white mb-3 sm:mb-4 line-clamp-2 leading-tight group-hover:text-accent-900 transition-colors">
                    {post.fields.title}
                  </h3>

                  <div className="text-gray-400 text-xs sm:text-sm font-josefin line-clamp-3 leading-relaxed mb-4 sm:mb-6 flex-1">
                    {post.fields.content?.content?.[0]?.content?.[0]?.value || "Diving deep into technical concepts and practical implementations..."}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 p-0.5">
                        <img src="/images/pH.webp" alt="Author" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-josefin font-bold text-white uppercase tracking-widest">Suman B.</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <HeartIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${likedPosts[post.sys.id] ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                        <span className="text-[10px] sm:text-xs font-josefin font-bold text-gray-500">{postLoves[post.sys.id] || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-accent-900 transition-colors" />
                        <span className="text-[10px] sm:text-xs font-josefin font-bold text-gray-500">{postViews[post.sys.id] || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <ChatBubbleLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-accent-900 transition-colors" />
                        <span className="text-[10px] sm:text-xs font-josefin font-bold text-gray-500">{comments[post.sys.id]?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination placeholder / Stay tuned */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 sm:mt-24 text-center p-8 sm:p-12 bg-white/5 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 max-w-2xl mx-auto"
        >
          <h4 className="text-xl sm:text-2xl font-oldenburg text-white mb-3 sm:mb-4">Hungry for more?</h4>
          <p className="text-gray-400 font-josefin mb-6 sm:mb-8 uppercase text-[10px] sm:text-sm tracking-widest">More masterclasses are on the assembly line.</p>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-accent-900 rounded-full blur opacity-30 animate-pulse" />
              <button
                onClick={handleNotifyMe}
                disabled={isSubmittingNotify}
                className="relative px-6 sm:px-8 py-2.5 sm:py-3 bg-accent-900 text-black rounded-full font-josefin font-extrabold text-[10px] sm:text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
              >
                {isSubmittingNotify ? 'Processing...' : 'Notify Me'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Auth Modal remains the same */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </section>
  );
};

export default Thoughts; 