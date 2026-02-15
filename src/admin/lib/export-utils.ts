import type { Appointment } from '@/integrations/supabase/types';
import { format } from 'date-fns';

export const exportAppointmentsToCSV = (appointments: Appointment[], filename?: string) => {
  // Define CSV headers
  const headers = [
    'ID',
    'Patient Name',
    'Email',
    'Phone',
    'Procedure',
    'Preferred Date',
    'Status',
    'Message',
    'Created At',
    'Updated At'
  ];

  // Convert appointments to CSV rows
  const rows = appointments.map(appointment => [
    appointment.id,
    appointment.name,
    appointment.email,
    appointment.phone,
    appointment.procedure,
    appointment.preferred_date ? format(new Date(appointment.preferred_date), 'yyyy-MM-dd') : '',
    appointment.status,
    appointment.message || '',
    format(new Date(appointment.created_at), 'yyyy-MM-dd HH:mm:ss'),
    format(new Date(appointment.updated_at), 'yyyy-MM-dd HH:mm:ss')
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Export filtered appointments
export const exportFilteredAppointments = (
  appointments: Appointment[], 
  searchTerm: string,
  statusFilter: string,
  filename?: string
) => {
  // Apply the same filters as in the UI
  const filtered = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.procedure.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  exportAppointmentsToCSV(filtered, filename);
};

// Export appointments by date range
export const exportAppointmentsByDateRange = (
  appointments: Appointment[],
  startDate: Date,
  endDate: Date,
  filename?: string
) => {
  const filtered = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.created_at);
    return appointmentDate >= startDate && appointmentDate <= endDate;
  });

  exportAppointmentsToCSV(filtered, filename || `appointments-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.csv`);
};

// Export appointments by status
export const exportAppointmentsByStatus = (
  appointments: Appointment[],
  status: string,
  filename?: string
) => {
  const filtered = appointments.filter(appointment => appointment.status === status);
  exportAppointmentsToCSV(filtered, filename || `appointments-${status}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};