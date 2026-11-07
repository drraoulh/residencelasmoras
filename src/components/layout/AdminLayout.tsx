import { useRef, useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  LogOut,
  Mail,
  Users,
  UserRound,
  ArrowUpRight,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/Auth";
import { supabase } from "../../lib/supabase";
import logo from "../../assets/logo lasmoras.jpeg";
import "../../admin.css";
const links = [
  { name: "Tableau de bord", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Logements", path: "/admin/logements", icon: Building2 },
  { name: "Réservations", path: "/admin/reservations", icon: CalendarDays },
  { name: "Messages", path: "/admin/messages", icon: Mail },
  { name: "Équipe et accès", path: "/admin/equipe", icon: Users },
  { name: "Mon compte", path: "/admin/compte", icon: UserRound },
];
export default function AdminLayout() {
  const { pathname } = useLocation();
  const { session, role, loading } = useAuth();
  const drawer = useRef<HTMLDialogElement>(null);
  const [logoutError, setLogoutError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const close = () => drawer.current?.close();
  const signOut = async () => {
    if (!supabase || signingOut) return;
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setSigningOut(false);
    if (error) setLogoutError("Déconnexion impossible. Réessayez.");
  };
  if (loading)
    return (
      <div className="admin-loading" role="status">
        <span className="admin-spinner" />
        Ouverture de votre espace…
      </div>
    );
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!role)
    return (
      <div className="panel">
        <p>Votre compte n’a pas accès à la gestion.</p>
        <button onClick={() => void signOut()}>Se déconnecter</button>
        {logoutError && <p role="alert">{logoutError}</p>}
      </div>
    );
  const items = links.filter(
    (item) => role === "admin" || item.path !== "/admin/equipe",
  );
  const current = items.find((item) => pathname.startsWith(item.path));
  const email = session.user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();
  const navigation = (
    <>
      <Link to="/admin/dashboard" onClick={close} className="admin-brand">
        <img src={logo} alt="Résidence Las Moras" />
        <span>
          LAS MORAS<small>ESPACE DE GESTION</small>
        </span>
      </Link>
      <div className="admin-nav-label">VOTRE RÉSIDENCE</div>
      <nav aria-label="Navigation administration" className="admin-nav">
        {items.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={close}
            aria-current={pathname.startsWith(path) ? "page" : undefined}
            className={pathname.startsWith(path) ? "active" : ""}
          >
            <Icon size={19} />
            <span>{name}</span>
            {pathname.startsWith(path) && <ChevronRight size={15} />}
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar-bottom">
        <Link to="/" className="admin-site-link">
          <span>Voir le site public</span>
          <ArrowUpRight size={17} />
        </Link>
        <div className="admin-sidebar-user">
          <span className="admin-avatar">{initials}</span>
          <div>
            <strong>
              {role === "admin" ? "Administrateur" : "Gestionnaire"}
            </strong>
            <span title={email}>{email}</span>
          </div>
          <ShieldCheck size={17} />
        </div>
        <button
          onClick={() => void signOut()}
          disabled={signingOut}
          className="admin-logout"
        >
          <LogOut size={17} />
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
        {logoutError && <p role="alert">{logoutError}</p>}
      </div>
    </>
  );
  return (
    <div className="admin-shell">
      <a href="#admin-content" className="admin-skip">
        Aller au contenu
      </a>
      <aside className="admin-sidebar">{navigation}</aside>
      <dialog
        ref={drawer}
        className="admin-drawer"
        aria-label="Menu de gestion"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="admin-drawer-inner">
          <button
            className="admin-drawer-close"
            aria-label="Fermer le menu"
            onClick={close}
          >
            <X size={22} />
          </button>
          {navigation}
        </div>
      </dialog>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-button"
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              onClick={() => drawer.current?.showModal()}
            >
              <Menu size={22} />
            </button>
            <span className="admin-breadcrumb">
              Administration <ChevronRight size={14} />{" "}
              <strong>{current?.name ?? "Gestion"}</strong>
            </span>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-today">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            <Link
              to="/admin/compte"
              className="admin-avatar"
              aria-label="Ouvrir mon compte"
            >
              {initials}
            </Link>
          </div>
        </header>
        <main id="admin-content" className="admin-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Résidence Las Moras</span>
          <span>Votre résidence, en toute simplicité.</span>
        </footer>
      </div>
    </div>
  );
}
