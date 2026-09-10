import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, NewAppointment, UpdateAppointment } from '@/integrations/supabase/types';
import { handleSupabaseDatabaseError } from '@/lib/errors';
import { queryKeys } from '@/lib/query-keys';

// ─── Status helpers (kept here — used by Appointments page) ─────────────────

export const appointmentStatuses = [
  { value: 'pending',   label: 'Pending',   color: 'bg-amber-100 text-amber-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
] as const;

export const getAppointmentStatusColor = (status: string): string => {
  const found = appointmentStatuses.find(s => s.value === status);
  return found ? found.color : 'bg-gray-100 text-gray-800';
};

export const getAppointmentStatusLabel = (status: string): string => {
  const found = appointmentStatuses.find(s => s.value === status);
  return found ? found.label : status;
};

// ─── Fetch function ───────────────────────────────────────────────────────────

async function fetchAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw handleSupabaseDatabaseError(error);
  return data ?? [];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.appointments.all,
    queryFn: fetchAppointments,
  });

  const createMutation = useMutation({
    mutationFn: async (appointment: NewAppointment): Promise<Appointment> => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();
      if (error) throw handleSupabaseDatabaseError(error);
      return data;
    },
    onSuccess: (newAppt) => {
      // Optimistic: prepend without refetch
      queryClient.setQueryData<Appointment[]>(queryKeys.appointments.all, (prev = []) => [
        newAppt,
        ...prev,
      ]);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateAppointment;
    }): Promise<Appointment> => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw handleSupabaseDatabaseError(error);
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Appointment[]>(queryKeys.appointments.all, (prev = []) =>
        prev.map(a => (a.id === updated.id ? updated : a))
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw handleSupabaseDatabaseError(error);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Appointment[]>(queryKeys.appointments.all, (prev = []) =>
        prev.filter(a => a.id !== deletedId)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });

  return {
    appointments: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshAppointments: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all }),
    createAppointment: createMutation.mutateAsync,
    updateAppointment: (id: string, updates: UpdateAppointment) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteAppointment: (id: string) => deleteMutation.mutateAsync(id),
  };
};