import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  BlogPost,
  NewBlogPost,
  UpdateBlogPost,
} from '@/integrations/supabase/types';

type CreateBlogInput = Omit<NewBlogPost, 'slug' | 'created_at' | 'updated_at'>;

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch blog posts';
      setError(message);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreateBlogInput) => {
    try {
      setError(null);

      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const row: NewBlogPost = {
        ...postData,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert(row)
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchPosts();

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create blog post';
      setError(message);
      console.error('Error creating blog post:', err);
      return null;
    }
  };

  const updatePost = async (id: string, updates: UpdateBlogPost) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchPosts();

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update blog post';
      setError(message);
      console.error('Error updating blog post:', err);
      return null;
    }
  };

  const deletePost = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchPosts();

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete blog post';
      setError(message);
      console.error('Error deleting blog post:', err);
      return false;
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refreshPosts,
  };
};
