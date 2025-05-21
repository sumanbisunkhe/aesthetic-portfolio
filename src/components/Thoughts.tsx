import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
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
  UserIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import AuthModal from './AuthModal';
import BlogPostView from './BlogPost';

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Timestamp;
  postId: string;
}

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
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'comments'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPostForReading, setSelectedPostForReading] = useState<BlogPost | null>(null);
  const [postViews, setPostViews] = useState<{ [key: string]: number }>({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.fields.tags || [])));

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
      if (sortBy === 'date') {
        return new Date(b.fields.publishedDate || b.sys.createdAt).getTime() - 
               new Date(a.fields.publishedDate || a.sys.createdAt).getTime();
      } else {
        return (comments[b.sys.id]?.length || 0) - (comments[a.sys.id]?.length || 0);
      }
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTags, sortBy, comments, showFavorites, likedPosts]);

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

  const handleAddComment = async (postId: string) => {
    if (!auth.currentUser || !newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        userAvatar: auth.currentUser.photoURL,
        createdAt: Timestamp.now(),
        postId
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePostClick = (post: BlogPost) => {
    navigate(`/thoughts/${post.sys.id}`);
  };

  return (
    <section id="thoughts" className="min-h-screen py-24 bg-gradient-to-b from-black to-black">
      <div className="container mx-auto px-4">
        {selectedPostForReading ? (
          <BlogPostView 
            post={selectedPostForReading} 
            onBack={() => setSelectedPostForReading(null)} 
          />
        ) : (
          <>
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-josefin text-white mb-4">
                My <span className="bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent">Thoughts</span>
              </h1>
              <p className="text-primary-300 max-w-2xl mx-auto">
                Exploring ideas, sharing insights, and documenting my journey through technology and beyond.
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-primary-800/50 border border-primary-700/50 rounded-xl text-primary-200 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-josefin"
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-accent-900"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`flex items-center gap-2 px-4 py-3 bg-primary-800/50 border border-primary-700/50 rounded-xl transition-colors duration-200 ${
                      showFavorites 
                        ? 'text-accent-200 border-accent-200/50 hover:bg-accent-900/20' 
                        : 'text-primary-200 hover:bg-primary-700/50 hover:text-accent-900'
                    }`}
                  >
                    {showFavorites ? (
                      <HeartIconSolid className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    Favorites
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 bg-primary-800/50 border border-primary-700/50 rounded-xl text-primary-200 hover:bg-primary-700/50 hover:text-accent-900 transition-colors duration-200"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    Filters
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'comments')}
                    className="px-4 py-3 bg-primary-800/50 border border-primary-700/50 rounded-xl text-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-josefin"
                  >
                    <option value="date">Latest First</option>
                    <option value="comments">Most Commented</option>
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
                    className="mt-4 p-4 bg-primary-800/30 rounded-xl border border-primary-700/50"
        >
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags(prev =>
                              prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-josefin transition-all duration-200 flex items-center gap-1.5 ${
                            selectedTags.includes(tag)
                              ? 'bg-accent-900 text-primary-900'
                              : 'bg-primary-700/30 text-primary-200 hover:bg-primary-700/50'
                          }`}
                        >
                          <TagIcon className="w-3.5 h-3.5" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-primary-400 font-josefin">
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
                <p className="text-primary-400 text-lg font-josefin">No articles found matching your criteria.</p>
          </div>
        ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
              <motion.article
                key={post.sys.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                    className="group relative bg-primary-800/30 rounded-xl overflow-hidden border border-primary-700/30 hover:border-accent-900/30 transition-all duration-300 cursor-pointer"
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
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {post.fields.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-accent-900/90 backdrop-blur-sm rounded-full text-xs text-primary-900 font-josefin"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.fields.tags && post.fields.tags.length > 2 && (
                          <span className="px-2 py-1 bg-primary-900/90 backdrop-blur-sm rounded-full text-xs text-primary-200 font-josefin">
                            +{post.fields.tags.length - 2}
                          </span>
                        )}
                </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Title and Date */}
                    <div>
                        <h3 className="text-lg font-josefin text-white group-hover:text-accent-900 transition-colors duration-300 line-clamp-2">
                          {post.fields.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-primary-400 text-xs">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <time>
                        {format(new Date(post.fields.publishedDate || post.sys.createdAt), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>

                      {/* Content Preview */}
                      <div className="text-primary-300 text-sm line-clamp-2 font-josefin">
                    {post.fields.content ? (
                      <div className="prose prose-invert max-w-none">
                        {documentToReactComponents(post.fields.content)}
                      </div>
                    ) : null}
                  </div>

                      {/* Author and Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-primary-700/30">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                            <img
                              src="/images/pp.webp"
                              alt="Suman Bisunkhe"
                              className="relative w-6 h-6 rounded-full ring-2 ring-accent-900/20 object-cover"
                            />
                          </div>
                          <span className="text-primary-200 text-xs font-josefin">Suman Bisunkhe</span>
                  </div>
                        <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-primary-400 text-xs">
                      <EyeIcon className="w-3.5 h-3.5" />
                      {postViews[post.sys.id]?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center gap-1 text-primary-400 text-xs">
                      <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                      {comments[post.sys.id]?.length || 0}
                    </div>
                        </div>
                      </div>
                  </div>

                  {/* Comments Section */}
                    <AnimatePresence>
                  {selectedPost === post.sys.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                    >
                      {/* Comment Form */}
                          {auth.currentUser ? (
                            <div className="flex gap-3 mt-3">
                          <img
                            src={auth.currentUser.photoURL || ''}
                            alt={auth.currentUser.displayName || ''}
                                className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                                  className="w-full px-3 py-2 bg-primary-700/30 rounded-lg text-primary-200 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-josefin text-xs"
                                  rows={2}
                            />
                            <button
                              onClick={() => handleAddComment(post.sys.id)}
                                  className="mt-1.5 px-3 py-1.5 bg-accent-900 text-primary-900 rounded-lg hover:bg-accent-800 transition-colors duration-200 text-xs font-josefin"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                          ) : (
                            <button
                              onClick={() => setIsAuthModalOpen(true)}
                              className="w-full mt-3 px-3 py-2 bg-primary-700/30 rounded-lg text-primary-200 hover:bg-primary-700/50 transition-colors duration-200 text-xs font-josefin"
                            >
                              Sign in to comment
                            </button>
                      )}

                      {/* Comments List */}
                          <div className="space-y-3 mt-3">
                        {comments[post.sys.id]?.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                                  className="w-6 h-6 rounded-full"
                            />
                            <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-primary-200 text-xs font-josefin">{comment.userName}</span>
                                    <time className="text-primary-400 text-[10px]">
                                  {format(comment.createdAt.toDate(), 'MMM d, yyyy')}
                                </time>
                              </div>
                                  <p className="text-primary-300 text-xs mt-0.5 font-josefin">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                    </AnimatePresence>
              </motion.article>
            ))}
          </div>
            )}
          </>
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