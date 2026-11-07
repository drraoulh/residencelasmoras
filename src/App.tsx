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
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import LogementsList from "./pages/public/LogementsList";
import PropertyDetails from "./pages/public/PropertyDetails";

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
            <Route path="/a-propos" element={<About />} />
            <Route path="/logements/:id" element={<PropertyDetails />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="logements" element={<ManageLogements />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="equipe" element={<Team />} />
            <Route path="compte" element={<Account />} />
            <Route path="messages" element={<Messages />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="panel">
                <h1>Page introuvable</h1>
                <a href="/">Retour à l’accueil</a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
