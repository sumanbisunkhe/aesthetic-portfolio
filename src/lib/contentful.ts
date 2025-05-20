import { createClient } from 'contentful';

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error('Contentful space ID and access token are required');
}

export const client = createClient({
  space,
  accessToken,
});

export interface BlogPost {
  sys: {
    id: string;
    createdAt: string;
  };
  fields: {
    title: string;
    slug: string;
    content: any;
    author: string;
    publishedDate?: string;
    coverImage: {
      sys: {
        id: string;
        type: string;
        linkType: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
          contentType: string;
          details: {
            size: number;
            image: {
              width: number;
              height: number;
            };
          };
        };
      };
    };
    tags?: string[];
  };
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching blog posts...');
    console.log('Space ID:', import.meta.env.VITE_CONTENTFUL_SPACE_ID);
    console.log('Access Token:', import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN ? 'Present' : 'Missing');
    
    const response = await client.getEntries({
      content_type: 'blogPost',
      order: ['-sys.createdAt'],
      include: 2, // This will include linked assets up to 2 levels deep
    });
    
    console.log('Contentful Response:', response);
    console.log('Blog Posts:', response.items);
    
    // Transform the response to include the full URL for cover images
    const posts = response.items.map((item: any) => {
      const post = item as unknown as BlogPost;
      if (post.fields.coverImage?.fields?.file?.url) {
        // Add the Contentful CDN URL prefix
        post.fields.coverImage.fields.file.url = `https:${post.fields.coverImage.fields.file.url}`;
      }
      return post;
    });
    
    console.log('Processed Blog Posts:', posts);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
} 