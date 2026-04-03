import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/admin/hooks/useAuth";
import { useSidebarToggle } from "@/admin/hooks/useSidebarToggle";
import { useAdminSidebarCollapsed } from "@/admin/hooks/useAdminSidebarCollapsed";
import { ADMIN_NAV_ITEMS } from "@/admin/config/navigation";
import logo from "@/assets/logo.png";

const SIDEBAR_WIDE = "w-[280px]";
const SIDEBAR_NARROW = "w-[76px]";

type AdminLayoutProps = {
  title: string;
  description?: string;
  /** e.g. breadcrumb segment after Admin */
  segment?: string;
  headerActions?: ReactNode;
  /** Optional strip below header (filters, tabs) */
  toolbar?: ReactNode;
  children: ReactNode;
  /** Wider main column for analytics */
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
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebarToggle();
  const { collapsed, toggleCollapsed, ready } = useAdminSidebarCollapsed();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const isMobile = windowWidth < 1024;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const sidebarExpandedWidth = !ready || isMobile || !collapsed;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen w-full bg-muted/40 text-foreground">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            aria-label="Close menu"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-xl transition-[transform,width] duration-300 ease-out lg:static lg:translate-x-0",
            isMobile ? "w-[min(280px,100vw)]" : sidebarExpandedWidth ? SIDEBAR_WIDE : SIDEBAR_NARROW,
            isMobile && !sidebarOpen && "-translate-x-full"
          )}
        >
          <div
            className={cn(
              "flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-4",
              !sidebarExpandedWidth && "justify-center px-2"
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-3",
                !sidebarExpandedWidth && "justify-center"
              )}
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/10">
                <img src={logo} alt="" className="h-full w-full object-contain p-1" />
              </div>
              {sidebarExpandedWidth && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-serif text-lg font-semibold tracking-tight text-white">
                      Refine
                    </span>
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  </div>
                  <p className="truncate text-[11px] font-medium uppercase tracking-widest text-slate-500">
                    Admin Console
                  </p>
                </div>
              )}
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-400 hover:bg-white/10 hover:text-white"
                onClick={closeSidebar}
                aria-label="Close navigation"
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const inner = (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/admin/dashboard"}
                  onClick={() => isMobile && closeSidebar()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-all",
                      sidebarExpandedWidth ? "" : "justify-center px-2",
                      isActive
                        ? "border-primary/30 bg-primary/15 text-white shadow-[0_0_20px_-8px_hsl(var(--primary))]"
                        : "text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-slate-500"
                        )}
                      />
                      {sidebarExpandedWidth && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );

              if (!sidebarExpandedWidth && !isMobile) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{inner}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return inner;
            })}
          </nav>

          <div className="shrink-0 border-t border-white/10 p-3">
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "mb-2 w-full justify-center gap-2 text-slate-400 hover:bg-white/5 hover:text-white",
                  sidebarExpandedWidth && "justify-start"
                )}
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarExpandedWidth ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="text-xs">Collapse</span>
                  </>
                ) : (
                  <PanelLeft className="h-4 w-4" />
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 text-left transition hover:bg-white/10",
                    !sidebarExpandedWidth && "justify-center p-2"
                  )}
                >
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary">
                      {user?.email?.charAt(0).toUpperCase() ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarExpandedWidth && (
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {user?.email ?? "Admin"}
                      </p>
                      <p className="truncate text-xs text-slate-500">Administrator</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate("/admin/settings");
                    closeSidebar();
                  }}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top header */}
          <header className="sticky top-0 z-30 border-b border-border/60 bg-card/85 backdrop-blur-md">
            <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                onClick={toggleSidebar}
                aria-label="Open navigation"
                aria-expanded={sidebarOpen}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <span>Admin</span>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                  <span className="text-foreground/80">{segment ?? title}</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {title}
                  </h1>
                  {description && (
                    <span className="hidden text-sm text-muted-foreground md:inline">
                      {description}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="mt-0.5 text-sm text-muted-foreground md:hidden">
                    {description}
                  </p>
                )}
              </div>

              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <div className="rounded-lg border border-border/80 bg-muted/50 px-3 py-1.5 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Today
                  </p>
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {format(new Date(), "EEE, MMM d")}
                  </p>
                </div>
                {headerActions}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border/40 px-4 py-2 sm:hidden">
              {headerActions}
            </div>
            {toolbar && (
              <>
                <Separator />
                <div className="bg-card/50 px-4 py-3 lg:px-8">{toolbar}</div>
              </>
            )}
          </header>

          <main
            className={cn(
              "flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8",
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
