import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  ExternalLink,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import BrandName from '../ui/BrandName';
import { useAuth } from '../../hooks/useAuth';
import { useAutoCompleteReservations } from '../../hooks/useAutoCompleteReservations';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

const navItems = [
  { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Logements', path: '/admin/logements', icon: Home },
  { name: 'Réservations', path: '/admin/reservations', icon: CalendarCheck },
  { name: 'Planning', path: '/admin/disponibilites', icon: CalendarDays },
  { name: 'Rapports', path: '/admin/rapports', icon: BarChart3 },
  { name: 'Contacts', path: '/admin/contacts', icon: Inbox },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-red-50 text-brand-red'
                : 'text-brand-muted hover:bg-brand-gray hover:text-brand-dark'
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const { logout, user } = useAuth();
  useAutoCompleteReservations();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const userLabel = user?.email ?? 'Administrateur';

  return (
    <div className="flex min-h-screen bg-brand-gray">
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-stone-200/70 bg-white lg:flex">
        <div className="border-b border-stone-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <img
              src={logoLasmoras}
              alt="LAS MORAS"
              className="h-12 w-auto rounded-lg object-contain ring-1 ring-stone-200/80"
            />
            <div className="min-w-0">
              <BrandName size="sm" />
              <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-brand-muted">
                Administration
              </p>
            </div>
          </div>
        </div>

        <SidebarNav />

        <div className="space-y-2 border-t border-stone-100 p-4">
          <p className="truncate px-2 text-[11px] text-brand-muted" title={userLabel}>
            {userLabel}
          </p>
          <Link to="/" className="admin-btn-secondary w-full">
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
          <button type="button" onClick={logout} className="admin-btn-secondary w-full">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Header mobile */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200/70 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logoLasmoras} alt="LAS MORAS" className="h-9 w-auto rounded-lg" />
            <BrandName size="sm" className="hidden min-[400px]:block" />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200/80 text-brand-dark"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Drawer mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-4">
                <BrandName size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-brand-gray"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <div className="mt-auto space-y-2 border-t border-stone-100 p-4">
                <p className="truncate px-2 text-[11px] text-brand-muted">{userLabel}</p>
                <Link to="/" onClick={() => setMobileOpen(false)} className="admin-btn-secondary w-full">
                  <ExternalLink className="h-4 w-4" />
                  Voir le site
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="admin-btn-secondary w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </aside>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
