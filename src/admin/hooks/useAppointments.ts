import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';
import type { Appointment, NewAppointment, UpdateAppointment } from '@/integrations/supabase/types';

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  createAppointment: (appointment: NewAppointment) => Promise<Appointment | null>;
  updateAppointment: (id: string, updates: UpdateAppointment) => Promise<Appointment | null>;
  deleteAppointment: (id: string) => Promise<boolean>;
  refreshAppointments: () => Promise<void>;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setAppointments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointment: NewAppointment): Promise<Appointment | null> => {
    try {
      setError(null);
      
      const { data, error: createError } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (createError) throw createError;
      
      // Refresh the list
      await fetchAppointments();
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment');
      console.error('Error creating appointment:', err);
      return null;
    }
  };

  const updateAppointment = async (id: string, updates: UpdateAppointment): Promise<Appointment | null> => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Refresh the list
      await fetchAppointments();
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update appointment');
      console.error('Error updating appointment:', err);
      return null;
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      // Refresh the list
      await fetchAppointments();
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete appointment');
      console.error('Error deleting appointment:', err);
      return false;
    }
  };

  const refreshAppointments = async () => {
    await fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments,
  };
};

// Helper functions for appointment management
export const appointmentStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export const getAppointmentStatusColor = (status: string) => {
  const statusObj = appointmentStatuses.find(s => s.value === status);
  return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
};

export const getAppointmentStatusLabel = (status: string) => {
  const statusObj = appointmentStatuses.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};