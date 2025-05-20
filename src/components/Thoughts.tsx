import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { fetchBlogPosts, type BlogPost } from '../lib/contentful';
import { BookOpenIcon, ChatBubbleLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Timestamp;
  postId: string;
}

const Thoughts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    if (!selectedPost) return;

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', selectedPost),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];

      setComments(prev => ({
        ...prev,
        [selectedPost]: postComments
      }));
    });

    return () => unsubscribe();
  }, [selectedPost]);

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

  return (
    <section id="thoughts" className="min-h-screen py-24 bg-gradient-to-b from-black to-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block">
            My Thoughts
          </span>
          <h2 className="text-4xl md:text-5xl font-oldenburg font-bold text-white mb-6">
            Tech <span className="text-accent-900">Blog</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto mb-8 rounded-full"></div>
          <p className="text-primary-200 font-josefin">
            Sharing my insights and experiences in software development
          </p>
        </motion.div>

        {/* Blog Posts */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-900"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.article
                key={post.sys.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-primary-800/50 rounded-2xl overflow-hidden border border-primary-700/30 hover:border-accent-900/30 transition-all duration-300 group"
              >
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.fields.coverImage?.fields?.file?.url || '/fallback-image.jpg'}
                    alt={post.fields.coverImage?.fields?.title || post.fields.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.src = '/fallback-image.jpg';
                    }}
                    onLoad={() => {
                      console.log('Cover Image Data:', {
                        url: post.fields.coverImage?.fields?.file?.url,
                        title: post.fields.coverImage?.fields?.title,
                        postTitle: post.fields.title
                      });
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    {/* No avatar, just author name */}
                    <div className="w-10 h-10 rounded-full border-2 border-accent-900/20 bg-primary-700 flex items-center justify-center text-primary-200 font-josefin text-lg">
                      {post.fields.author?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="text-primary-200 font-josefin text-sm">{post.fields.author || 'Unknown Author'}</h4>
                      <time className="text-primary-400 text-xs">
                        {format(new Date(post.fields.publishedDate || post.sys.createdAt), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>

                  <h3 className="text-xl font-josefin text-white group-hover:text-accent-900 transition-colors duration-300">
                    {post.fields.title}
                  </h3>

                  {/* Render rich text content preview */}
                  <div className="text-primary-300 text-sm line-clamp-3 font-josefin">
                    {post.fields.content ? (
                      <div className="prose prose-invert max-w-none">
                        {documentToReactComponents(post.fields.content)}
                      </div>
                    ) : null}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.fields.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-700/30 rounded-full text-xs text-primary-200 font-josefin flex items-center gap-1"
                      >
                        <TagIcon className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-700/30">
                    <button
                      onClick={() => setSelectedPost(selectedPost === post.sys.id ? null : post.sys.id)}
                      className="flex items-center gap-2 text-primary-200 hover:text-accent-900 transition-colors duration-200 text-sm font-josefin"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      {comments[post.sys.id]?.length || 0} Comments
                    </button>
                    <button className="flex items-center gap-2 text-primary-200 hover:text-accent-900 transition-colors duration-200 text-sm font-josefin">
                      <BookOpenIcon className="w-4 h-4" />
                      Read More
                    </button>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === post.sys.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-primary-700/30"
                    >
                      {/* Comment Form */}
                      {auth.currentUser && (
                        <div className="flex gap-4 mb-6">
                          <img
                            src={auth.currentUser.photoURL || ''}
                            alt={auth.currentUser.displayName || ''}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full px-4 py-2 bg-primary-700/30 rounded-lg text-primary-200 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900/50 font-josefin text-sm"
                              rows={3}
                            />
                            <button
                              onClick={() => handleAddComment(post.sys.id)}
                              className="mt-2 px-4 py-2 bg-accent-900 text-primary-900 rounded-lg hover:bg-accent-800 transition-colors duration-200 text-sm font-josefin"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-4">
                        {comments[post.sys.id]?.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <img
                              src={comment.userAvatar}
                              alt={comment.userName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-primary-200 font-josefin text-sm">{comment.userName}</span>
                                <time className="text-primary-400 text-xs">
                                  {format(comment.createdAt.toDate(), 'MMM d, yyyy')}
                                </time>
                              </div>
                              <p className="text-primary-300 text-sm mt-1 font-josefin">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
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