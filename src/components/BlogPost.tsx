import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { fetchBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../lib/contentful';
import { useParams } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
interface BlogPostProps {
  onBack: () => void;
}

const BlogPost = ({ onBack }: BlogPostProps) => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  // Rich Text rendering options
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => <code>{text}</code>,
      [MARKS.SUPERSCRIPT]: (text: React.ReactNode) => <sup>{text}</sup>,
      [MARKS.SUBSCRIPT]: (text: React.ReactNode) => <sub>{text}</sub>,
      [MARKS.STRIKETHROUGH]: (text: React.ReactNode) => <s>{text}</s>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_: any, children: React.ReactNode) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
      [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
      [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => <h3 className="text-2xl font-bold mb-3">{children}</h3>,
      [BLOCKS.HEADING_4]: (_: any, children: React.ReactNode) => <h4 className="text-xl font-bold mb-2">{children}</h4>,
      [BLOCKS.HEADING_5]: (_: any, children: React.ReactNode) => <h5 className="text-lg font-bold mb-2">{children}</h5>,
      [BLOCKS.HEADING_6]: (_: any, children: React.ReactNode) => <h6 className="text-base font-bold mb-2">{children}</h6>,
      [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (_: any, children: React.ReactNode) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
      [BLOCKS.HR]: () => <hr className="my-8 border-t border-gray-300" />,
      [BLOCKS.QUOTE]: (_: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.TABLE]: (_: any, children: React.ReactNode) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-200">{children}</table>
        </div>
      ),
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a href={node.data.uri} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, description } = node.data.target.fields;
        return (
          <img
            src={url}
            alt={description || 'Blog post image'}
            className="my-4 rounded-lg max-w-full h-auto"
          />
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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-900"></div>
      </div>
    );
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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <button
        onClick={onBack}
        className="mb-6 text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Posts
      </button>

      {/* Cover Image */}
      {post.fields.coverImage && (
        <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
          <img
            src={post.fields.coverImage.fields.file.url}
            alt={post.fields.coverImage.fields.title || post.fields.title}
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
          />
        </div>
      )}

      {/* Title and Meta Information */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {post.fields.title}
        </h1>
        <div className="flex flex-wrap items-center text-gray-600 gap-2 sm:gap-3 mb-4 text-sm sm:text-base">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
              <img
                src="/images/pH.webp"
                alt={post.fields.author}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{post.fields.author}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <time dateTime={post.fields.publishedDate}>
            {new Date(post.fields.publishedDate || post.sys.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          {views > 0 && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {views} views
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {post.fields.tags && post.fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {post.fields.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        {documentToReactComponents(post.fields.content, options)}
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 mr-3 sm:mr-4">
              <img
                src="/images/pH.webp"
                alt={post.fields.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base text-gray-600">Written by</h3>
              <p className="text-base sm:text-lg font-semibold">{post.fields.author}</p>
            </div>
          </div>
          <div className="text-gray-600">
            <p className="text-sm">Published on</p>
            <time dateTime={post.fields.publishedDate} className="font-medium text-sm sm:text-base">
              {new Date(post.fields.publishedDate || post.sys.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogPost; 