import { useMemo } from "react";
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Activity,
  FileText,
  Image,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/admin/hooks/useAuth";
import { useDashboard, type DashboardStats } from "@/admin/hooks/useDashboard";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { cn } from "@/lib/utils";

// ─── Stat card definitions ────────────────────────────────────────────────────

type StatCardDef = {
  key: keyof Pick<
    DashboardStats,
    'totalAppointments' | 'pendingAppointments' | 'thisMonthAppointments' | 'conversionRate'
  >;
  label: string;
  hint: string;
  icon: typeof Calendar;
  /** Tailwind classes for the icon container background */
  iconBg: string;
  /** Tailwind text colour for the icon */
  iconColor: string;
  /** Optional: renders value differently (e.g. percentage) */
  format?: (n: number) => string;
};

const STAT_CARDS: StatCardDef[] = [
  {
    key: 'totalAppointments',
    label: 'Total Appointments',
    hint: 'All time',
    icon: Calendar,
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-500',
  },
  {
    key: 'pendingAppointments',
    label: 'Pending Review',
    hint: 'Awaiting action',
    icon: Clock,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-500',
  },
  {
    key: 'thisMonthAppointments',
    label: 'This Month',
    hint: 'New requests',
    icon: TrendingUp,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
  },
  {
    key: 'conversionRate',
    label: 'Confirm Rate',
    hint: 'Confirmed ÷ total',
    icon: BarChart3,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-500',
    format: (n) => `${n}%`,
  },
];

// ─── Quick action tiles ───────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Appointments', href: '/admin/appointments', icon: Calendar,  color: 'text-sky-500'     },
  { label: 'Blog Posts',   href: '/admin/blog',         icon: FileText,  color: 'text-emerald-500' },
  { label: 'Gallery',      href: '/admin/gallery',      icon: Image,     color: 'text-amber-500'   },
  { label: 'Team',         href: '/admin/team',         icon: Users,     color: 'text-violet-500'  },
] as const;

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatGrid({ stats, loading }: { stats: DashboardStats; loading: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CARDS.map(({ key, label, hint, icon: Icon, iconBg, iconColor, format: fmt }) =>
        loading ? (
          <Skeleton key={key} className="h-28 rounded-2xl" />
        ) : (
          <div
            key={key}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Subtle top-edge accent */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground">
                  {fmt ? fmt(stats[key]) : stats[key]}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              </div>
              <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
                <Icon className={cn('h-5 w-5', iconColor)} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function ActivityFeed({
  items,
  loading,
}: {
  items: { id: string; type: string; title: string; timestamp: string; status?: string }[];
  loading: boolean;
}) {
  const dotColor: Record<string, string> = {
    appointment: 'bg-emerald-500',
    blog:        'bg-sky-500',
    gallery:     'bg-amber-500',
  };

  return (
    <div className="divide-y divide-border/40">
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
          ))
        : items.length === 0
        ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Appointment requests and content will appear here.
            </p>
          </div>
        )
        : items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="group flex gap-4 py-4">
            <div
              className={cn(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ring-background',
                dotColor[item.type] ?? 'bg-gray-400'
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {item.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                {item.status && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { stats, recentActivity, loading, error, refreshData } = useDashboard();
  const navigate = useNavigate();

  const firstName = useMemo(
    () => (user?.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : 'there'),
    [user?.email]
  );

  return (
    <AdminLayout
      title="Dashboard"
      description="Your clinic at a glance."
      segment="Overview"
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={refreshData}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 md:inline-flex"
            onClick={() => navigate('/admin/analytics')}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      }
    >

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Welcome hero ────────────────────────────────────────────── */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold capitalize text-foreground md:text-2xl">
                Good {timeOfDay()}, {firstName}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {loading
                  ? 'Loading your clinic summary…'
                  : `You have ${stats.pendingAppointments} pending appointment${stats.pendingAppointments !== 1 ? 's' : ''} waiting for review.`}
              </p>
            </div>
          </div>
          <Button
            className="shrink-0 gap-2 self-start md:self-center"
            onClick={() => navigate('/admin/appointments')}
          >
            Review appointments
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── KPI grid ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">Key metrics</h3>
            <p className="text-xs text-muted-foreground">Appointments pipeline · live data</p>
          </div>
          {!loading && stats.thisMonthAppointments > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {stats.thisMonthAppointments} new this month
            </div>
          )}
        </div>
        <StatGrid stats={stats} loading={loading} />
      </section>

      {/* ── Two-column lower section ──────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Recent activity */}
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h3 className="font-semibold text-foreground">Recent activity</h3>
                <p className="text-xs text-muted-foreground">
                  Appointments, blog posts, gallery updates
                </p>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="px-6 py-2">
              <ActivityFeed items={recentActivity} loading={loading} />
            </div>
          </div>
        </section>

        {/* Right column */}
        <aside className="flex flex-col gap-6 lg:col-span-5">

          {/* Quick actions */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 px-6 py-4">
              <h3 className="font-semibold text-foreground">Quick actions</h3>
              <p className="text-xs text-muted-foreground">Jump to common tasks</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.href}
                  onClick={() => navigate(action.href)}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-border/50 bg-background/50 py-5 text-center transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition group-hover:bg-primary/10', action.color)}>
                    <action.icon className={cn('h-5 w-5', action.color)} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content snapshot */}
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-5">
            <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Content snapshot
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="mx-auto h-8 w-12 rounded-md" />
                    <Skeleton className="mx-auto h-3 w-14 rounded-md" />
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <p className="font-serif text-2xl font-bold text-foreground">{stats.totalBlogPosts}</p>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Blog posts</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-bold text-foreground">{stats.publishedBlogPosts}</p>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Published</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-bold text-foreground">{stats.totalGalleryImages}</p>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">Gallery</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mini analytics link */}
          <button
            onClick={() => navigate('/admin/analytics')}
            className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <BarChart3 className="h-5 w-5 text-violet-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Analytics</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? '—' : `${stats.conversionRate}% confirm rate`}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
          </button>
        </aside>
      </div>
    </AdminLayout>
  );
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
