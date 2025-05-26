import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, increment, doc, updateDoc, getDoc, setDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ChatBubbleLeftIcon, 
  TagIcon, 
  CalendarIcon, 
  ArrowLeftIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import AuthModal from './AuthModal';
import type { BlogPost } from '../lib/contentful';
import { toast } from 'react-hot-toast';
import { fetchBlogPosts } from '../lib/contentful';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Timestamp;
  postId: string;
  likes: number;
  likedBy: string[];
  isEdited?: boolean;
  editedAt?: Timestamp;
}

interface BlogPostViewProps {
  onBack: () => void;
}

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

const BlogPostView = ({ onBack }: BlogPostViewProps) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Load post data based on slug
  useEffect(() => {
    const loadPost = async () => {
      try {
        const posts = await fetchBlogPosts();
        const foundPost = posts.find(p => p.fields.slug === slug);
        
        if (!foundPost) {
          navigate('/thoughts');
          return;
        }

        setPost(foundPost);
        setIsLoading(false);

        // Get or create the post document in Firestore
        const postRef = doc(db, 'posts', foundPost.sys.id);
        const postDoc = await getDoc(postRef);
        
        if (!postDoc.exists()) {
          // Create the document if it doesn't exist
          await setDoc(postRef, {
            views: 1,
            likedBy: [],
            bookmarkedBy: [],
            createdAt: Timestamp.now()
          });
          setViews(1);
        } else {
          // Update views if document exists
          await updateDoc(postRef, {
            views: increment(1)
          });
          setViews(postDoc.data()?.views || 0);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/thoughts');
      }
    };

    loadPost();
  }, [slug, navigate]);

  // Check if post is liked/bookmarked
  useEffect(() => {
    if (!post || !auth.currentUser) return;

    const checkUserInteractions = async () => {
      try {
        const postRef = doc(db, 'posts', post.sys.id);
        const postDoc = await getDoc(postRef);
        const data = postDoc.data();
        
        if (data) {
          setIsLiked(data.likedBy?.includes(auth.currentUser?.uid) || false);
          setIsBookmarked(data.bookmarkedBy?.includes(auth.currentUser?.uid) || false);
        }
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };
    
    checkUserInteractions();
  }, [post, auth.currentUser]);

  // Load comments
  useEffect(() => {
    if (!post) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', post.sys.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      setComments(postComments);
      setIsLoading(false);
    }, (error) => {
      console.error('Error loading comments:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [post]);

  const handleAddComment = async () => {
    if (!auth.currentUser || !post || !newComment.trim()) return;
    
    try {
      const commentRef = collection(db, 'comments');
      await addDoc(commentRef, {
        postId: post.sys.id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userAvatar: auth.currentUser.photoURL || '',
        text: newComment.trim(),
        createdAt: Timestamp.now(),
      });
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!auth.currentUser || !editCommentText.trim()) return;

    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        text: editCommentText.trim(),
        isEdited: true,
        editedAt: Timestamp.now()
      });

      setEditingCommentId(null);
      setEditCommentText('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!auth.currentUser) return;

    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleLikePost = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !post?.sys.id) return;

    try {
      const postRef = doc(db, 'posts', post.sys.id);
      const postDoc = await getDoc(postRef);
      const data = postDoc.data();
      
      if (data) {
        const likedBy = data.likedBy || [];
        const isCurrentlyLiked = likedBy.includes(currentUser.uid);
        
        // Use arrayUnion and arrayRemove for better performance
        await updateDoc(postRef, {
          likedBy: isCurrentlyLiked 
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
          likes: increment(isCurrentlyLiked ? -1 : 1)
        });
        
        setIsLiked(!isCurrentlyLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleBookmarkPost = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !post || !post.sys.id) return;

    try {
      // Handle Firestore bookmark
      const postRef = doc(db, 'posts', post.sys.id);
      const postDoc = await getDoc(postRef);
      const data = postDoc.data();
      
      if (data) {
        const bookmarkedBy = data.bookmarkedBy || [];
        const isCurrentlyBookmarked = bookmarkedBy.includes(currentUser.uid);
        
        await updateDoc(postRef, {
          bookmarkedBy: isCurrentlyBookmarked 
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid)
        });
        
        setIsBookmarked(!isCurrentlyBookmarked);

        // Handle browser bookmark
        if (!isCurrentlyBookmarked) {
          // Show a custom toast with bookmark instructions
          toast.custom((t) => (
            <div className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-primary-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <BookmarkIcon className="h-10 w-10 text-accent-200" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-primary-100">
                      Bookmark this article
                    </p>
                    <p className="mt-1 text-sm text-primary-300">
                      Press {navigator.userAgent.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'} + D to bookmark this page
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-primary-700">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-accent-200 hover:text-accent-300 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          ), {
            duration: 5000,
            position: 'bottom-center',
          });
        }

        toast.success(isCurrentlyBookmarked ? 'Post unbookmarked' : 'Post bookmarked in your profile');
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      toast.error('Failed to update bookmark status');
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    if (!post) return;

    const url = window.location.href;
    const title = post.fields.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
    
    setShowShareMenu(false);
  };

  const handleLikeComment = async (commentId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const commentRef = doc(db, 'comments', commentId);
      const commentDoc = await getDoc(commentRef);
      const data = commentDoc.data();
      
      if (!data) return;

      const likedBy = data.likedBy || [];
      const isLiked = likedBy.includes(currentUser.uid);
      
      // Use arrayUnion and arrayRemove for better performance
      await updateDoc(commentRef, {
        likedBy: isLiked 
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
        likes: increment(isLiked ? -1 : 1)
      });

      toast.success(isLiked ? 'Comment unliked' : 'Comment liked');
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to update like status');
    }
  };

  const renderNode = {
    [BLOCKS.PARAGRAPH]: (_node: any, children: React.ReactNode) => (
      <p className="mb-4 text-primary-200 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (_node: any, children: React.ReactNode) => (
      <h1 className="text-4xl font-bold mb-6 text-white">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: React.ReactNode) => (
      <h2 className="text-3xl font-bold mb-5 text-white">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: React.ReactNode) => (
      <h3 className="text-2xl font-bold mb-4 text-white">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node: any, children: React.ReactNode) => (
      <h4 className="text-xl font-bold mb-3 text-white">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (_node: any, children: React.ReactNode) => (
      <h5 className="text-lg font-bold mb-2 text-white">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (_node: any, children: React.ReactNode) => (
      <h6 className="text-base font-bold mb-2 text-white">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: React.ReactNode) => (
      <ul className="list-disc mb-4 ml-6 text-primary-200">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: React.ReactNode) => (
      <ol className="list-decimal mb-4 ml-6 text-primary-200">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: any, children: React.ReactNode) => (
      <li>{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-accent-900 pl-4 italic my-4 text-primary-300">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-primary-700" />,
    [BLOCKS.EMBEDDED_ASSET]: (_node: any) => {
      const { title, description, file } = _node.data.target.fields;
      return (
        <figure className="my-8">
          <img
            src={file.url}
            alt={description || title}
            className="rounded-lg shadow-lg"
          />
          {description && (
            <figcaption className="text-sm text-primary-400 mt-2 text-center">
              {description}
            </figcaption>
          )}
        </figure>
      );
    },
    [INLINES.HYPERLINK]: (_node: any, children: React.ReactNode) => {
      const { uri } = _node.data;
      return (
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-900 hover:text-accent-800 underline"
        >
          {children}
        </a>
      );
    },
    [INLINES.EMBEDDED_ENTRY]: (_node: any) => {
      const { title, description, file } = _node.data.target.fields;
      return (
        <figure className="my-8">
          <img
            src={file.url}
            alt={description || title}
            className="rounded-lg shadow-lg"
          />
          {description && (
            <figcaption className="text-sm text-primary-400 mt-2 text-center">
              {description}
            </figcaption>
          )}
        </figure>
      );
    },
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-primary-300 mb-8">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/thoughts" className="text-accent-200 hover:text-accent-300 transition-colors duration-200">
            ← Back to Thoughts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-24 bg-gradient-to-b from-primary-900 via-primary-900/95 to-primary-900"
    >
      <div className="container mx-auto px-4">
        {/* Article Container */}
        <div className="max-w-7xl mx-auto">
          {/* Article Header with Gradient Background */}
          <div className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary-800/50 to-primary-900/50 border border-primary-700/20">
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-200/5 via-transparent to-transparent" />
            
            <div className="relative">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="group inline-flex items-center gap-2 mb-8 text-primary-100 hover:text-accent-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-merriweather">Back to Articles</span>
              </button>

              <h1 className="blog-title text-primary-50 mb-10 font-playfair">
                {post.fields.title}
              </h1>
              
              {/* Author and Date Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 animate-spin-slow opacity-50 blur-sm" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 opacity-20" />
                    <img
                      src="/images/pp.webp"
                      alt="Suman Bisunkhe"
                      className="relative w-14 h-14 rounded-full ring-2 ring-accent-200/20 object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-playfair text-primary-100">Suman Bisunkhe</h2>
                    <div className="flex items-center gap-2 text-primary-300 font-merriweather">
                      <CalendarIcon className="w-5 h-5" />
                      <time>
                        {format(new Date(post.fields.publishedDate || post.sys.createdAt), 'MMMM d, yyyy')}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Post Stats with Gradient Background */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-primary-800/30 border border-primary-700/20">
                  <div className="flex items-center gap-2 text-primary-300">
                    <EyeIcon className="w-5 h-5" />
                    <span className="font-merriweather">
                      {views.toLocaleString()}
                      <span className="hidden sm:inline ml-1">views</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-300">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span className="font-merriweather">
                      {comments.length}
                      <span className="hidden sm:inline ml-1">comments</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLikePost}
                      className="flex items-center gap-2 text-primary-300 hover:text-accent-200 transition-colors duration-200"
                    >
                      {isLiked ? (
                        <HeartIconSolid className="w-5 h-5 text-accent-200" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleBookmarkPost}
                      className="text-primary-300 hover:text-accent-200 transition-colors duration-200"
                      title="Bookmark this article"
                    >
                      <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-accent-200 text-accent-200' : ''}`} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="text-primary-300 hover:text-accent-200 transition-colors duration-200"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </button>
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-primary-800 rounded-xl shadow-xl border border-primary-700/50 overflow-hidden z-50"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleShare('twitter')}
                                className="w-full px-4 py-2 text-left text-primary-200 hover:bg-primary-700/50 hover:text-accent-200 transition-colors duration-200 font-merriweather"
                              >
                                Twitter
                              </button>
                              <button
                                onClick={() => handleShare('facebook')}
                                className="w-full px-4 py-2 text-left text-primary-200 hover:bg-primary-700/50 hover:text-accent-200 transition-colors duration-200 font-merriweather"
                              >
                                Facebook
                              </button>
                              <button
                                onClick={() => handleShare('linkedin')}
                                className="w-full px-4 py-2 text-left text-primary-200 hover:bg-primary-700/50 hover:text-accent-200 transition-colors duration-200 font-merriweather"
                              >
                                LinkedIn
                              </button>
                              <button
                                onClick={() => handleShare('copy')}
                                className="w-full px-4 py-2 text-left text-primary-200 hover:bg-primary-700/50 hover:text-accent-200 transition-colors duration-200 font-merriweather"
                              >
                                Copy Link
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image with Gradient Overlay */}
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-16 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent z-10" />
            <img
              src={post.fields.coverImage?.fields?.file?.url || '/fallback-image.jpg'}
              alt={post.fields.coverImage?.fields?.title || post.fields.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-3 mb-16">
            {post.fields.tags?.map((tag) => (
              <span
                key={tag}
                className="px-5 py-2.5 bg-primary-800/40 rounded-full text-primary-100 flex items-center gap-2 hover:bg-primary-700/40 transition-colors duration-200 font-merriweather"
              >
                <TagIcon className="w-5 h-5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Content Section with Gradient Background */}
          <div className="prose prose-invert prose-lg max-w-none mb-20">
            <div className="relative">
              {/* Main Content Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-800/50 to-primary-900/50 rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-200/5 via-transparent to-transparent" />
              
              {/* Content Container */}
              <div className="relative p-8 md:p-12 lg:p-16 rounded-2xl border border-primary-700/20">
                {post.fields.content && (
                  <div className="space-y-8">
                    {documentToReactComponents(post.fields.content, {
                      renderNode,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section with Gradient Background */}
          <div className="relative border-t border-primary-700/20 pt-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-800/30 to-primary-900/30 rounded-2xl" />
            
            <div className="relative">
              <h3 className="text-3xl font-playfair text-primary-50 mb-12 flex items-center gap-3">
                <ChatBubbleLeftIcon className="w-8 h-8" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {auth.currentUser ? (
                <div className="flex gap-6 mb-16">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                    <img
                      src={auth.currentUser.photoURL || getFallbackAvatar(auth.currentUser.displayName || 'Anonymous')}
                      alt={auth.currentUser.displayName || 'Anonymous'}
                      className="relative w-12 h-12 rounded-full ring-2 ring-accent-200/20 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = getFallbackAvatar(auth.currentUser?.displayName || 'Anonymous');
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                        setCommentError(null);
                      }}
                      placeholder="Share your thoughts..."
                      className={`w-full px-6 py-4 bg-primary-800/40 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-200/50 font-merriweather ${
                        commentError ? 'ring-2 ring-red-500/50' : ''
                      }`}
                      rows={4}
                      maxLength={1000}
                    />
                    {commentError && (
                      <p className="mt-2 text-sm text-red-400 font-merriweather">{commentError}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-primary-400 font-merriweather">
                        {newComment.length}/1000 characters
                      </span>
                      <button
                        onClick={handleAddComment}
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 rounded-xl hover:shadow-lg hover:shadow-accent-900/20 transition-all duration-200 font-merriweather disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmittingComment ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full px-8 py-5 bg-primary-800/40 rounded-xl text-primary-100 hover:bg-primary-700/40 transition-colors duration-200 font-merriweather mb-16"
                >
                  Sign in to comment
                </button>
              )}

              {/* Comments List */}
              <div className="space-y-8">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-200"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-primary-400 font-merriweather">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="relative">
                      {/* Comment Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/30 to-primary-900/20 rounded-xl" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-200/5 via-transparent to-transparent rounded-xl" />
                      
                      {/* Comment Content */}
                      <div className="relative flex gap-6 p-6 rounded-xl border border-primary-700/20">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 animate-spin-slow opacity-50 blur-sm" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 opacity-20" />
                          <img
                            src={comment.userAvatar || getFallbackAvatar(comment.userName || 'Anonymous')}
                            alt={comment.userName || 'Anonymous'}
                            className="relative w-12 h-12 rounded-full ring-2 ring-accent-200/20 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = getFallbackAvatar(comment.userName || 'Anonymous');
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-playfair text-primary-100">{comment.userName || 'Anonymous'}</span>
                              <time className="text-sm font-merriweather text-primary-300">
                                {format(comment.createdAt.toDate(), 'MMM d, yyyy')}
                                {comment.isEdited && (
                                  <span className="ml-2 text-primary-400">(edited)</span>
                                )}
                              </time>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLikeComment(comment.id)}
                                className="flex items-center gap-1 text-primary-300 hover:text-accent-200 transition-colors duration-200"
                              >
                                {comment.likedBy?.includes(auth.currentUser?.uid || '') ? (
                                  <HeartIconSolid className="w-4 h-4 text-accent-200" />
                                ) : (
                                  <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="text-sm font-merriweather">{comment.likes || 0}</span>
                              </button>
                              
                              {/* Comment Actions */}
                              {auth.currentUser?.uid === comment.userId && (
                                <div className="relative">
                                  <button
                                    onClick={() => setShowMoreMenu(showMoreMenu === comment.id ? null : comment.id)}
                                    className="text-primary-300 hover:text-accent-200 transition-colors duration-200"
                                  >
                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {showMoreMenu === comment.id && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-primary-800 rounded-xl shadow-xl border border-primary-700/50 overflow-hidden z-50"
                                      >
                                        <div className="py-1">
                                          <button
                                            onClick={() => {
                                              setEditingCommentId(comment.id);
                                              setEditCommentText(comment.text);
                                              setShowMoreMenu(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-primary-200 hover:bg-primary-700/50 hover:text-accent-200 transition-colors duration-200 font-merriweather"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (window.confirm('Are you sure you want to delete this comment?')) {
                                                handleDeleteComment(comment.id);
                                              }
                                              setShowMoreMenu(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-primary-700/50 hover:text-red-300 transition-colors duration-200 font-merriweather"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {editingCommentId === comment.id ? (
                            <div className="mt-4">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full px-4 py-2 bg-primary-800/40 rounded-lg text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-200/50 font-merriweather"
                                rows={3}
                                maxLength={1000}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditCommentText('');
                                  }}
                                  className="px-4 py-2 text-primary-300 hover:text-primary-100 transition-colors duration-200 font-merriweather"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditComment(comment.id)}
                                  className="px-4 py-2 bg-accent-900 text-primary-900 rounded-lg hover:bg-accent-800 transition-colors duration-200 font-merriweather"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-primary-200 font-merriweather">{comment.text}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.div>
  );
};

export default BlogPostView; 