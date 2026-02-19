import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarToggle } from '@/admin/hooks/useSidebarToggle';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/admin/hooks/useAnalytics';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  Users, 
  CalendarDays,
  Menu,
  X
} from 'lucide-react';



export const Analytics = () => {
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarToggle();
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1024 });
  const [timeRange, setTimeRange] = useState('6months');
  const navigate = useNavigate();
  const { data, loading, error } = useAnalytics();

  // Track window size for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Use real data from hook
  const { appointmentData, procedureData, statusData, summary } = data;
  const { totalAppointments, totalRevenue, avgMonthlyAppointments, conversionRate } = summary;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Error handling */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        style={{
          transform: typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)')
            : 'translateX(0)',
          transition: 'transform 300ms ease-in-out',
          pointerEvents: typeof window !== 'undefined' && window.innerWidth < 1024 && !sidebarOpen ? 'none' : 'auto'
        }}
        className={`lg:static fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col`}
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
              variant={item.href === '/admin/analytics' ? 'secondary' : 'ghost'}
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
              <h2 className="text-2xl font-bold text-foreground truncate">Analytics Dashboard</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-input bg-background rounded-md px-3 py-2 text-sm"
              >
                <option value="1month">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="bg-card border-b border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-muted rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Appointments</p>
                  <h3 className="text-2xl font-bold text-foreground">{totalAppointments}</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 12% from last period</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-foreground">TZS {totalRevenue.toLocaleString()}</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 18% from last period</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Monthly</p>
                  <h3 className="text-2xl font-bold text-foreground">{avgMonthlyAppointments}</h3>
                  <p className="text-xs text-blue-500 mt-1">+2 from previous</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <h3 className="text-2xl font-bold text-foreground">{conversionRate}%</h3>
                  <p className="text-xs text-green-500 mt-1">↑ 5% improvement</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Appointments Over Time */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Appointments Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'appointments' ? `${value} appointments` : `TZS ${value.toLocaleString()}`,
                        name === 'appointments' ? 'Appointments' : 'Revenue'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Over Time */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`TZS ${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#82ca9d" 
                      name="Revenue" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Procedure Distribution */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Procedure Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={procedureData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {procedureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Appointment Status */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Appointment Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};