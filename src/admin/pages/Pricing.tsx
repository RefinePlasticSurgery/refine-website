import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarToggle } from '@/admin/hooks/useSidebarToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Menu,
  X,
  DollarSign,
  Copy
} from 'lucide-react';
import { pricingData, type PricingItem } from '@/lib/pricing-data';
import { useToast } from '@/hooks/use-toast';

export const Pricing = () => {
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarToggle();
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1024 });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Track window size for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(pricingData.map(item => item.category)));
    return cats.sort();
  }, []);

  // Filter pricing data
  const filteredPricing = useMemo(() => {
    return pricingData.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Copy price to clipboard
  const copyPriceToClipboard = (price: number, name: string) => {
    const priceText = `${name}: ${formatPrice(price)}`;
    navigator.clipboard.writeText(priceText);
    toast({
      title: "Copied!",
      description: `"${name}" price copied to clipboard`,
    });
  };

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
              variant={item.href === '/admin/pricing' ? 'secondary' : 'ghost'}
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
              <div className="truncate">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 truncate">
                  <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="truncate">Pricing Management</span>
                </h2>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search procedures by name or category"
                />
              </div>
              
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-muted-foreground self-center" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  aria-label="Filter procedures by category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Procedures</p>
              <p className="text-2xl font-bold text-foreground">{filteredPricing.length}</p>
              <p className="text-xs text-muted-foreground mt-2">of {pricingData.length} total</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Average Price</p>
              <p className="text-2xl font-bold text-primary">
                {filteredPricing.length > 0 
                  ? formatPrice(filteredPricing.reduce((sum, item) => sum + item.price, 0) / filteredPricing.length)
                  : 'N/A'
                }
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredPricing.length > 0 
                  ? formatPrice(Math.min(...filteredPricing.map(item => item.price)))
                  : 'N/A'
                }
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Highest Price</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {filteredPricing.length > 0 
                  ? formatPrice(Math.max(...filteredPricing.map(item => item.price)))
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {filteredPricing.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Procedure Name</TableHead>
                      <TableHead className="min-w-[150px]">Category</TableHead>
                      <TableHead className="min-w-[150px] text-right">Price (TZS)</TableHead>
                      <TableHead className="min-w-[150px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPricing.map((procedure) => (
                      <TableRow key={procedure.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{procedure.name}</p>
                            {procedure.description && (
                              <p className="text-sm text-muted-foreground mt-1">{procedure.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="whitespace-nowrap">
                            {procedure.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-bold text-primary">{formatPrice(procedure.price)}</p>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPriceToClipboard(procedure.price, procedure.name)}
                            aria-label={`Copy price for ${procedure.name}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No procedures found matching your filters</p>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>💡 Note:</strong> Prices are displayed in Tanzanian Shillings (TZS). Click the copy button to quickly copy any price to your clipboard for reference or communication with patients.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
