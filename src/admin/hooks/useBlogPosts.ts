import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';
import type { BlogPost, NewBlogPost, UpdateBlogPost } from '@/integrations/supabase/types';

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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: any) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Refresh the list
      await fetchPosts();
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post');
      console.error('Error creating blog post:', err);
      return null;
    }
  };

  const updatePost = async (id: string, updates: any) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Refresh the list
      await fetchPosts();
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post');
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
      
      // Refresh the list
      await fetchPosts();
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post');
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