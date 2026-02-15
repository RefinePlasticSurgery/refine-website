import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/admin-client';

export const useTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      
      setTeamMembers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (memberData: any) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('team_members')
        .insert({
          ...memberData,
          specialties: memberData.specialties || [],
          order_index: teamMembers.length
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Refresh the list
      await fetchTeamMembers();
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create team member');
      console.error('Error creating team member:', err);
      return null;
    }
  };

  const updateTeamMember = async (id: string, updates: any) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('team_members')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Refresh the list
      await fetchTeamMembers();
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update team member');
      console.error('Error updating team member:', err);
      return null;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      setError(null);
      
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete team member');
      console.error('Error deleting team member:', err);
      return false;
    }
  };

  const refreshTeamMembers = async () => {
    await fetchTeamMembers();
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refreshTeamMembers,
  };
};