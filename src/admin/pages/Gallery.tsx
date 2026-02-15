import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  Menu,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useGallery } from '@/admin/hooks/useGallery';
import { format } from 'date-fns';

export const Gallery = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: '',
    before_after: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { images, loading, error, uploadImage } = useGallery();

  // Filter images
  const filteredImages = images.filter(image => {
    const matchesSearch = 
      (image.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (image.category?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    
    const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Appointments', href: '/admin/appointments' },
    { label: 'Blog', href: '/admin/blog' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Team', href: '/admin/team' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(selectedFile, uploadData);
      if (result) {
        setIsUploadDialogOpen(false);
        setUploadData({ title: '', category: '', before_after: false });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    'facial',
    'body-contouring', 
    'breast',
    'hair-transplant',
    'skin-treatment',
    'before-after'
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={item.href === '/admin/gallery' ? 'secondary' : 'ghost'}
              className="w-full justify-start py-5 text-left"
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Gallery Management</h2>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    {selectedFile && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      placeholder="Image title"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      disabled={uploading}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select 
                      value={uploadData.category} 
                      onValueChange={(value) => setUploadData({...uploadData, category: value})}
                      disabled={uploading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="before_after"
                      checked={uploadData.before_after}
                      onChange={(e) => setUploadData({...uploadData, before_after: e.target.checked})}
                      disabled={uploading}
                      className="rounded"
                    />
                    <label htmlFor="before_after" className="text-sm font-medium">
                      Before/After Image
                    </label>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile}
                      className="flex-1"
                    >
                      {uploading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsUploadDialogOpen(false)}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No images found matching your criteria' 
                  : (
                    <div>
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p>No images uploaded yet</p>
                      <Button 
                        className="mt-4"
                        onClick={() => setIsUploadDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload First Image
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              filteredImages.map((image) => (
                <div key={image.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">
                      {image.title || 'Untitled'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {image.category && (
                        <Badge variant="secondary">
                          {image.category.replace('-', ' ')}
                        </Badge>
                      )}
                      {image.before_after && (
                        <Badge variant="outline">
                          Before/After
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(image.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};