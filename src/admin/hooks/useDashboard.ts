import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query-keys';
import { handleSupabaseDatabaseError } from '@/lib/errors';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  thisMonthAppointments: number;
  /** confirmed / total × 100, rounded */
  conversionRate: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalGalleryImages: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'appointment' | 'blog' | 'gallery';
  title: string;
  timestamp: string;
  status?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivityItem[];
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * ✅ PERF FIX: No longer fetches every row from every table.
 * Uses server-side counts for stats and limit(5) for recent activity.
 */
async function fetchDashboardData(): Promise<DashboardData> {
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const results = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonthStart.toISOString()),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('blog_posts')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('gallery_images')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const failed = results.find((r) => r.error);
  if (failed?.error) throw handleSupabaseDatabaseError(failed.error);

  const [
    { count: totalAppointments },
    { count: pendingAppointments },
    { count: confirmedAppointments },
    { count: thisMonthAppointments },
    { count: totalBlogPosts },
    { count: publishedBlogPosts },
    { count: totalGalleryImages },
    { data: recentAppts },
    { data: recentPosts },
    { data: recentImages },
  ] = results;

  const total = totalAppointments ?? 0;
  const confirmed = confirmedAppointments ?? 0;
  const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  const stats: DashboardStats = {
    totalAppointments: total,
    pendingAppointments: pendingAppointments ?? 0,
    confirmedAppointments: confirmed,
    thisMonthAppointments: thisMonthAppointments ?? 0,
    conversionRate,
    totalBlogPosts: totalBlogPosts ?? 0,
    publishedBlogPosts: publishedBlogPosts ?? 0,
    totalGalleryImages: totalGalleryImages ?? 0,
  };

  const activity: RecentActivityItem[] = [
    ...(recentAppts ?? []).map(a => ({
      id: a.id,
      type: 'appointment' as const,
      title: `New appointment: ${a.name ?? 'Unknown'}`,
      timestamp: a.created_at,
      status: a.status ?? undefined,
    })),
    ...(recentPosts ?? []).map(p => ({
      id: p.id,
      type: 'blog' as const,
      title: `Blog post: ${p.title ?? 'Untitled'}`,
      timestamp: p.created_at,
      status: p.status ?? undefined,
    })),
    ...(recentImages ?? []).map(img => ({
      id: img.id,
      type: 'gallery' as const,
      title: `Gallery image: ${img.title ?? 'Untitled'}`,
      timestamp: img.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return { stats, recentActivity: activity };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useDashboard = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: fetchDashboardData,
    // Dashboard stats can be slightly stale; 2-min stale time is fine
    staleTime: 1000 * 60 * 2,
  });

  const emptyStats: DashboardStats = {
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    thisMonthAppointments: 0,
    conversionRate: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
    totalGalleryImages: 0,
  };

  return {
    stats: query.data?.stats ?? emptyStats,
    recentActivity: query.data?.recentActivity ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshData: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
  };
};