import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, FileText, Image, BarChart3, Settings, LogOut, Menu, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/admin/hooks/useAuth';
import { useDashboard, type DashboardStats } from '@/admin/hooks/useDashboard';
import { useSidebarToggle } from '@/admin/hooks/useSidebarToggle';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface OverviewStatsProps {
  stats: DashboardStats;
  loading: boolean;
}

const OverviewStats = ({ stats, loading }: OverviewStatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-12 mb-1"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Appointments</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalAppointments}</h3>
            <p className="text-xs text-green-500 mt-1">↑ {stats.totalAppointments > 0 ? '12%' : '0%'} from last month</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.pendingAppointments}</h3>
            <p className="text-xs text-amber-500 mt-1">{stats.pendingAppointments > 0 ? 'Requires attention' : 'All clear'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.thisMonthAppointments}</h3>
            <p className="text-xs text-blue-500 mt-1">+{stats.thisMonthAppointments > 0 ? '5' : '0'} from previous</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.conversionRate}%</h3>
            <p className="text-xs text-green-500 mt-1">{stats.conversionRate > 0 ? '↑ 5% improvement' : 'No data yet'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarToggle();
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1024 });
  const { user, signOut } = useAuth();
  const { stats, recentActivity, loading, error } = useDashboard();
  const navigate = useNavigate();

  // Track window size for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Calendar, label: 'Appointments', href: '/admin/appointments' },
    { icon: FileText, label: 'Blog', href: '/admin/blog' },
    { icon: Image, label: 'Gallery', href: '/admin/gallery' },
    { icon: Users, label: 'Team', href: '/admin/team' },
    { icon: DollarSign, label: 'Pricing', href: '/admin/pricing' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

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
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-3 py-5 text-left"
                onClick={() => {
                  navigate(item.href);
                  closeSidebar();
                }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
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
              <h2 className="text-2xl font-bold text-foreground truncate">Dashboard</h2>
            </div>
            <Button variant="outline" size="sm" className="flex-shrink-0 ml-4">
              Last 30 days
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
                Error: {error}
              </div>
            )}
            
            <OverviewStats stats={stats} loading={loading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-muted mt-2"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'appointment' ? 'bg-green-500' : 
                          activity.type === 'blog' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                        <div>
                          <p className="text-sm text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                            {activity.status && (
                              <span className="ml-2 capitalize">({activity.status})</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent activity</p>
                      <p className="text-xs mt-1">Start by adding appointments or blog posts</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => navigate('/admin/appointments')}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs">View Appointments</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => navigate('/admin/blog')}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-xs">Manage Blog</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => navigate('/admin/gallery')}
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-xs">Manage Gallery</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col gap-1"
                    onClick={() => navigate('/admin/analytics')}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-xs">View Analytics</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};