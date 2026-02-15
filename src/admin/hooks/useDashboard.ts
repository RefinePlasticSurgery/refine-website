import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';
import type { Appointment, BlogPost, GalleryImage } from '@/integrations/supabase/types';

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  thisMonthAppointments: number;
  conversionRate: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalGalleryImages: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'blog' | 'gallery';
  title: string;
  timestamp: string;
  status?: string;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    thisMonthAppointments: 0,
    conversionRate: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
    totalGalleryImages: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch appointments data
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*') as { data: Appointment[] | null; error: any };
      
      if (apptError) throw apptError;
      
      // Fetch blog posts data
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('*') as { data: BlogPost[] | null; error: any };
      
      if (blogError) throw blogError;
      
      // Fetch gallery images data
      const { data: galleryImages, error: galleryError } = await supabase
        .from('gallery_images')
        .select('*') as { data: GalleryImage[] | null; error: any };
      
      if (galleryError) throw galleryError;
      
      // Calculate statistics
      const totalAppointments = appointments?.length || 0;
      const pendingAppointments = appointments?.filter(appt => appt.status === 'pending').length || 0;
      
      // Calculate this month's appointments
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const thisMonthAppointments = appointments?.filter(appt => 
        new Date(appt.created_at) >= thisMonth
      ).length || 0;
      
      // Calculate conversion rate (simplified)
      const totalInquiries = totalAppointments > 0 ? totalAppointments + 5 : 10; // Mock denominator
      const conversionRate = Math.round((totalAppointments / totalInquiries) * 100);
      
      const totalBlogPosts = blogPosts?.length || 0;
      const publishedBlogPosts = blogPosts?.filter(post => post.status === 'published').length || 0;
      const totalGalleryImages = galleryImages?.length || 0;
      
      // Set stats
      setStats({
        totalAppointments,
        pendingAppointments,
        thisMonthAppointments,
        conversionRate,
        totalBlogPosts,
        publishedBlogPosts,
        totalGalleryImages
      });
      
      // Generate recent activity from real data
      const activity: RecentActivity[] = [];
      
      // Add recent appointments
      if (appointments) {
        const recentAppointments = appointments
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .map(appt => ({
            id: appt.id,
            type: 'appointment' as const,
            title: `New appointment: ${appt.name}`,
            timestamp: appt.created_at,
            status: appt.status
          }));
        activity.push(...recentAppointments);
      }
      
      // Add recent blog posts
      if (blogPosts) {
        const recentBlogPosts = blogPosts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2)
          .map(post => ({
            id: post.id,
            type: 'blog' as const,
            title: `Blog post: ${post.title}`,
            timestamp: post.created_at,
            status: post.status
          }));
        activity.push(...recentBlogPosts);
      }
      
      // Add recent gallery images
      if (galleryImages) {
        const recentGallery = galleryImages
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2)
          .map(image => ({
            id: image.id,
            type: 'gallery' as const,
            title: `Gallery image: ${image.title || 'Untitled'}`,
            timestamp: image.created_at
          }));
        activity.push(...recentGallery);
      }
      
      // Sort all activity by timestamp and take top 5
      const sortedActivity = activity
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
      
      setRecentActivity(sortedActivity);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refreshData
  };
};