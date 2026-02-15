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
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useTeam } from '@/admin/hooks/useTeam';
import { format } from 'date-fns';

export const Team = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    bio: '',
    qualifications: '',
    specialties: ''
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { teamMembers, loading, error, createTeamMember, updateTeamMember } = useTeam();

  // Filter team members
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Appointments', href: '/admin/appointments' },
    { label: 'Blog', href: '/admin/blog' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Team', href: '/admin/team' },
    { label: 'Analytics', href: '/admin/analytics' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  const handleOpenDialog = (member = null) => {
    setEditingMember(member);
    if (member) {
      setMemberData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        qualifications: member.qualifications || '',
        specialties: (member.specialties || []).join(', ')
      });
    } else {
      setMemberData({
        name: '',
        role: '',
        bio: '',
        qualifications: '',
        specialties: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setMemberData({
      name: '',
      role: '',
      bio: '',
      qualifications: '',
      specialties: ''
    });
  };

  const handleSave = async () => {
    if (!memberData.name || !memberData.role) {
      alert('Name and role are required');
      return;
    }

    setSaving(true);
    try {
      const specialtiesArray = memberData.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const dataToSave = {
        ...memberData,
        specialties: specialtiesArray
      };

      if (editingMember) {
        await updateTeamMember(editingMember.id, dataToSave);
      } else {
        await createTeamMember(dataToSave);
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team...</p>
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
              variant={item.href === '/admin/team' ? 'secondary' : 'ghost'}
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
              <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {searchTerm 
                  ? 'No team members found matching your criteria' 
                  : (
                    <div>
                      <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p>No team members added yet</p>
                      <Button 
                        className="mt-4"
                        onClick={() => handleOpenDialog()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Team Member
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    
                    {member.qualifications && (
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Qualifications:</span> {member.qualifications}
                      </p>
                    )}
                    
                    {member.specialties && member.specialties.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-foreground mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {member.bio}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleOpenDialog(member)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <Input
                placeholder="Dr. John Smith"
                value={memberData.name}
                onChange={(e) => setMemberData({...memberData, name: e.target.value})}
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Role/Title *</label>
              <Input
                placeholder="Plastic Surgeon"
                value={memberData.role}
                onChange={(e) => setMemberData({...memberData, role: e.target.value})}
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Qualifications</label>
              <Input
                placeholder="MBChB, FWACS, FICS"
                value={memberData.qualifications}
                onChange={(e) => setMemberData({...memberData, qualifications: e.target.value})}
                disabled={saving}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Specialties</label>
              <Input
                placeholder="Reconstructive Surgery, Aesthetic Surgery, Burn Reconstruction"
                value={memberData.specialties}
                onChange={(e) => setMemberData({...memberData, specialties: e.target.value})}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple specialties with commas
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Biography</label>
              <Textarea
                placeholder="Professional biography..."
                value={memberData.bio}
                onChange={(e) => setMemberData({...memberData, bio: e.target.value})}
                rows={4}
                disabled={saving}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleSave}
                disabled={saving || !memberData.name || !memberData.role}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCloseDialog}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};