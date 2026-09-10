import { useMemo, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  ChevronRight,
  ExternalLink,
  Bell,
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/admin/hooks/useAuth";
import { useSidebar } from "@/admin/hooks/useSidebar";
import { ADMIN_NAV_ITEMS } from "@/admin/config/navigation";
import logo from "@/assets/logo.png";

const SIDEBAR_WIDE   = "w-[256px]";
const SIDEBAR_NARROW = "w-[68px]";

type AdminLayoutProps = {
  title: string;
  description?: string;
  segment?: string;
  headerActions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export function AdminLayout({
  title,
  description,
  segment,
  headerActions,
  toolbar,
  children,
  contentClassName,
}: AdminLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { mobileOpen, toggleMobile, closeMobile, collapsed, toggleCollapsed, isMobile, ready } = useSidebar();

  const todayLabel = useMemo(() => format(new Date(), "EEE, MMM d"), []);
  const sidebarExpanded = !ready || isMobile || !collapsed;

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : "A";
  const userEmail = user?.email ?? "Admin";

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Root: exactly viewport height, no scroll on the shell */}
      <div className="flex h-screen w-full overflow-hidden bg-[#f8f5f2] text-foreground">

        {/* ── Mobile overlay ─────────────────────────────────────── */}
        {isMobile && mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          />
        )}

        {/* ═══════════════════════════════════════════════════════
            SIDEBAR
        ═══════════════════════════════════════════════════════ */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col transition-[transform,width] duration-300 ease-out lg:static lg:translate-x-0",
            // Background: very dark navy
            "bg-[#0d1117]",
            isMobile
              ? "w-[min(256px,88vw)] shadow-2xl"
              : sidebarExpanded
              ? SIDEBAR_WIDE
              : SIDEBAR_NARROW,
            isMobile && !mobileOpen && "-translate-x-full"
          )}
        >
          {/* ── Brand header ─────────────────────────────────── */}
          <div
            className={cn(
              "flex h-[64px] shrink-0 items-center gap-3 px-4",
              !sidebarExpanded && "justify-center px-0"
            )}
          >
            {/* Logo mark with pink glow */}
            <div
              className={cn(
                "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                "bg-[hsl(330_75%_45%)] shadow-[0_0_20px_hsl(330_75%_45%/0.4)]"
              )}
            >
              <img src={logo} alt="" className="h-6 w-6 object-contain brightness-0 invert" />
            </div>

            {sidebarExpanded && (
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[16px] font-semibold leading-tight text-white">
                  Refine
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[hsl(330_75%_60%)]">
                  Admin Console
                </p>
              </div>
            )}

            {isMobile && (
              <button
                type="button"
                onClick={closeMobile}
                className="ml-auto rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
                aria-label="Close navigation"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Thin pink accent line under brand */}
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[hsl(330_75%_45%/0.5)] to-transparent" />

          {/* ── Navigation ───────────────────────────────────── */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4 scrollbar-none">
            {sidebarExpanded && (
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/20">
                Menu
              </p>
            )}

            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              const navInner = (
                <NavLink
                  to={item.href}
                  end={item.href === "/admin/dashboard"}
                  onClick={() => isMobile && closeMobile()}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150",
                      sidebarExpanded ? "px-3 py-2.5" : "justify-center px-0 py-3",
                      isActive
                        ? [
                            // Active: filled pink background
                            "bg-[hsl(330_75%_45%/0.15)] text-white",
                            // Left accent bar
                            "before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-r-full",
                            "before:bg-[hsl(330_75%_55%)] before:shadow-[0_0_8px_hsl(330_75%_55%)]",
                          ]
                        : [
                            "text-white/40 hover:bg-white/[0.06] hover:text-white/80",
                          ]
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive
                            ? "text-[hsl(330_75%_60%)]"
                            : "text-white/35 group-hover:text-white/70"
                        )}
                      />
                      {sidebarExpanded && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );

              if (!sidebarExpanded && !isMobile) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navInner}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return <div key={item.href}>{navInner}</div>;
            })}
          </nav>

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="shrink-0 space-y-1 p-2">
            {/* View site */}
            {sidebarExpanded && (
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/30 transition hover:bg-white/[0.06] hover:text-white/60"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                View public site
              </a>
            )}

            {/* Collapse toggle (desktop only) */}
            {!isMobile && (
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/30 transition hover:bg-white/[0.06] hover:text-white/60",
                  !sidebarExpanded && "justify-center px-0"
                )}
              >
                {sidebarExpanded ? (
                  <>
                    <PanelLeftClose className="h-3.5 w-3.5 shrink-0" />
                    <span>Collapse</span>
                  </>
                ) : (
                  <PanelLeft className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {/* Divider */}
            <div className="mx-1 h-px bg-white/[0.06]" />

            {/* User pill */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.06]",
                    !sidebarExpanded && "justify-center"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                    style={{
                      background: "hsl(330 75% 45% / 0.2)",
                      color: "hsl(330 75% 65%)",
                    }}
                  >
                    {userInitials}
                  </div>
                  {sidebarExpanded && (
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[12px] font-semibold text-white/80">{userEmail}</p>
                      <p className="truncate text-[10px] text-white/30">Administrator</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">
                  Signed in as
                </DropdownMenuLabel>
                <DropdownMenuLabel className="-mt-1 truncate text-xs">
                  {userEmail}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { navigate("/admin/settings"); closeMobile(); }}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════
            MAIN COLUMN
        ═══════════════════════════════════════════════════════ */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* ── Header ────────────────────────────────────────── */}
          <header className="shrink-0 border-b border-black/[0.06] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex h-[64px] items-center gap-4 px-5 lg:px-7">

              {/* Mobile burger */}
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
                onClick={toggleMobile}
                aria-label="Open navigation"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Page identity */}
              <div className="min-w-0 flex-1">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Admin
                  </span>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(330_75%_45%)]">
                    {segment ?? title}
                  </span>
                </nav>
                {/* Page title */}
                <h1 className="font-serif text-xl font-semibold leading-tight text-slate-900 md:text-2xl">
                  {title}
                </h1>
              </div>

              {/* Right slot */}
              <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
                {/* Date chip */}
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {todayLabel}
                  </span>
                </div>

                {/* Bell icon */}
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>

                {/* Injected page actions */}
                {headerActions}
              </div>
            </div>

            {/* Mobile action row */}
            {headerActions && (
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-2 sm:hidden">
                {headerActions}
              </div>
            )}

            {/* Toolbar strip */}
            {toolbar && (
              <>
                <Separator />
                <div className="bg-white px-5 py-3 lg:px-7">{toolbar}</div>
              </>
            )}
          </header>

          {/* ── Page content (scrollable) ─────────────────────── */}
          <main
            className={cn(
              "flex-1 overflow-y-auto px-5 py-6 lg:px-7 lg:py-8",
              contentClassName
            )}
          >
            <div className="mx-auto max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
