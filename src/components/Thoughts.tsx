import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
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
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

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

  // Add useEffect to check liked posts
  useEffect(() => {
    if (!auth.currentUser || posts.length === 0) return;

    const checkLikedPosts = async () => {
      const liked: { [key: string]: boolean } = {};
      for (const post of posts) {
        const postRef = doc(db, 'posts', post.sys.id);
        const postDoc = await getDoc(postRef);
        const data = postDoc.data();
        liked[post.sys.id] = data?.likedBy?.includes(auth.currentUser?.uid) || false;
      }
      setLikedPosts(liked);
    };

    checkLikedPosts();
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
          return (likedPosts[b.sys.id] ? 1 : 0) - (likedPosts[a.sys.id] ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTags, sortBy, comments, showFavorites, likedPosts, postViews]);

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

  // Add useEffect to fetch post views
  useEffect(() => {
    const fetchPostViews = async () => {
      const views: { [key: string]: number } = {};
      for (const post of posts) {
        const postRef = doc(db, 'posts', post.sys.id);
        const postDoc = await getDoc(postRef);
        views[post.sys.id] = postDoc.data()?.views || 0;
      }
      setPostViews(views);
    };

    if (posts.length > 0) {
      fetchPostViews();
    }
  }, [posts]);

  const handlePostClick = (post: BlogPost) => {
    navigate(`/thoughts/${post.fields.slug}`);
  };

  return (
    <section id="thoughts" className="min-h-screen py-24 bg-gradient-to-b from-black to-black">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center gap-1 px-4 py-2 bg-primary-800/30 rounded-full border border-primary-700/20">
            <div className="group relative flex items-center gap-2 px-3 border-r border-primary-700/20">
              <BookOpenIcon className="w-4 h-4 text-accent-900" />
              <span className="font-merriweather text-sm text-primary-300">{posts.length}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-primary-900 text-primary-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                Articles
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-primary-900"></div>
              </div>
            </div>
            <div className="group relative flex items-center gap-2 px-3 border-r border-primary-700/20">
              <ChatBubbleLeftIcon className="w-4 h-4 text-accent-900" />
              <span className="font-merriweather text-sm text-primary-300">
                {Object.values(comments).reduce((acc, curr) => acc + curr.length, 0)}
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-primary-900 text-primary-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                Comments
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-primary-900"></div>
              </div>
            </div>
            <div className="group relative flex items-center gap-2 px-3 border-r border-primary-700/20">
              <EyeIcon className="w-4 h-4 text-accent-900" />
              <span className="font-merriweather text-sm text-primary-300">
                {Object.values(postViews).reduce((acc, curr) => acc + curr, 0).toLocaleString()}
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-primary-900 text-primary-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                Total Views
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-primary-900"></div>
              </div>
            </div>
            <div className="group relative flex items-center gap-2 px-3">
              <HeartIcon className="w-4 h-4 text-accent-900" />
              <span className="font-merriweather text-sm text-primary-300">
                {Object.values(likedPosts).filter(Boolean).length}
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-primary-900 text-primary-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                Favorites
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-primary-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative mb-12">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-200/5 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="relative p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 bg-black/50 border border-primary-700/50 rounded-xl text-primary-200 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-merriweather"
                  />
                  <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-accent-900"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-primary-800/50 border border-primary-700/50 rounded-xl transition-all duration-200 ${
                    showFavorites 
                      ? 'text-accent-200 border-accent-200/50 hover:bg-primary-800/70' 
                      : 'text-primary-200 hover:bg-primary-800/70 hover:text-accent-900'
                  }`}
                >
                  {showFavorites ? (
                    <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <span className="font-merriweather text-sm sm:text-base">Favorites</span>
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-primary-800/50 border border-primary-700/50 rounded-xl transition-all duration-200 ${
                    showFilters 
                      ? 'text-accent-200 border-accent-200/50 hover:bg-primary-800/70' 
                      : 'text-primary-200 hover:bg-primary-800/70 hover:text-accent-900'
                  }`}
                >
                  <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-merriweather text-sm sm:text-base">Filters</span>
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'comments' | 'views' | 'favorites')}
                  className="col-span-2 sm:col-span-1 px-4 sm:px-6 py-3 sm:py-4 bg-primary-800/50 border border-primary-700/50 rounded-xl text-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-merriweather appearance-none cursor-pointer hover:bg-primary-800/70 transition-colors duration-200 text-sm sm:text-base"
                >
                  <option value="date" className="bg-black text-primary-200">Latest First</option>
                  <option value="comments" className="bg-black text-primary-200">Most Commented</option>
                  <option value="views" className="bg-black text-primary-200">Most Popular</option>
                  <option value="favorites" className="bg-black text-primary-200">Most Favorited</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 sm:p-6 bg-black/30 rounded-xl border border-primary-700/50"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-3 sm:px-4 py-2 rounded-full text-sm font-merriweather transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          selectedTags.includes(tag)
                            ? 'bg-accent-800 text-primary-200'
                            : 'bg-primary-800/50 text-primary-200 hover:bg-primary-800/70'
                        }`}
                      >
                        <TagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="truncate">{tag}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-primary-400 font-merriweather">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-900"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-primary-400 text-lg font-merriweather">No articles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.sys.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative bg-primary-800/30 rounded-lg sm:rounded-xl overflow-hidden border border-primary-700/30 hover:border-accent-900/30 transition-all duration-300 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                {/* Cover Image with Overlay */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.fields.coverImage?.fields?.file?.url || '/fallback-image.jpg'}
                    alt={post.fields.coverImage?.fields?.title || post.fields.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.src = '/fallback-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/50 to-transparent opacity-80" />
                  
                  {/* Tags Overlay */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1">
                    {post.fields.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-accent-900/90 backdrop-blur-sm rounded-full text-[7px] sm:text-xs text-primary-900 font-merriweather"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.fields.tags && post.fields.tags.length > 2 && (
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary-900/90 backdrop-blur-sm rounded-full text-[7px] sm:text-xs text-primary-200 font-merriweather">
                        +{post.fields.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Title and Date */}
                  <div>
                    <h3 className="text-[10px] sm:text-sm lg:text-base font-merriweather text-white group-hover:text-accent-900 transition-colors duration-300 line-clamp-2 leading-tight">
                      {post.fields.title}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-0.5 text-primary-400 text-[7px] sm:text-xs">
                      <CalendarIcon className="w-1.5 h-1.5 sm:w-3.5 sm:h-3.5" />
                      <time>
                        {format(new Date(post.fields.publishedDate || post.sys.createdAt), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="text-primary-300 text-[8px] sm:text-sm line-clamp-2 font-merriweather leading-tight">
                    {post.fields.content ? (
                      <div className="prose prose-invert max-w-none prose-[7px] sm:prose-sm">
                        {documentToReactComponents(post.fields.content)}
                      </div>
                    ) : null}
                  </div>

                  {/* Author and Stats */}
                  <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-primary-700/30">
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                        <img
                          src="/images/pp.webp"
                          alt="Suman Bisunkhe"
                          className="relative w-2.5 h-2.5 sm:w-5 sm:h-5 rounded-full ring-1 ring-accent-900/20 object-cover"
                        />
                      </div>
                      <span className="text-primary-200 text-[6px] sm:text-xs font-merriweather">Suman Bisunkhe</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-0.5 text-primary-400 text-[6px] sm:text-xs">
                        <EyeIcon className="w-1.5 h-1.5 sm:w-3.5 sm:h-3.5" />
                        <span className="sm:ml-1">
                          {postViews[post.sys.id]?.toLocaleString() || 0}
                          <span className="hidden sm:inline ml-1">Views</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-primary-400 text-[6px] sm:text-xs">
                        <ChatBubbleLeftIcon className="w-1.5 h-1.5 sm:w-3.5 sm:h-3.5" />
                        <span className="sm:ml-1">
                          {comments[post.sys.id]?.length || 0}
                          <span className="hidden sm:inline ml-1">Comments</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    </section>
  );
};

export default Thoughts; 