import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useLiveDataSync } from './hooks/useLiveDataSync';

import AdminLayout from './components/layout/AdminLayout';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/ui/ScrollToTop';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Availability from './pages/admin/Availability';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ManageContacts from './pages/admin/ManageContacts';
import ManageProperties from './pages/admin/ManageProperties';
import ManageReservations from './pages/admin/ManageReservations';
import Reports from './pages/admin/Reports';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Gallery from './pages/public/Gallery';
import Home from './pages/public/Home';
import LogementsList from './pages/public/LogementsList';
import NotFound from './pages/public/NotFound';
import AuthCallback from './pages/public/AuthCallback';
import ConfirmReservation from './pages/public/ConfirmReservation';
import PropertyDetails from './pages/public/PropertyDetails';

function AppProviders({ children }: { children: ReactNode }) {
  useLiveDataSync();
  return <>{children}</>;
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

function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-gray">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
        <p className="text-sm text-brand-muted">Chargement de l'espace admin…</p>
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
        <AppProviders>
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

            <Route path="/confirmer/:id" element={<ConfirmReservation />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/admin/login" element={<Login />} />

            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="logements" element={<ManageProperties />} />
              <Route path="reservations" element={<ManageReservations />} />
              <Route path="disponibilites" element={<Availability />} />
              <Route path="rapports" element={<Reports />} />
              <Route path="contacts" element={<ManageContacts />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AppProviders>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
