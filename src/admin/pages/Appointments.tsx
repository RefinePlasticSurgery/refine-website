import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentDetailsModal } from "@/admin/components/AppointmentDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Phone,
  Mail,
  Filter,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  useAppointments,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "@/admin/hooks/useAppointments";
import type { Appointment } from "@/integrations/supabase/types";
import { exportFilteredAppointments } from "@/admin/lib/export-utils";
import { format } from "date-fns";
import { AdminLayout } from "@/admin/components/AdminLayout";

export const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { appointments, loading, error, refreshAppointments } = useAppointments();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.procedure.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <AdminLayout
        title="Appointments"
        description="Review and manage consultation requests."
        segment="Appointments"
      >
        <div
          className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
          aria-busy="true"
          aria-label="Loading appointments"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading appointments…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout
        title="Appointments"
        description="Search, filter, and update enquiry statuses."
        segment="Appointments"
        headerActions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={async () => {
                setIsRefreshing(true);
                await refreshAppointments();
                setIsRefreshing(false);
              }}
              disabled={isRefreshing}
              aria-label="Refresh appointments list"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing…" : "Refresh"}
              </span>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() =>
                exportFilteredAppointments(appointments, searchTerm, statusFilter)
              }
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </>
        }
        toolbar={
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, procedure…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" type="button" aria-label="Filters">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      >
        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12 min-w-12">#</TableHead>
                <TableHead className="min-w-40">Patient</TableHead>
                <TableHead className="min-w-48">Contact</TableHead>
                <TableHead className="min-w-44">Procedure</TableHead>
                <TableHead className="min-w-32">Preferred date</TableHead>
                <TableHead className="min-w-24">Status</TableHead>
                <TableHead className="min-w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-muted-foreground"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "No appointments match your filters."
                      : "No appointments yet."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppointments.map((appointment, index) => (
                  <TableRow key={appointment.id} className="group">
                    <TableCell className="font-medium text-muted-foreground">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">
                          {appointment.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(appointment.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {appointment.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {appointment.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{appointment.procedure}</TableCell>
                    <TableCell className="text-sm">
                      {appointment.preferred_date
                        ? format(new Date(appointment.preferred_date), "MMM d, yyyy")
                        : "Flexible"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getAppointmentStatusColor(appointment.status)}>
                        {getAppointmentStatusLabel(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsModalOpen(true);
                        }}
                        className="gap-2"
                        aria-label={`View ${appointment.name}'s appointment`}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Review</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of{" "}
              {filteredAppointments.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </AdminLayout>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateSuccess={(updatedAppointment) => {
          setSelectedAppointment(updatedAppointment);
        }}
      />
    </>
  );
};
