import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import type { Appointment, UpdateAppointment } from '@/integrations/supabase/types';
import { useAppointments, getAppointmentStatusColor, getAppointmentStatusLabel } from '@/admin/hooks/useAppointments';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentDetailsModal = ({ 
  appointment, 
  open, 
  onOpenChange 
}: AppointmentDetailsModalProps) => {
  const [status, setStatus] = useState(appointment?.status || 'pending');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateAppointment } = useAppointments();

  const handleStatusChange = async () => {
    if (!appointment) return;
    
    setIsUpdating(true);
    try {
      const updates: UpdateAppointment = {
        status,
        ...(notes && { message: `${appointment.message || ''}\n\nAdmin Notes: ${notes}` })
      };
      
      await updateAppointment(appointment.id, updates);
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium">{appointment.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${appointment.email}`} className="text-primary hover:underline">
                    {appointment.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${appointment.phone}`} className="text-primary hover:underline">
                    {appointment.phone}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Submitted</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(appointment.created_at), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Procedure of Interest</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{appointment.procedure}</span>
              </div>
            </div>

            {appointment.preferred_date && (
              <div>
                <label className="text-sm text-muted-foreground">Preferred Date</label>
                <p className="mt-1">{format(new Date(appointment.preferred_date), 'EEEE, MMMM d, yyyy')}</p>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={getAppointmentStatusColor(appointment.status)}>
                  {getAppointmentStatusLabel(appointment.status)}
                </Badge>
              </div>
            </div>

            {appointment.message && (
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Patient Message
                </label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{appointment.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Update Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Update Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                <Textarea
                  placeholder="Add any notes about this appointment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleStatusChange}
                  disabled={isUpdating || status === appointment.status}
                  className="flex-1"
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};