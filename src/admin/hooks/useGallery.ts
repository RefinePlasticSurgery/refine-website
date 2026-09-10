import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { GalleryImage, NewGalleryImage, UpdateGalleryImage } from '@/integrations/supabase/types';
import { queryKeys } from '@/lib/query-keys';
import { handleSupabaseDatabaseError } from '@/lib/errors';

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw handleSupabaseDatabaseError(error);
  return data ?? [];
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

/** Extracts the stored filename from a Supabase Storage public URL. */
function fileNameFromUrl(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const segments = url.pathname.split('/');
    return segments[segments.length - 1] ?? null;
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGallery = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.gallery.all,
    queryFn: fetchGalleryImages,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      imageData,
    }: {
      file: File;
      imageData: Omit<NewGalleryImage, 'image_url'>;
    }): Promise<GalleryImage> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);
      if (uploadError) throw handleSupabaseDatabaseError(uploadError);

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName);

      const row: NewGalleryImage = { ...imageData, image_url: urlData.publicUrl };
      const { data, error: insertError } = await supabase
        .from('gallery_images')
        .insert(row)
        .select()
        .single();
      if (insertError) throw handleSupabaseDatabaseError(insertError);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateGalleryImage;
    }): Promise<GalleryImage> => {
      const { data, error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw handleSupabaseDatabaseError(error);
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<GalleryImage[]>(queryKeys.gallery.all, (prev = []) =>
        prev.map(img => (img.id === updated.id ? updated : img))
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      // Fetch image URL first to also remove from Storage
      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('id', id)
        .single();
      if (fetchError) throw handleSupabaseDatabaseError(fetchError);

      if (imageData?.image_url) {
        const fileName = fileNameFromUrl(imageData.image_url);
        if (fileName) {
          // Best-effort — do not throw if storage delete fails
          await supabase.storage.from('gallery').remove([fileName]);
        }
      }

      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      if (deleteError) throw handleSupabaseDatabaseError(deleteError);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<GalleryImage[]>(queryKeys.gallery.all, (prev = []) =>
        prev.filter(img => img.id !== deletedId)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });

  return {
    images: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshImages: () => queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all }),
    uploadImage: (file: File, imageData: Omit<NewGalleryImage, 'image_url'>) =>
      uploadMutation.mutateAsync({ file, imageData }),
    updateImage: (id: string, updates: UpdateGalleryImage) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteImage: (id: string) => deleteMutation.mutateAsync(id),
  };
};
