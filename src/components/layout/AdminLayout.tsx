import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, CalendarCheck, LogOut } from 'lucide-react';
import logoLasmoras from '../../assets/logo lasmoras.jpeg';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Mes Logements', path: '/admin/logements', icon: Home },
    { name: 'Réservations', path: '/admin/reservations', icon: CalendarCheck },
  ];

  return (
    <div className="flex h-screen bg-brand-gray overflow-hidden">
      {/* Sidebar latérale */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm z-10">
        <div className="p-8 border-b border-gray-100 flex justify-center">
          <img src={logoLasmoras} alt="Logo" className="h-20 w-auto rounded-xl shadow-sm" />
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu Principal</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-red-50 text-brand-red shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <Link to="/" className="flex items-center justify-center gap-3 w-full px-5 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-red-50 hover:text-brand-red transition-all border border-gray-200 hover:border-red-100">
            <LogOut className="w-5 h-5" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto p-10 bg-[#f4f6f8]">
        <Outlet />
      </main>
    </div>
  );
}
