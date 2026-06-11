import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AdminLayout from './components/layout/AdminLayout';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/ui/ScrollToTop';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LocalStorageStoreProvider } from './hooks/useLocalStorageStore';
import Availability from './pages/admin/Availability';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ManageContacts from './pages/admin/ManageContacts';
import ManageLogements from './pages/admin/ManageLogements';
import ManageReservations from './pages/admin/ManageReservations';
import Reports from './pages/admin/Reports';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Gallery from './pages/public/Gallery';
import Home from './pages/public/Home';
import LogementsList from './pages/public/LogementsList';
import NotFound from './pages/public/NotFound';
import PropertyDetails from './pages/public/PropertyDetails';

const queryClient = new QueryClient();

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray">
        <div className="text-brand-dark font-bold">Chargement...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocalStorageStoreProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<LogementsList />} />
                <Route path="/galerie" element={<Gallery />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/logements/:id" element={<PropertyDetails />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              <Route path="/admin/login" element={<Login />} />

              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="logements" element={<ManageLogements />} />
                <Route path="reservations" element={<ManageReservations />} />
                <Route path="disponibilites" element={<Availability />} />
                <Route path="rapports" element={<Reports />} />
                <Route path="contacts" element={<ManageContacts />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LocalStorageStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
