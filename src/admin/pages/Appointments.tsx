import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppointmentDetailsModal } from '@/admin/components/AppointmentDetailsModal';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Phone, 
  Mail, 
  Filter,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import { useAppointments, getAppointmentStatusColor, getAppointmentStatusLabel } from '@/admin/hooks/useAppointments';
import { useSidebarToggle } from '@/admin/hooks/useSidebarToggle';
import type { Appointment } from '@/integrations/supabase/types';
import { exportFilteredAppointments } from '@/admin/lib/export-utils';
import { format } from 'date-fns';

export const Appointments = () => {
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarToggle();
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1024 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { appointments, loading, error, refreshAppointments } = useAppointments();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Track window size for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.procedure.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Appointments', href: '/admin/appointments' },
    { label: 'Blog', href: '/admin/blog' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Team', href: '/admin/team' },
    { label: 'Pricing', href: '/admin/pricing' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" aria-busy="true" aria-label="Loading appointments data">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Desktop Static, Mobile Fixed */}
      <div 
        key={sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}
        style={{
          transform: windowSize.width < 1024 
            ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
          transition: 'transform 300ms ease-in-out',
          position: windowSize.width < 1024 ? 'fixed' : 'static' as 'fixed' | 'static',
          pointerEvents: windowSize.width < 1024 && !sidebarOpen ? 'none' : 'auto',
          top: 0,
          left: 0,
          bottom: 0
        }}
        className={`z-50 w-64 bg-card border-r border-border flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Close sidebar navigation menu"
            onClick={closeSidebar}
            title="Close sidebar (ESC)"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={item.href === '/admin/appointments' ? 'secondary' : 'ghost'}
              className="w-full justify-start py-5 text-left"
              onClick={() => {
                navigate(item.href);
                closeSidebar();
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content - Shrinks when sidebar visible on desktop */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="relative z-10 bg-card border-b border-border px-6 py-3 h-16 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar navigation"
                aria-expanded={sidebarOpen}
                title="Toggle sidebar menu (ESC to close)"
                className="hover:bg-accent text-foreground flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground truncate">Appointments</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  setIsRefreshing(true);
                  await refreshAppointments();
                  setIsRefreshing(false);
                }}
                disabled={isRefreshing || loading}
                aria-label="Refresh appointments list"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportFilteredAppointments(appointments, searchTerm, statusFilter)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 min-w-12">#</TableHead>
                  <TableHead className="min-w-40">Patient</TableHead>
                  <TableHead className="min-w-48">Contact</TableHead>
                  <TableHead className="min-w-44">Procedure</TableHead>
                  <TableHead className="min-w-32">Date</TableHead>
                  <TableHead className="min-w-24">Status</TableHead>
                  <TableHead className="text-right min-w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No appointments found matching your criteria' 
                        : 'No appointments yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((appointment, index) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{appointment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(appointment.created_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {appointment.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {appointment.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {appointment.procedure}
                      </TableCell>
                      <TableCell>
                        {appointment.preferred_date 
                          ? format(new Date(appointment.preferred_date), 'MMM d, yyyy')
                          : 'Any time'
                        }
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
                          aria-label={`View and edit status for ${appointment.name}'s appointment`}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline text-xs">Update</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
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
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <AppointmentDetailsModal 
        appointment={selectedAppointment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpdateSuccess={(updatedAppointment) => {
          // Update selected appointment with fresh data and show updated table
          setSelectedAppointment(updatedAppointment);
        }}
      />
    </div>
  );
};