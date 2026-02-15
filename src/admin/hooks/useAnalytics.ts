import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';
import type { Appointment } from '@/integrations/supabase/types';

interface AnalyticsData {
  appointmentData: {
    month: string;
    appointments: number;
    revenue: number;
  }[];
  procedureData: {
    name: string;
    value: number;
    color: string;
  }[];
  statusData: {
    name: string;
    value: number;
    color: string;
  }[];
  summary: {
    totalAppointments: number;
    totalRevenue: number;
    avgMonthlyAppointments: number;
    conversionRate: number;
  };
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    appointmentData: [],
    procedureData: [],
    statusData: [],
    summary: {
      totalAppointments: 0,
      totalRevenue: 0,
      avgMonthlyAppointments: 0,
      conversionRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real appointment data
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*') as { data: Appointment[] | null; error: any };
      
      if (apptError) throw apptError;
      
      // Process appointment data by month
      const appointmentData = processAppointmentData(appointments || []);
      
      // Process procedure distribution
      const procedureData = processProcedureData(appointments || []);
      
      // Process status distribution
      const statusData = processStatusData(appointments || []);
      
      // Calculate summary statistics
      const summary = calculateSummary(appointments || [], appointmentData);
      
      setData({
        appointmentData,
        procedureData,
        statusData,
        summary
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Process appointments by month
  const processAppointmentData = (appointments: Appointment[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthAppointments = appointments.filter(appt => {
        const apptDate = new Date(appt.created_at);
        return apptDate.getMonth() === index && apptDate.getFullYear() === currentYear;
      });
      
      // Mock revenue calculation (in real scenario, you'd have actual pricing)
      const revenue = monthAppointments.length * 2000000; // 2M TZS per appointment
      
      return {
        month,
        appointments: monthAppointments.length,
        revenue
      };
    }).filter(item => item.appointments > 0 || item.revenue > 0);
  };

  // Process procedure distribution
  const processProcedureData = (appointments: Appointment[]) => {
    const procedureCount: Record<string, number> = {};
    
    appointments.forEach(appt => {
      const procedure = appt.procedure || 'Other';
      procedureCount[procedure] = (procedureCount[procedure] || 0) + 1;
    });
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#ff6b6b', '#4ecdc4'];
    let colorIndex = 0;
    
    return Object.entries(procedureCount).map(([name, value]) => ({
      name,
      value,
      color: colors[colorIndex++ % colors.length]
    }));
  };

  // Process status distribution
  const processStatusData = (appointments: Appointment[]) => {
    const statusCount: Record<string, number> = {};
    
    appointments.forEach(appt => {
      const status = appt.status || 'pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const statusColors: Record<string, string> = {
      pending: '#ffa726',
      confirmed: '#66bb6a',
      completed: '#29b6f6',
      cancelled: '#ef5350'
    };
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: statusColors[name] || '#9e9e9e'
    }));
  };

  // Calculate summary statistics
  const calculateSummary = (appointments: Appointment[], appointmentData: any[]) => {
    const totalAppointments = appointments.length;
    const totalRevenue = appointmentData.reduce((sum, item) => sum + item.revenue, 0);
    const avgMonthlyAppointments = appointmentData.length > 0 
      ? Math.round(totalAppointments / appointmentData.length)
      : 0;
    
    // Conversion rate calculation (simplified)
    const totalInquiries = totalAppointments > 0 ? totalAppointments + 5 : 10;
    const conversionRate = Math.round((totalAppointments / totalInquiries) * 100);
    
    return {
      totalAppointments,
      totalRevenue,
      avgMonthlyAppointments,
      conversionRate
    };
  };

  const refreshData = async () => {
    await fetchAnalyticsData();
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData
  };
};