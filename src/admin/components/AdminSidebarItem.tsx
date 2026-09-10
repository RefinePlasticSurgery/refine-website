import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdminNavItem } from "@/admin/config/navigation";

type AdminSidebarItemProps = {
  item: AdminNavItem;
  expanded: boolean;
  showTooltip: boolean;
  onNavigate?: () => void;
};

export function AdminSidebarItem({
  item,
  expanded,
  showTooltip,
  onNavigate,
}: AdminSidebarItemProps) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.href}
      end={item.href === "/admin/dashboard"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 overflow-hidden rounded-full px-3 py-2.5 text-sm font-medium transition-all duration-200",
          !expanded && "justify-center rounded-xl px-0 py-3",
          isActive
            ? "bg-[hsl(330_75%_45%)]/18 text-white shadow-[0_0_20px_-6px_hsl(330_75%_45%/0.85)]"
            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden
              className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-[hsl(330_75%_45%)] shadow-[0_0_12px_2px_hsl(330_75%_45%/0.9)]"
            />
          )}
          <Icon
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
              isActive
                ? "text-[hsl(330_75%_45%)]"
                : "text-slate-500 group-hover:text-slate-200"
            )}
          />
          {expanded && <span className="truncate">{item.title}</span>}
          {isActive && expanded && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(330_75%_45%)] shadow-[0_0_8px_hsl(330_75%_45%)]" />
          )}
        </>
      )}
    </NavLink>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
