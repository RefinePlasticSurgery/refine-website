import {
  LayoutDashboard,
  Calendar,
  FileText,
  Image,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Appointments", href: "/admin/appointments", icon: Calendar },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Gallery", href: "/admin/gallery", icon: Image },
  { title: "Team", href: "/admin/team", icon: Users },
  { title: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
