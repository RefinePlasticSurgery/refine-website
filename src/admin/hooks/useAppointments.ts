import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, NewAppointment, UpdateAppointment } from '@/integrations/supabase/types';
import { handleSupabaseDatabaseError, DatabaseError } from '@/lib/errors';

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
    } catch (err: unknown) {
      const dbError = handleSupabaseDatabaseError(err);
      setError(dbError.message);
      console.error('Error fetching appointments:', dbError.code, dbError.message);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointment: NewAppointment): Promise<Appointment | null> => {
    try {
      setError(null);
      
      const { data, error: createError } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (createError) throw createError;
      
      // ✅ Optimistically add to list instead of refetching all
      setAppointments(prev => [data, ...prev]);
      
      return data;
    } catch (err: unknown) {
      const dbError = handleSupabaseDatabaseError(err);
      setError(dbError.message);
      console.error('Error creating appointment:', dbError.code, dbError.message);
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
      
      // ✅ Optimistically update in list instead of refetching all
      setAppointments(prev =>
        prev.map(appt => appt.id === id ? data : appt)
      );
      
      return data;
    } catch (err: unknown) {
      const dbError = handleSupabaseDatabaseError(err);
      setError(dbError.message);
      console.error('Error updating appointment:', dbError.code, dbError.message);
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
      
      // ✅ Optimistically remove from list instead of refetching all
      setAppointments(prev =>
        prev.filter(appt => appt.id !== id)
      );
      
      return true;
    } catch (err: unknown) {
      const dbError = handleSupabaseDatabaseError(err);
      setError(dbError.message);
      console.error('Error deleting appointment:', dbError.code, dbError.message);
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