import { useMemo, useState } from "react";
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
import { Calendar, TrendingUp, Users } from "lucide-react";
import { AdminLayout } from "@/admin/components/AdminLayout";

function KpiRing({
  value,
  max = 100,
  color,
}: {
  value: number;
  max?: number;
  color: string;
}) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14 -rotate-90">
      <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" className="text-slate-100" strokeWidth="7" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
      />
    </svg>
  );
}

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const { data, loading, error } = useAnalytics();

  const { appointmentData, procedureData, statusData, summary } = data;

  const monthsVisible =
    timeRange === "1month" ? 1 : timeRange === "3months" ? 3 : timeRange === "1year" ? 12 : 6;

  const filteredAppointmentData = useMemo(() => {
    if (appointmentData.length <= monthsVisible) return appointmentData;
    return appointmentData.slice(-monthsVisible);
  }, [appointmentData, monthsVisible]);

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
            className="h-9 rounded-full border border-input bg-white px-3 text-sm"
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
    >
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Appointments</p>
            <p className="mt-2 font-serif text-3xl font-bold">{totalAppointments}</p>
            <p className="mt-1 text-xs text-emerald-600">Pipeline total</p>
          </div>
          <KpiRing value={Math.min(totalAppointments, 40)} max={40} color="#0ea5e9" />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue (est.)</p>
            <p className="mt-2 font-serif text-xl font-bold tabular-nums">
              TZS {totalRevenue.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">Illustrative</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg / active month</p>
            <p className="mt-2 font-serif text-3xl font-bold">{avgMonthlyAppointments}</p>
            <p className="mt-1 text-xs text-slate-500">Based on chart months</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversion</p>
            <p className="mt-2 font-serif text-3xl font-bold">{conversionRate}%</p>
            <p className="mt-1 text-xs text-slate-500">Confirmed / total</p>
          </div>
          <KpiRing value={conversionRate} color="#8b5cf6" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif font-semibold text-slate-900">Appointments by month</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredAppointmentData}>
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

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif font-semibold text-slate-900">Revenue trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredAppointmentData}>
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
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif font-semibold text-slate-900">Procedure mix</h3>
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

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif font-semibold text-slate-900">Status mix</h3>
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
