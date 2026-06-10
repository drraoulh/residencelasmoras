import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, CalendarCheck, CalendarDays, Home, Inbox, LayoutDashboard, LogOut } from 'lucide-react';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Logements', path: '/admin/logements', icon: Home },
    { name: 'Réservations', path: '/admin/reservations', icon: CalendarCheck },
    { name: 'Disponibilités', path: '/admin/disponibilites', icon: CalendarDays },
    { name: 'Rapports', path: '/admin/rapports', icon: BarChart3 },
    { name: 'Contacts', path: '/admin/contacts', icon: Inbox },
  ];

  return (
    <div className="flex min-h-screen bg-brand-gray">
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm lg:flex">
        <div className="flex justify-center border-b border-gray-100 p-8">
          <img src={logoLasmoras} alt="Residence Las Moras" className="h-20 w-auto rounded-lg shadow-sm" />
        </div>

        <nav className="flex flex-1 flex-col gap-3 p-6">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Administration
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 rounded-lg px-5 py-3.5 font-bold transition ${
                  isActive
                    ? 'bg-red-50 text-brand-red shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-6">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-5 py-3.5 font-bold text-gray-500 transition hover:border-red-100 hover:bg-red-50 hover:text-brand-red"
          >
            <LogOut className="h-5 w-5" />
            Retour au site
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${
                    isActive ? 'bg-red-50 text-brand-red' : 'text-gray-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
