import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, increment, setDoc, Timestamp, onSnapshot, collection, addDoc, query, orderBy, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { fetchBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../lib/contentful';
import { useParams } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import toast from 'react-hot-toast';

interface BlogPostProps {
  onBack: () => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    'from-orange-500/20 to-rose-500/20 text-orange-400 border-orange-500/30',
    'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const BlogPost = ({ onBack, setIsAuthModalOpen }: BlogPostProps) => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Rich Text rendering options
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="text-white font-extrabold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic text-gray-200">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline decoration-accent-900/30 underline-offset-4">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-white/10 px-2 py-1 rounded-md font-mono text-accent-400 text-sm border border-white/5">{text}</code>,
      [MARKS.SUPERSCRIPT]: (text: React.ReactNode) => <sup>{text}</sup>,
      [MARKS.SUBSCRIPT]: (text: React.ReactNode) => <sub>{text}</sub>,
      [MARKS.STRIKETHROUGH]: (text: React.ReactNode) => <s className="line-through opacity-50">{text}</s>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_: any, children: React.ReactNode) => <p className="mb-10 text-gray-300/90 leading-[1.8] font-merriweather">{children}</p>,
      [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => <h1 className="text-4xl sm:text-5xl font-playfair font-black text-white mt-20 mb-10 tracking-tight leading-tight uppercase">{children}</h1>,
      [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white mt-16 mb-8 tracking-tight uppercase">{children}</h2>,
      [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => <h3 className="text-2xl sm:text-3xl font-playfair font-semibold text-white mt-12 mb-6 tracking-tight italic">{children}</h3>,
      [BLOCKS.HEADING_4]: (_: any, children: React.ReactNode) => <h4 className="text-xl sm:text-2xl font-josefin font-bold text-accent-900 mt-10 mb-5 uppercase tracking-widest">{children}</h4>,
      [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => <ul className="list-none mb-10 space-y-4 font-merriweather">{children}</ul>,
      [BLOCKS.LIST_ITEM]: (_: any, children: React.ReactNode) => (
        <li className="flex items-start gap-4 text-gray-300 font-merriweather leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-900 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
          <span>{children}</span>
        </li>
      ),
      [BLOCKS.OL_LIST]: (_: any, children: React.ReactNode) => <ol className="list-decimal ml-6 mb-10 space-y-4 font-merriweather text-gray-300">{children}</ol>,
      [BLOCKS.HR]: () => <hr className="my-20 border-t border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.05)]" />,
      [BLOCKS.QUOTE]: (_: any, children: React.ReactNode) => (
        <blockquote className="relative my-20 pl-10 pr-6 py-6 border-l-2 border-accent-900 bg-white/[0.02] rounded-r-3xl group">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#050505] flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-900 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21H11.017V23H14.017V21ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C11.1216 16 12.017 16.8954 12.017 18V21C12.017 22.1046 11.1216 23 10.017 23H7.01697C5.9124 23 5.01697 22.1046 5.01697 21ZM5.01697 21H2.01697V23H5.01697V21Z" /></svg>
          </div>
          <div className="text-2xl sm:text-3xl font-playfair italic text-white leading-relaxed tracking-tight group-hover:text-accent-900 transition-colors duration-500">
            {children}
          </div>
        </blockquote>
      ),
      [BLOCKS.TABLE]: (_: any, children: React.ReactNode) => (
        <div className="overflow-x-auto my-12 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl">
          <table className="min-w-full divide-y divide-white/10">{children}</table>
        </div>
      ),
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a href={node.data.uri} className="text-accent-900 hover:text-white font-bold underline decoration-accent-900/40 underline-offset-4 transition-all duration-300" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, description } = node.data.target.fields;
        return (
          <figure className="my-20 group">
            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-white/5 p-1 relative">
              <img
                src={url}
                alt={description || 'Blog post image'}
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {description && (
              <figcaption className="mt-8 px-6 text-xs font-josefin font-medium text-gray-500 uppercase tracking-[0.2em] flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-white/10" />
                {description}
                <span className="w-8 h-px bg-white/10" />
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  // Load post data based on slug
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch the post from Contentful
        const posts = await fetchBlogPosts();
        const foundPost = posts.find(p => p.fields.slug === slug);

        if (!foundPost) {
          setError('Post not found');
          return;
        }

        setPost(foundPost);

        // Then, try to get the Firestore document (read-only operation)
        try {
          const postRef = doc(db, 'posts', foundPost.sys.id);
          const postDoc = await getDoc(postRef);

          if (postDoc.exists()) {
            // views count is handled by the real-time listener
          }
        } catch (firestoreErr) {
          console.warn('Non-critical Firestore error:', firestoreErr);
          // Don't set an error - the post can still be displayed without Firestore data
        }

        // Increment view count in a separate try-catch
        try {
          if (auth.currentUser) {
            const postRef = doc(db, 'posts', foundPost.sys.id);
            const postDoc = await getDoc(postRef);

            if (!postDoc.exists()) {
              await setDoc(postRef, {
                views: 1,
                likedBy: [],
                bookmarkedBy: [],
              });
            } else {
              await updateDoc(postRef, {
                views: increment(1)
              });
            }
          }
        } catch (viewErr) {
          console.warn('Non-critical view count error:', viewErr);
          // Don't set an error - the post can still be displayed without updating view count
        }
      } catch (err) {
        console.error('Error loading post:', err);
        if (err instanceof Error) {
          if (err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
            setError('Your ad blocker might be preventing some features. The post content will still be displayed, but interactions might be limited.');
          } else {
            setError('Error loading post data. Some features might be limited.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  // Real-time listeners for likes and comments
  useEffect(() => {
    if (!post) return;

    // Listen to likes
    const postRef = doc(db, 'posts', post.sys.id);
    const unsubscribePost = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLikesCount(data.likedBy?.length || 0);
        setHasLiked(data.likedBy?.includes(auth.currentUser?.uid) || false);
      }
    });

    // Listen to comments (threads)
    const commentsRef = collection(db, 'posts', post.sys.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [post, auth.currentUser]);

  const handleLove = async () => {
    if (!auth.currentUser) {
      toast.error('Sign in to leave a love');
      setIsAuthModalOpen(true);
      return;
    }

    if (!post) return;

    const postRef = doc(db, 'posts', post.sys.id);
    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(auth.currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(auth.currentUser.uid)
        });
      }
    } catch (err) {
      console.error('Error toggling love:', err);
      toast.error('Something went wrong');
    }
  };

  const handleThreadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('Sign in to join the thread');
      setIsAuthModalOpen(true);
      return;
    }

    if (!commentText.trim() || !post) return;

    setIsSubmittingComment(true);
    try {
      const commentsRef = collection(db, 'posts', post.sys.id, 'comments');
      const userName = auth.currentUser.displayName || 'Anonymous Architect';
      await addDoc(commentsRef, {
        userId: auth.currentUser.uid,
        userName: userName,
        userPhoto: '', // No longer using images
        text: commentText.trim(),
        createdAt: Timestamp.now()
      });
      setCommentText('');
      toast.success('Thought shared on the thread');
    } catch (err) {
      console.error('Error sharing thought:', err);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);

      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px] bg-[#050505]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-t-4 border-accent-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8 rounded-2xl bg-red-100/5 backdrop-blur-xl border border-red-500/20 max-w-2xl mx-auto my-20">
      <p className="font-bold text-lg mb-2">Error</p>
      <p className="text-gray-400 leading-relaxed">{error}</p>
    </div>;
  }

  if (!post) return <div className="text-gray-500 text-center py-20">Post not found</div>;

  const publishDate = new Date(post.fields.publishedDate || post.sys.createdAt);

  return (
    <div className="min-h-screen bg-[#050505] relative pb-24 overflow-x-hidden selection:bg-accent-900/30">
      {/* READING PROGRESS INDICATOR (BOTTOM LEFT) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-8 sm:bottom-12 sm:left-12 z-[90] flex items-center gap-4"
      >
        <div className="relative w-14 h-14 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
          {/* Animated Background Fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-accent-900/10"
            style={{ height: `${scrollProgress}%` }}
          />

          <div className="relative flex flex-col items-center justify-center">
            <span className="text-[14px] font-black text-white leading-none">
              {Math.round(scrollProgress)}<span className="text-[8px] text-accent-900 ml-0.5">%</span>
            </span>
            <span className="text-[6px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1 font-josefin">Read</span>
          </div>

          {/* Decorative Border Glow */}
          <div className="absolute inset-0 border border-accent-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-accent-900/[0.03] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/[0.03] rounded-full blur-[100px]" />
      </div>

      <article className="relative z-10 pt-24 sm:pt-32">
        {/* HERO SECTION */}
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-josefin font-bold text-accent-900 uppercase tracking-widest">
                {post.fields.tags?.[0] || 'Articles'}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="font-josefin text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                {format(publishDate, 'MMM dd, yyyy')}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-accent-900/10 border border-accent-900/20 rounded-full text-[10px] font-josefin font-bold text-accent-900 uppercase tracking-widest ml-2">
                6 min Read
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-black text-white leading-[1.1] mb-10 tracking-tight uppercase">
              {post.fields.title}
            </h1>

            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-accent-400 to-accent-600">
                <img src="/images/pH.webp" className="w-full h-full rounded-full object-cover border-2 border-black" alt={post.fields.author} />
              </div>
              <div className="text-left font-playfair">
                <p className="text-white font-bold text-sm tracking-wide">{post.fields.author}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest font-josefin">
                  <span>Editor-in-Chief</span>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        {/* COVER IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-8 mb-20"
        >
          <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5 aspect-[21/9]">
            {post.fields.coverImage && (
              <img
                src={post.fields.coverImage.fields.file.url}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt={post.fields.title}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row gap-16">
          {/* FLOATING ACTION BAR - DESKTOP */}
          <aside className="hidden lg:block w-32 shrink-0 h-fit sticky top-40">
            <div className="flex flex-col items-center gap-8 py-8 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-xl">
              <button
                onClick={handleLove}
                className="group flex flex-col items-center gap-2 transition-all"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-lg ${hasLiked
                  ? 'bg-red-500/20 border-red-500 text-red-500'
                  : 'bg-white/5 border-white/10 group-hover:bg-accent-900 group-hover:text-black group-hover:border-accent-900'
                  }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}>
                  {likesCount} {likesCount === 1 ? 'Love' : 'Loves'}
                </span>
              </button>
              <button
                onClick={() => document.getElementById('threads-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex flex-col items-center gap-2 transition-all"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-blue-600 transition-all active:scale-95 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{comments.length} Threads</span>
              </button>
              <button className="group flex flex-col items-center gap-2 transition-all" onClick={onBack}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all active:scale-95 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">List</span>
              </button>
            </div>
          </aside>

          {/* MAIN COLUMN */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1 max-w-3xl mx-auto lg:mx-0"
          >
            <div className="prose prose-invert prose-lg max-w-none 
              prose-p:text-gray-300 prose-p:font-merriweather prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
              prose-headings:font-oldenburg prose-headings:text-white prose-headings:tracking-tight prose-headings:mb-6
              prose-strong:text-accent-900 prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-accent-900 prose-blockquote:bg-accent-900/[0.02] prose-blockquote:p-10 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:text-white prose-blockquote:text-2xl prose-blockquote:font-playfair prose-blockquote:my-12
              prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-16
              prose-code:text-accent-900 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-li:text-gray-300 prose-li:font-merriweather prose-li:mb-4
            ">
              {documentToReactComponents(post.fields.content, options)}
            </div>

            {/* INTERACTIVE TAGS & FOOTER ACTIONS */}
            <div className="mt-20 py-12 border-y border-white/5 flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-josefin text-[10px] uppercase font-bold tracking-widest">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {post.fields.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:text-accent-900 hover:border-accent-900 transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="group flex items-center gap-2 px-6 py-3 bg-accent-900 text-black rounded-full font-josefin font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent-900/10 hover:shadow-accent-900/20 active:scale-95 transition-all">
                  Recommend Story
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 10.333z" /></svg>
                </button>
              </div>
            </div>

            {/* AUTHOR PREVIEW CARD */}
            <footer className="mt-20">
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-900/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-accent-900/10" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl p-1 bg-gradient-to-br from-white/20 to-transparent">
                      <img src="/images/pH.webp" className="w-full h-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0 rotate-[-3deg] group-hover:rotate-0" alt={post.fields.author} />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-accent-900 text-[10px] uppercase font-black tracking-widest mb-2 block font-josefin">Written by</span>
                    <h3 className="text-3xl font-playfair font-bold text-white mb-4 tracking-tight">{post.fields.author}</h3>
                    <p className="text-gray-400 font-merriweather leading-relaxed text-sm max-w-xl">
                      Suman is the Lead Architect and Editor-in-Chief focusing on interactive digital experiences. He brings a unique perspective of merging backend complexity with stunning frontend aesthetics.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                      <button className="text-white hover:text-accent-900 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 11-2.057-2.015 10 10 0 012.057 2.015zm-11.953 14.43a7 7 0 100-14 7 7 0 000 14z" /></svg>
                      </button>
                      <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-josefin font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">Follow for updates</button>
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            {/* THREADS (COMMENTS) SECTION */}
            <section id="threads-section" className="mt-40">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                <div>
                  <h2 className="text-5xl md:text-6xl font-playfair font-black text-white uppercase tracking-tighter leading-none mb-4">
                    The Threads
                  </h2>
                  <p className="font-josefin text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold">
                    Join the discourse & expand the narrative
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-accent-900/30 hidden md:block" />
                  <span className="px-5 py-2 bg-accent-900/10 border border-accent-900/20 rounded-full text-[11px] font-black text-accent-900 uppercase tracking-widest whitespace-nowrap">
                    {comments.length} Technical Thoughts
                  </span>
                </div>
              </div>

              {/* Thread Input - Refined & Focused */}
              <div className="mb-24">
                <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl transition-all duration-500">
                  <div className="bg-[#050505] rounded-[2.4rem] p-8 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-start gap-8">
                      {/* Identity Component */}
                      <div className="shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 font-josefin font-black text-xl shadow-lg transition-all duration-500 bg-gradient-to-br ${auth.currentUser ? getAvatarColor(auth.currentUser.displayName || 'user') : 'bg-white/5 border-white/10 text-gray-700'}`}>
                          {auth.currentUser ? getInitials(auth.currentUser.displayName || 'User') : '??'}
                        </div>
                      </div>

                      {/* Input Component */}
                      <form onSubmit={handleThreadSubmit} className="flex-1 w-full flex flex-col gap-6">
                        <div className="relative group/field">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={auth.currentUser ? "Share your technical insight..." : "Log in to join this discussion thread..."}
                            className="w-full bg-transparent border-0 focus:border-0 focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none focus-visible:outline-none text-white font-merriweather text-xl resize-none min-h-[120px] placeholder:text-gray-800 transition-all selection:bg-accent-900/30 shadow-none outline-none"
                            onFocus={() => !auth.currentUser && setIsAuthModalOpen(true)}
                          />
                          <div className="absolute bottom-0 right-0 py-2 text-[10px] font-josefin font-bold text-gray-700 uppercase tracking-widest pointer-events-none">
                            {commentText.length} / 500
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div>
                            {!auth.currentUser ? (
                              <button
                                type="button"
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-[10px] font-josefin font-black text-accent-900 uppercase tracking-widest hover:text-white transition-colors"
                              >
                                Authenticate to post →
                              </button>
                            ) : (
                              <span className="text-[10px] font-josefin font-bold text-gray-600 uppercase tracking-widest">
                                Posting as <span className="text-gray-300">{auth.currentUser.displayName || 'Architect'}</span>
                              </span>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingComment || !commentText.trim()}
                            className="px-10 py-4 bg-white text-black rounded-xl font-josefin font-black uppercase text-[10px] tracking-[0.2em] hover:bg-accent-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:hover:scale-100"
                          >
                            {isSubmittingComment ? 'Sending...' : 'Post Thought'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thread List - Premium Timeline Experience */}
              <div className="space-y-10 relative">
                {/* Visual Timeline element */}
                <div className="absolute left-[31px] top-10 bottom-10 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden sm:block" />

                {comments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-0 sm:pl-20 group/card"
                  >
                    {/* Node on timeline */}
                    <div className="absolute left-[26px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#050505] bg-white/10 group-hover/card:bg-accent-900 group-hover/card:scale-125 transition-all duration-300 hidden sm:block z-10" />

                    <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 shadow-sm hover:shadow-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center border font-josefin font-bold text-sm shadow-lg bg-gradient-to-br ${getAvatarColor(comment.userName)}`}>
                            {getInitials(comment.userName)}
                          </div>
                          <div>
                            <h4 className="font-playfair font-black text-white text-lg tracking-wide uppercase">{comment.userName}</h4>
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-accent-900/50" />
                              <span className="text-[9px] font-josefin font-bold text-gray-500 uppercase tracking-widest">Verified Reader</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-josefin font-light text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">
                          {comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'MMM dd, yyyy • HH:mm') : 'Just now'}
                        </span>
                      </div>

                      <div className="pl-0 sm:pl-2 pt-2">
                        <p className="font-merriweather text-gray-300 text-lg leading-[1.8] italic selection:bg-accent-900/40">
                          "{comment.text}"
                        </p>

                        <div className="mt-10 pt-6 border-t border-white/[0.03] flex items-center gap-8">
                          <button className="flex items-center gap-2 text-[10px] font-josefin font-bold text-gray-600 uppercase tracking-widest hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            Respect
                          </button>
                          <button className="flex items-center gap-2 text-[10px] font-josefin font-bold text-gray-600 uppercase tracking-widest hover:text-accent-900 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            Refute
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-900/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 group-hover:border-accent-900/30 transition-all duration-700">
                        <svg className="w-10 h-10 text-gray-700 group-hover:text-accent-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                      <p className="font-josefin font-black uppercase tracking-[0.4em] text-gray-600 text-xs mb-2">The Archive is Silent</p>
                      <p className="font-merriweather italic text-gray-700 text-sm">Be the first to leave your mark on this thread.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </div>
      </article>
      {/* SCROLL TO TOP BUTTON */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20
        }}
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 sm:bottom-12 sm:right-12 z-[90] w-14 h-14 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex flex-col items-center justify-center text-accent-900 shadow-2xl transition-all hover:bg-white hover:text-black group ${!showScrollTop ? 'pointer-events-none' : ''}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-[7px] font-black uppercase tracking-widest mt-1 group-hover:text-black font-josefin">Top</span>
      </motion.button>
    </div>
  );
};

export default BlogPost;