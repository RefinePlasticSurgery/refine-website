import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  GalleryImage,
  NewGalleryImage,
  UpdateGalleryImage,
} from '@/integrations/supabase/types';

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setImages(data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch gallery images';
      setError(message);
      console.error('Error fetching gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (
    file: File,
    imageData: Omit<NewGalleryImage, 'image_url'>
  ) => {
    try {
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      const row: NewGalleryImage = {
        ...imageData,
        image_url: publicUrl,
      };

      const { data, error: insertError } = await supabase
        .from('gallery_images')
        .insert(row)
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchImages();

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const updateImage = async (id: string, updates: UpdateGalleryImage) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchImages();

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update image';
      setError(message);
      console.error('Error updating image:', err);
      return null;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      setError(null);

      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (imageData?.image_url) {
        const fileName = imageData.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('gallery').remove([fileName]);
        }
      }

      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchImages();

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete image';
      setError(message);
      console.error('Error deleting image:', err);
      return false;
    }
  };

  const refreshImages = async () => {
    await fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    error,
    uploadImage,
    updateImage,
    deleteImage,
    refreshImages,
  };
};
