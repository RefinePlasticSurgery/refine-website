import {
  LayoutDashboard,
  Calendar,
  FileText,
  Image,
  BarChart3,
  Users,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/admin/hooks/useAuth";
import { useDashboard, type DashboardStats } from "@/admin/hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { cn } from "@/lib/utils";

interface OverviewStatsProps {
  stats: DashboardStats;
  loading: boolean;
}

const statCards: {
  key: keyof Pick<
    DashboardStats,
    | "totalAppointments"
    | "pendingAppointments"
    | "thisMonthAppointments"
    | "conversionRate"
  >;
  label: string;
  hint: string;
  icon: typeof Calendar;
  accent: string;
}[] = [
  {
    key: "totalAppointments",
    label: "Total appointments",
    hint: "All time",
    icon: Calendar,
    accent: "from-sky-500/20 to-blue-600/5",
  },
  {
    key: "pendingAppointments",
    label: "Pending review",
    hint: "Needs attention",
    icon: Users,
    accent: "from-amber-500/20 to-orange-600/5",
  },
  {
    key: "thisMonthAppointments",
    label: "This month",
    hint: "New requests",
    icon: TrendingUp,
    accent: "from-emerald-500/20 to-teal-600/5",
  },
  {
    key: "conversionRate",
    label: "Confirmation rate",
    hint: "Confirmed / total",
    icon: BarChart3,
    accent: "from-violet-500/20 to-fuchsia-600/5",
  },
];

function OverviewStats({ stats, loading }: OverviewStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border/60 bg-card/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map(({ key, label, hint, icon: Icon, accent }) => {
        const raw = stats[key];
        const value =
          key === "conversionRate" ? `${raw}%` : String(raw);
        return (
          <div
            key={key}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition hover:shadow-md",
              "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-90",
              accent
            )}
          >
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground">
                  {value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-background/80 shadow-inner">
                <Icon className="h-6 w-6 text-primary" />
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
  const { stats, recentActivity, loading, error } = useDashboard();
  const navigate = useNavigate();

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <AdminLayout
      title="Dashboard"
      description="Performance snapshot and latest activity across your site."
      segment="Overview"
      headerActions={
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 md:inline-flex"
          onClick={() => navigate("/admin/analytics")}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground md:text-2xl">
              Welcome back, {firstName}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Track enquiries, publish content, and keep the gallery up to date — all in one
              place.
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 gap-2 self-start md:self-center"
          onClick={() => navigate("/admin/appointments")}
        >
          View appointments
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Key metrics
            </h3>
            <p className="text-sm text-muted-foreground">
              Appointments pipeline and engagement signals
            </p>
          </div>
        </div>
        <OverviewStats stats={stats} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h3 className="font-semibold text-foreground">Recent activity</h3>
                <p className="text-xs text-muted-foreground">
                  Latest updates from appointments, blog, and gallery
                </p>
              </div>
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="p-6">
              <div className="space-y-0">
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-b border-border/40 py-4 last:border-0"
                    >
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 max-w-[75%] animate-pulse rounded bg-muted" />
                        <div className="h-3 max-w-[45%] animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div
                      key={`${activity.id}-${idx}`}
                      className="group flex gap-4 border-b border-border/40 py-4 last:border-0"
                    >
                      <div
                        className={cn(
                          "mt-1 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-background",
                          activity.type === "appointment" && "bg-emerald-500",
                          activity.type === "blog" && "bg-sky-500",
                          activity.type === "gallery" && "bg-amber-500"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), "MMM d, yyyy · h:mm a")}
                          {activity.status && (
                            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 capitalize text-[10px] font-medium text-muted-foreground">
                              {activity.status}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      No activity yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      New appointments and content will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-5">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 px-6 py-4">
              <h3 className="font-semibold text-foreground">Quick actions</h3>
              <p className="text-xs text-muted-foreground">Jump to common tasks</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-6">
              {[
                {
                  label: "Appointments",
                  href: "/admin/appointments",
                  icon: Calendar,
                },
                { label: "Blog", href: "/admin/blog", icon: FileText },
                { label: "Gallery", href: "/admin/gallery", icon: Image },
                {
                  label: "Analytics",
                  href: "/admin/analytics",
                  icon: BarChart3,
                },
              ].map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="h-auto flex-col gap-2 rounded-xl border-border/60 py-6 text-center hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => navigate(action.href)}
                >
                  <action.icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Content snapshot
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {loading ? "—" : stats.totalBlogPosts}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">Blog posts</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {loading ? "—" : stats.publishedBlogPosts}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">Published</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {loading ? "—" : stats.totalGalleryImages}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">Gallery</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};
