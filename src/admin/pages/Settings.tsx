import { useState } from "react";
import {
  Building,
  Phone,
  Mail,
  Clock,
  MapPin,
  Key,
  Bell,
} from "lucide-react";

import { useAuth } from "@/admin/hooks/useAuth";
import { AdminLayout } from "@/admin/components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"general" | "account" | "notifications">("general");

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    businessName: "Refine Plastic & Aesthetic Surgery Centre",
    phone: "(+255) 793 145 167",
    email: "info@refineplasticsurgerytz.com",
    address: "Dar es Salaam, Tanzania",
    workingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
    about:
      "Your trusted destination for cosmetic excellence and personalized care.",
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    smsNotifications: true,
  });

  const handleSaveGeneral = async () => {
    setSavingGeneral(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: "Saved", description: "General settings updated." });
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveAccount = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({ title: "Password mismatch", description: "New passwords must match.", variant: "destructive" });
      return;
    }

    setSavingAccount(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setAccountSettings({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Updated", description: "Password changed successfully (demo)." });
    } finally {
      setSavingAccount(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      toast({ title: "Preferences saved", description: "Notification settings updated." });
    } finally {
      setSavingNotifications(false);
    }
  };

  return (
    <AdminLayout
      title="Settings"
      description={user?.email ? `Signed in as ${user.email}` : "Workspace settings"}
      segment="Settings"
    >
      <Card className="mb-6 rounded-2xl border-border/60 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Preferences & administration
          </CardTitle>
          <CardDescription>
            Configure your organization profile, account security, and notification workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "general" | "account" | "notifications")
            }
          >
            <TabsList className="grid w-full max-w-xl grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <Card className="border-border/60 bg-card/70 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Business information
                  </CardTitle>
                  <CardDescription>Updates are reflected on public pages (demo workflow).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business name</label>
                      <Input
                        value={generalSettings.businessName}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, businessName: e.target.value })}
                        disabled={savingGeneral}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={generalSettings.phone}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                          className="pl-10"
                          disabled={savingGeneral}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={generalSettings.email}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                          className="pl-10"
                          disabled={savingGeneral}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Working hours</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={generalSettings.workingHours}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, workingHours: e.target.value })}
                          className="pl-10"
                          disabled={savingGeneral}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={generalSettings.address}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                        className="pl-10"
                        disabled={savingGeneral}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">About</label>
                    <Textarea
                      value={generalSettings.about}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, about: e.target.value })}
                      disabled={savingGeneral}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveGeneral} disabled={savingGeneral} className="gap-2">
                      {savingGeneral ? "Saving..." : "Save general settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card className="border-border/60 bg-card/70 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Account security
                  </CardTitle>
                  <CardDescription>Change your password with a safe workflow (demo).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current password</label>
                    <Input
                      type="password"
                      value={accountSettings.currentPassword}
                      onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                      disabled={savingAccount}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New password</label>
                      <Input
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                        disabled={savingAccount}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm new password</label>
                      <Input
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                        disabled={savingAccount}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAccount} disabled={savingAccount} className="gap-2">
                      {savingAccount ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="border-border/60 bg-card/70 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification workflows
                  </CardTitle>
                  <CardDescription>Choose how you want updates delivered (demo).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/15 p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Appointment and system updates via email.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                      disabled={savingNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/15 p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Appointment reminders</p>
                      <p className="text-xs text-muted-foreground">Proactive reminders before consultations.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, appointmentReminders: checked })
                      }
                      disabled={savingNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/15 p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">SMS notifications</p>
                      <p className="text-xs text-muted-foreground">Short reminders and alerts via SMS.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                      }
                      disabled={savingNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/15 p-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Marketing emails</p>
                      <p className="text-xs text-muted-foreground">News, offers, and clinic updates.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                      }
                      disabled={savingNotifications}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSaveNotifications} disabled={savingNotifications}>
                      {savingNotifications ? "Saving..." : "Save notification preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

