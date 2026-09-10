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
import { Switch } from "@/components/ui/switch";

import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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
      <div className="space-y-6">
        <section className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="mb-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-slate-900">
              <Building className="h-5 w-5 text-primary" />
              Business information
            </h2>
            <p className="mt-1 text-sm text-slate-500">Updates are reflected on public pages (demo workflow).</p>
          </div>
          <div className="space-y-6">
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
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="mb-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-slate-900">
              <Key className="h-5 w-5 text-violet-500" />
              Account security
            </h2>
            <p className="mt-1 text-sm text-slate-500">Change your password with a safe workflow (demo).</p>
          </div>
          <div className="space-y-6">
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
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="mb-6">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-slate-900">
              <Bell className="h-5 w-5 text-amber-500" />
              Notification workflows
            </h2>
            <p className="mt-1 text-sm text-slate-500">Choose how you want updates delivered (demo).</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
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
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
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
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
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
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
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
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

