import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { fetchBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../lib/contentful';
import { useParams } from 'react-router-dom';

interface BlogPostProps {
  onBack: () => void;
}

const BlogPost = ({ onBack }: BlogPostProps) => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

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
            setViews(postDoc.data()?.views || 0);
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
                createdAt: Timestamp.now()
              });
              setViews(1);
            } else {
              await updateDoc(postRef, {
                views: increment(1)
              });
              setViews(prev => prev + 1);
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 rounded-lg bg-red-100 my-4">
      <p className="font-medium">Notice</p>
      <p>{error}</p>
      {error.includes('ad blocker') && (
        <p className="mt-2 text-sm">
          This site uses Firebase for enhanced features like comments and likes.
          The main content will still be displayed, but some features might be limited.
          To enable all features, either:
          <ul className="list-disc ml-6 mt-2">
            <li>Disable your ad blocker for this site</li>
            <li>Add *.googleapis.com to your ad blocker's whitelist</li>
          </ul>
        </p>
      )}
    </div>;
  }

  if (!post) {
    return <div className="text-gray-500">Post not found</div>;
  }

  return (
    <article className="prose prose-lg max-w-none">
      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:text-blue-600 transition-colors"
      >
        ← Back to Posts
      </button>
      <h1 className="text-3xl font-bold mb-4">{post.fields.title}</h1>
      <div className="flex items-center text-gray-600 mb-6">
        <span>{post.fields.author}</span>
        <span className="mx-2">•</span>
        <time>{new Date(post.fields.publishedDate || post.sys.createdAt).toLocaleDateString()}</time>
        {views > 0 && (
          <>
            <span className="mx-2">•</span>
            <span>{views} views</span>
          </>
        )}
      </div>
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.fields.content }} />
    </article>
  );
};

export default BlogPost; 