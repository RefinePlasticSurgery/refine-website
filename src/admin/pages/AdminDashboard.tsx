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
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/admin/hooks/useAuth";
import { useDashboard, type DashboardStats } from "@/admin/hooks/useDashboard";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { cn } from "@/lib/utils";

type StatCardDef = {
  key: keyof Pick<
    DashboardStats,
    "totalAppointments" | "pendingAppointments" | "thisMonthAppointments" | "conversionRate"
  >;
  label: string;
  hint: string;
  icon: typeof Calendar;
  iconBg: string;
  iconColor: string;
  format?: (n: number) => string;
};

const STAT_CARDS: StatCardDef[] = [
  {
    key: "totalAppointments",
    label: "Total Appointments",
    hint: "All time",
    icon: Calendar,
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-500",
  },
  {
    key: "pendingAppointments",
    label: "Pending Review",
    hint: "Awaiting action",
    icon: Clock,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
  },
  {
    key: "thisMonthAppointments",
    label: "This Month",
    hint: "New requests",
    icon: TrendingUp,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
  },
  {
    key: "conversionRate",
    label: "Confirm Rate",
    hint: "Confirmed ÷ total",
    icon: BarChart3,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    format: (n) => `${n}%`,
  },
];

const QUICK_ACTIONS = [
  { label: "Appointments", href: "/admin/appointments", icon: Calendar, color: "text-sky-500" },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText, color: "text-emerald-500" },
  { label: "Gallery", href: "/admin/gallery", icon: Image, color: "text-amber-500" },
  { label: "Team", href: "/admin/team", icon: Users, color: "text-violet-500" },
] as const;

const ACTIVITY_BADGE: Record<string, { label: string; className: string }> = {
  appointment: { label: "Appt", className: "bg-sky-500/15 text-sky-700" },
  blog: { label: "Blog", className: "bg-emerald-500/15 text-emerald-700" },
  gallery: { label: "Media", className: "bg-amber-500/15 text-amber-700" },
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
);

function StatGrid({ stats, loading }: { stats: DashboardStats; loading: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CARDS.map(({ key, label, hint, icon: Icon, iconBg, iconColor, format: fmt }, i) =>
        loading ? (
          <Skeleton key={key} className="h-32 rounded-2xl" />
        ) : (
          <div
            key={key}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.18)]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900 animate-fade-up">
                  {fmt ? fmt(stats[key]) : stats[key]}
                </p>
                <p className="mt-1 text-xs text-slate-500">{hint}</p>
              </div>
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg)}>
                <Icon className={cn("h-5 w-5", iconColor)} />
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
    appointment: "bg-sky-500",
    blog: "bg-emerald-500",
    gallery: "bg-amber-500",
  };

  return (
    <div className="relative">
      <div className="absolute bottom-4 left-[19px] top-4 w-px bg-slate-100" />
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
            <Activity className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No activity yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Appointment requests and content will appear here.
            </p>
          </div>
        )
        : items.map((item, idx) => {
            const badge = ACTIVITY_BADGE[item.type] ?? {
              label: item.type,
              className: "bg-slate-100 text-slate-600",
            };
            return (
              <div key={`${item.id}-${idx}`} className="group relative flex gap-4 py-4">
                <div
                  className={cn(
                    "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white",
                    dotColor[item.type] ?? "bg-slate-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                    <p className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-primary">
                      {item.title}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                    {item.status && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-600">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { stats, recentActivity, loading, error, refreshData } = useDashboard();
  const navigate = useNavigate();

  const firstName = useMemo(
    () => (user?.email ? user.email.split("@")[0].replace(/[._-]/g, " ") : "there"),
    [user?.email]
  );

  return (
    <AdminLayout
      title="Dashboard"
      description="Your clinic at a glance."
      segment="Overview"
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={refreshData} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 md:inline-flex"
            onClick={() => navigate("/admin/analytics")}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(330_75%_45%)] via-[hsl(330_70%_38%)] to-[hsl(330_80%_22%)] p-6 text-white shadow-[0_20px_50px_-24px_hsl(330_75%_45%/0.7)] md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold capitalize md:text-3xl">
                Good {timeOfDay()}, {firstName}
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-white/80">
                {loading
                  ? "Loading your clinic summary…"
                  : `You have ${stats.pendingAppointments} pending appointment${stats.pendingAppointments !== 1 ? "s" : ""} waiting for review.`}
              </p>
            </div>
          </div>
          <Button
            className="shrink-0 gap-2 self-start bg-white text-primary hover:bg-white/90 md:self-center"
            onClick={() => navigate("/admin/appointments")}
          >
            Review appointments
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-900">Key metrics</h3>
            <p className="text-xs text-slate-500">Appointments pipeline · live data</p>
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

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-serif text-base font-semibold text-slate-900">Recent activity</h3>
                <p className="text-xs text-slate-500">Appointments, blog posts, gallery updates</p>
              </div>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
            <div className="px-6 py-2">
              <ActivityFeed items={recentActivity} loading={loading} />
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:col-span-5">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="font-serif text-base font-semibold text-slate-900">Quick actions</h3>
              <p className="text-xs text-slate-500">Jump to common tasks</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.href}
                  onClick={() => navigate(action.href)}
                  className="group/tile flex flex-col items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 py-5 text-center transition-all duration-200 hover:scale-[1.03] hover:border-primary/30 hover:bg-white hover:shadow-[0_12px_28px_-12px_hsl(330_75%_45%/0.45)]"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm",
                      action.color
                    )}
                  >
                    <action.icon className={cn("h-5 w-5", action.color)} />
                  </div>
                  <span className="text-xs font-medium text-slate-800">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5">
            <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Content snapshot
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="mx-auto h-8 w-12 rounded-md" />
                    <Skeleton className="mx-auto h-3 w-14 rounded-md" />
                  </div>
                ))
              ) : (
                <>
                  <div className="rounded-full bg-sky-500/10 px-2 py-3">
                    <p className="font-serif text-2xl font-bold text-slate-900">{stats.totalBlogPosts}</p>
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Blog posts</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-2 py-3">
                    <p className="font-serif text-2xl font-bold text-slate-900">{stats.publishedBlogPosts}</p>
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Published</p>
                  </div>
                  <div className="rounded-full bg-amber-500/10 px-2 py-3">
                    <p className="font-serif text-2xl font-bold text-slate-900">{stats.totalGalleryImages}</p>
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Gallery</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      <button
        onClick={() => navigate("/admin/analytics")}
        className="group relative mt-6 flex w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
            <BarChart3 className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-slate-900">Analytics</p>
            <p className="text-xs text-slate-500">
              {loading ? "—" : `${stats.conversionRate}% confirm rate · explore monthly trends`}
            </p>
          </div>
        </div>
        <div className="hidden items-end gap-1.5 sm:flex" aria-hidden>
          {[32, 48, 36, 62, 44, 70, 52].map((h, i) => (
            <span
              key={i}
              className="w-2 rounded-full bg-violet-400/40 transition group-hover:bg-violet-500/70"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-primary" />
      </button>
    </AdminLayout>
  );
};

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
