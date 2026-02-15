import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';

export const useGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message || 'Failed to fetch gallery images');
      console.error('Error fetching gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file, imageData) => {
    try {
      setError(null);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // Insert record
      const { data, error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          ...imageData,
          image_url: publicUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Refresh the list
      await fetchImages();
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      console.error('Error uploading image:', err);
      return null;
    }
  };

  const updateImage = async (id, updates) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Refresh the list
      await fetchImages();
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update image');
      console.error('Error updating image:', err);
      return null;
    }
  };

  const deleteImage = async (id) => {
    try {
      setError(null);
      
      // Get image data to delete file
      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      if (imageData?.image_url) {
        const fileName = imageData.image_url.split('/').pop();
        await supabase.storage
          .from('gallery')
          .remove([fileName]);
      }

      // Delete record
      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // Refresh the list
      await fetchImages();
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete image');
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