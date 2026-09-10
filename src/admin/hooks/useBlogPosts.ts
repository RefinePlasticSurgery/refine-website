import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, NewBlogPost, UpdateBlogPost } from '@/integrations/supabase/types';
import { queryKeys } from '@/lib/query-keys';
import { handleSupabaseDatabaseError } from '@/lib/errors';

// ─── Slug generator ───────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw handleSupabaseDatabaseError(error);
  return data ?? [];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

type CreateBlogInput = Omit<NewBlogPost, 'slug' | 'created_at' | 'updated_at'>;

export const useBlogPosts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.blogPosts.all,
    queryFn: fetchBlogPosts,
  });

  const createMutation = useMutation({
    mutationFn: async (postData: CreateBlogInput): Promise<BlogPost> => {
      const now = new Date().toISOString();
      const row: NewBlogPost = {
        ...postData,
        slug: generateSlug(postData.title),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(row)
        .select()
        .single();
      if (error) throw handleSupabaseDatabaseError(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateBlogPost;
    }): Promise<BlogPost> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw handleSupabaseDatabaseError(error);
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<BlogPost[]>(queryKeys.blogPosts.all, (prev = []) =>
        prev.map(p => (p.id === updated.id ? updated : p))
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw handleSupabaseDatabaseError(error);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<BlogPost[]>(queryKeys.blogPosts.all, (prev = []) =>
        prev.filter(p => p.id !== deletedId)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all });
    },
  });

  return {
    posts: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshPosts: () => queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all }),
    createPost: createMutation.mutateAsync,
    updatePost: (id: string, updates: UpdateBlogPost) =>
      updateMutation.mutateAsync({ id, updates }),
    deletePost: (id: string) => deleteMutation.mutateAsync(id),
  };
};
