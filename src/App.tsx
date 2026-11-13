import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { lazy, Suspense, useLayoutEffect } from "react";
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
const Messages = lazy(() => import("./pages/admin/Messages"));
const Account = lazy(() => import("./pages/admin/Account"));
const Team = lazy(() => import("./pages/admin/Team"));
const Reservations = lazy(() => import("./pages/admin/Reservations"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Login = lazy(() => import("./pages/admin/Login"));
const ManageLogements = lazy(() => import("./pages/admin/ManageLogements"));
const About = lazy(() => import("./pages/public/About"));
const Contact = lazy(() => import("./pages/public/Contact"));
import Home from "./pages/public/Home";
const LogementsList = lazy(() => import("./pages/public/LogementsList"));
const PropertyDetails = lazy(() => import("./pages/public/PropertyDetails"));
const Gallery = lazy(() => import("./pages/public/Gallery"));
const ConfirmReservation = lazy(
  () => import("./pages/public/ConfirmReservation"),
);
const AuthCallback = lazy(() => import("./pages/public/AuthCallback"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const Availability = lazy(() => import("./pages/admin/Availability"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const ManageGallery = lazy(() => import("./pages/admin/ManageGallery"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash)
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <p role="status" className="p-8 text-gray-500">
            Chargement de votre espace…
          </p>
        }
      >
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<LogementsList />} />
            <Route path="/galerie" element={<Gallery />} />
            <Route path="/avis" element={<Navigate to="/#avis" replace />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/logements/:id" element={<PropertyDetails />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/confirmer/:id" element={<ConfirmReservation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="logements" element={<ManageLogements />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="equipe" element={<Team />} />
            <Route path="compte" element={<Account />} />
            <Route path="messages" element={<Messages />} />
            <Route
              path="contacts"
              element={<Navigate to="/admin/messages" replace />}
            />
            <Route path="galerie" element={<ManageGallery />} />
            <Route path="disponibilites" element={<Availability />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>
          <Route path="*" element={<PublicLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
