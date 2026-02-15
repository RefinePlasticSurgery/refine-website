import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  MapPin,
  User,
  Key,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/admin/hooks/useAuth';

export const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    businessName: 'Refine Plastic & Aesthetic Surgery Centre',
    phone: '(+255) 793 145 167',
    email: 'info@refineplasticsurgerytz.com',
    address: 'Dar es Salaam, Tanzania',
    workingHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
    about: 'Your trusted destination for cosmetic excellence and personalized care.'
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    smsNotifications: true
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

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      // Save general settings
      setTimeout(() => {
        setSaving(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      // Save account settings
      setTimeout(() => {
        setSaving(false);
        setAccountSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully!');
      }, 1000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      // Save notification settings
      setTimeout(() => {
        setSaving(false);
        alert('Notification preferences saved!');
      }, 1000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  };

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
              variant={item.href === '/admin/settings' ? 'secondary' : 'ghost'}
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
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
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
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Business Information
                    </CardTitle>
                    <CardDescription>
                      Update your clinic's public information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Business Name</label>
                        <Input
                          value={generalSettings.businessName}
                          onChange={(e) => setGeneralSettings({...generalSettings, businessName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            value={generalSettings.phone}
                            onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            type="email"
                            value={generalSettings.email}
                            onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Working Hours</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            value={generalSettings.workingHours}
                            onChange={(e) => setGeneralSettings({...generalSettings, workingHours: e.target.value})}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          value={generalSettings.address}
                          onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">About Description</label>
                      <Textarea
                        value={generalSettings.about}
                        onChange={(e) => setGeneralSettings({...generalSettings, about: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleSaveGeneral}
                        disabled={saving}
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Account Security
                    </CardTitle>
                    <CardDescription>
                      Update your password and account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Current Password</label>
                      <Input
                        type="password"
                        value={accountSettings.currentPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">New Password</label>
                      <Input
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                      <Input
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleSaveAccount}
                        disabled={saving || !accountSettings.currentPassword || !accountSettings.newPassword}
                      >
                        {saving ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Configure how you receive notifications and alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive email updates about appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Appointment Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get reminders for upcoming appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.appointmentReminders}
                          onChange={(e) => setNotificationSettings({...notificationSettings, appointmentReminders: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive SMS alerts for important updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.marketingEmails}
                          onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleSaveNotifications}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Preferences'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};