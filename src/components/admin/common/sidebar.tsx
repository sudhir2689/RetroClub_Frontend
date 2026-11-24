import {
  BadgePercent,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { BrandLogo } from "./BrandLogo.tsx";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Coupons", href: "/admin/coupons", icon: BadgePercent },
  { label: "Orders", href: "/admin/orders", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

const sidebarRoot =
  "hidden w-[280px] shrink-0 border-r border-[#D4AF37]/30 bg-white lg:flex lg:flex-col sticky top-0 h-screen self-start overflow-hidden z-20";

const brandRow =
  "flex h-16 shrink-0 items-center border-b border-[#D4AF37]/20 px-6 bg-white";
const navWrap = "space-y-2 p-4";
const navItemBase =
  "flex h-11 items-center gap-3.5 px-4 text-sm font-medium transition-all duration-200 rounded-xl";

const activeItem =
  "bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20";
const idleItem =
  "text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium";

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className={navWrap}>
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === "/admin"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? activeItem : idleItem}`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className={sidebarRoot}>
      <div className={brandRow}>
        <BrandLogo className="h-9 w-auto text-black" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <AdminSidebarNav />
      </div>
    </aside>
  );
}
