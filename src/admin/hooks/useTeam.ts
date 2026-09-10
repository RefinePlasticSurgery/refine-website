import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TeamMember, NewTeamMember, UpdateTeamMember } from '@/integrations/supabase/types';
import { queryKeys } from '@/lib/query-keys';

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTeam = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.team.all,
    queryFn: fetchTeamMembers,
  });

  const createMutation = useMutation({
    mutationFn: async (memberData: NewTeamMember): Promise<TeamMember> => {
      const currentCount = queryClient.getQueryData<TeamMember[]>(queryKeys.team.all)?.length ?? 0;
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          ...memberData,
          specialties: memberData.specialties ?? [],
          order_index: memberData.order_index ?? currentCount,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateTeamMember;
    }): Promise<TeamMember> => {
      const { data, error } = await supabase
        .from('team_members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<TeamMember[]>(queryKeys.team.all, (prev = []) =>
        prev.map(m => (m.id === updated.id ? updated : m))
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });

  // ✅ BUG FIX: Was previously only filtering local state, never calling Supabase.
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<TeamMember[]>(queryKeys.team.all, (prev = []) =>
        prev.filter(m => m.id !== deletedId)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
  });

  return {
    teamMembers: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshTeamMembers: () => queryClient.invalidateQueries({ queryKey: queryKeys.team.all }),
    createTeamMember: createMutation.mutateAsync,
    updateTeamMember: (id: string, updates: UpdateTeamMember) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteTeamMember: (id: string) => deleteMutation.mutateAsync(id),
  };
};
