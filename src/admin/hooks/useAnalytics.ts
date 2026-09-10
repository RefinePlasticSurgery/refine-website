import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment } from '@/integrations/supabase/types';
import { queryKeys } from '@/lib/query-keys';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlyRow {
  month: string;
  appointments: number;
  /** Estimated revenue in TZS (2M per appointment — illustrative) */
  revenue: number;
}

interface AnalyticsData {
  appointmentData: MonthlyRow[];
  procedureData: { name: string; value: number; color: string }[];
  statusData: { name: string; value: number; color: string }[];
  summary: {
    totalAppointments: number;
    totalRevenue: number;
    avgMonthlyAppointments: number;
    /** ✅ FIX: now consistent — confirmed / total × 100 */
    conversionRate: number;
  };
}

// ─── Processing helpers ───────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PROCEDURE_COLORS = ['#8884d8','#82ca9d','#ffc658','#ff8042','#0088fe','#ff6b6b','#4ecdc4'];
const STATUS_COLORS: Record<string, string> = {
  pending:   '#ffa726',
  confirmed: '#66bb6a',
  completed: '#29b6f6',
  cancelled: '#ef5350',
};

function processAppointmentData(appointments: Appointment[]): MonthlyRow[] {
  const currentYear = new Date().getFullYear();
  return MONTH_NAMES
    .map((month, index) => {
      const count = appointments.filter(a => {
        const d = new Date(a.created_at);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      }).length;
      return { month, appointments: count, revenue: count * 2_000_000 };
    })
    .filter(row => row.appointments > 0);
}

function processProcedureData(appointments: Appointment[]) {
  const counts: Record<string, number> = {};
  appointments.forEach(a => {
    const key = a.procedure || 'Other';
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    color: PROCEDURE_COLORS[i % PROCEDURE_COLORS.length],
  }));
}

function processStatusData(appointments: Appointment[]) {
  const counts: Record<string, number> = {};
  appointments.forEach(a => {
    const key = a.status ?? 'pending';
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: STATUS_COLORS[name] ?? '#9e9e9e',
  }));
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('id, procedure, status, created_at');
  if (error) throw error;

  const appts = appointments ?? [];
  const appointmentData = processAppointmentData(appts as Appointment[]);
  const procedureData = processProcedureData(appts as Appointment[]);
  const statusData = processStatusData(appts as Appointment[]);

  const totalAppointments = appts.length;
  const confirmedCount = appts.filter(a => a.status === 'confirmed').length;
  // ✅ FIXED: same formula as useDashboard — confirmed / total
  const conversionRate = totalAppointments > 0
    ? Math.round((confirmedCount / totalAppointments) * 100)
    : 0;

  const totalRevenue = appointmentData.reduce((sum, row) => sum + row.revenue, 0);
  const avgMonthlyAppointments = appointmentData.length > 0
    ? Math.round(totalAppointments / appointmentData.length)
    : 0;

  return {
    appointmentData,
    procedureData,
    statusData,
    summary: { totalAppointments, totalRevenue, avgMonthlyAppointments, conversionRate },
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.analytics.all,
    queryFn: fetchAnalyticsData,
    staleTime: 1000 * 60 * 5, // analytics can be 5 min stale
  });

  const empty: AnalyticsData = {
    appointmentData: [],
    procedureData: [],
    statusData: [],
    summary: { totalAppointments: 0, totalRevenue: 0, avgMonthlyAppointments: 0, conversionRate: 0 },
  };

  return {
    data: query.data ?? empty,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshData: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
  };
};