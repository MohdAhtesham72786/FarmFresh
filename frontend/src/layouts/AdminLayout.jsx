import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Leaf, LogOut, Menu, Package, PanelLeftClose, ShoppingBag, Store, Warehouse } from "lucide-react";
import { setAdminToken } from "../api/client";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/stock", label: "Stock", icon: Warehouse },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();

  const logout = () => {
    setAdminToken(null);
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
      isActive ? "bg-fresh-500 text-white" : "text-forest-100/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-2.5 px-2 pt-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fresh-500 text-white">
          <Leaf className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-lg font-bold text-white">FarmFresh</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-forest-200">Admin console</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navLinkClass} onClick={onNavigate}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-forest-100/80 hover:bg-white/10 hover:text-white"
        >
          <Store className="h-4 w-4" />
          Customer store
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-forest-100/80 hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-cream-50 md:flex">
      <aside className="hidden w-64 shrink-0 bg-forest-950 p-4 md:block">
        <SidebarContent onNavigate={undefined} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-forest-950/50" onClick={closeSidebar} aria-label="Close menu" />
          <aside className="relative z-10 h-full w-72 max-w-[85vw] bg-forest-950 p-4 shadow-elevated">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={closeSidebar} className="rounded-lg p-2 text-forest-200">
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={closeSidebar} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-forest-100 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="rounded-xl border border-forest-200 p-2 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5 text-forest-700" />
            </button>
            <div>
              <p className="text-sm font-semibold text-forest-800">Inventory &amp; catalog operations</p>
              <p className="hidden text-xs text-forest-400 sm:block">Manage products, stock, and orders</p>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}