import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Phone,
  Mail,
  Clock,
  User,
  MessageSquare,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Appointment, UpdateAppointment } from '@/integrations/supabase/types';
import {
  useAppointments,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
  appointmentStatuses,
} from '@/admin/hooks/useAppointments';
import { cn } from '@/lib/utils';

interface Props {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSuccess?: (updated: Appointment) => void;
}

// ─── Tiny label+value layout helper ──────────────────────────────────────────
const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <div className="mt-1 text-sm font-medium text-foreground">{children}</div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const AppointmentDetailsModal = ({
  appointment,
  open,
  onOpenChange,
  onUpdateSuccess,
}: Props) => {
  const [status, setStatus]       = useState('pending');
  const [notes, setNotes]         = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { updateAppointment } = useAppointments();

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setNotes('');
      setSaveError(null);
    }
  }, [appointment?.id]);

  const isDirty = status !== appointment?.status || notes.trim().length > 0;

  const handleSave = async () => {
    if (!appointment || !isDirty) return;
    setIsUpdating(true);
    setSaveError(null);
    try {
      const updates: UpdateAppointment = {
        status,
        ...(notes.trim() && {
          message: [appointment.message, `Admin notes: ${notes.trim()}`]
            .filter(Boolean)
            .join('\n\n'),
        }),
      };
      const updated = await updateAppointment(appointment.id, updates);
      if (updated) {
        onUpdateSuccess?.(updated);
        onOpenChange(false);
      }
    } catch (err) {
      setSaveError('Failed to save. Please try again.');
      console.error('Appointment update error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">

        {/* Header */}
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </span>
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-0">

          {/* Patient card */}
          <section className="px-6 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Patient Information
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Full name">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {appointment.name}
                </span>
              </InfoRow>

              <InfoRow label="Email">
                <a
                  href={`mailto:${appointment.email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {appointment.email}
                </a>
              </InfoRow>

              <InfoRow label="Phone">
                <a
                  href={`tel:${appointment.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {appointment.phone}
                </a>
              </InfoRow>

              <InfoRow label="Submitted">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {format(new Date(appointment.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </InfoRow>
            </div>
          </section>

          <div className="mx-6 border-t border-border/50" />

          {/* Appointment detail */}
          <section className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Appointment Details
            </p>

            <InfoRow label="Procedure of interest">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {appointment.procedure}
              </span>
            </InfoRow>

            {appointment.preferred_date && (
              <InfoRow label="Preferred date">
                {format(new Date(appointment.preferred_date), 'EEEE, MMMM d, yyyy')}
              </InfoRow>
            )}

            <InfoRow label="Current status">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  getAppointmentStatusColor(appointment.status)
                )}
              >
                {getAppointmentStatusLabel(appointment.status)}
              </span>
            </InfoRow>

            {appointment.message && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Patient message
                </p>
                <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {appointment.message}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Update section */}
          <section className="rounded-b-xl border-t border-border/60 bg-muted/30 px-6 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Update Appointment
            </p>

            <div className="space-y-4">
              {/* Status select */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  New status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentStatuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Admin notes
                  <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  placeholder="Add any internal notes about this appointment..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="
                    block w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5
                    text-sm text-foreground placeholder-muted-foreground
                    outline-none transition-[border-color,box-shadow]
                    focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]
                  "
                />
              </div>

              {/* Error */}
              {saveError && (
                <p className="text-sm text-destructive">{saveError}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating || !isDirty}
                  className="
                    inline-flex flex-1 items-center justify-center gap-2 rounded-lg
                    px-4 py-2.5 text-sm font-semibold text-primary-foreground
                    shadow-sm transition-all
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="
                    inline-flex items-center justify-center gap-2 rounded-lg border border-border
                    bg-background px-4 py-2.5 text-sm font-medium text-foreground
                    transition hover:bg-muted
                  "
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>

              {!isDirty && (
                <p className="text-xs text-muted-foreground">
                  Change status or add a note to enable saving.
                </p>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};