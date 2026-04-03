import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/admin/hooks/useAnalytics";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, Users, CalendarDays } from "lucide-react";
import { AdminLayout } from "@/admin/components/AdminLayout";

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const { data, loading, error } = useAnalytics();

  const { appointmentData, procedureData, statusData, summary } = data;
  const { totalAppointments, totalRevenue, avgMonthlyAppointments, conversionRate } = summary;

  if (loading) {
    return (
      <AdminLayout
        title="Analytics"
        description="Visualize trends from your appointment data."
        segment="Analytics"
      >
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Analytics"
      description="Charts derived from stored appointments (revenue uses illustrative multipliers)."
      segment="Analytics"
      headerActions={
        <>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Time range"
          >
            <option value="1month">Last 30 days</option>
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year</option>
          </select>
          <Button variant="outline" size="sm" className="gap-2" type="button" disabled>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </>
      }
      contentClassName="!px-0 !py-0 lg:!px-0 lg:!py-0"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="border-b border-border/60 bg-muted/30 px-4 py-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Appointments
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">{totalAppointments}</p>
                <p className="mt-1 text-xs text-emerald-600">Pipeline total</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Revenue (est.)
                </p>
                <p className="mt-2 font-serif text-2xl font-bold tabular-nums">
                  TZS {totalRevenue.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Illustrative</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Avg / active month
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">{avgMonthlyAppointments}</p>
                <p className="mt-1 text-xs text-muted-foreground">Based on chart months</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Conversion
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">{conversionRate}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Confirmed / total</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Appointments by month</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    formatter={(value, name) => [
                      name === "appointments"
                        ? `${value} appointments`
                        : `TZS ${Number(value).toLocaleString()}`,
                      name === "appointments" ? "Appointments" : "Revenue",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="appointments" fill="hsl(var(--primary))" name="Appointments" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Revenue trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    formatter={(value) => [`TZS ${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(142 76% 36%)"
                    name="Revenue"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Procedure mix</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={procedureData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={88}
                    dataKey="value"
                  >
                    {procedureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Status mix</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={88}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
