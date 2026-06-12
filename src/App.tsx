import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useLiveDataSync } from './hooks/useLiveDataSync';
import { useSupabaseKeepAlive } from './hooks/useSupabaseKeepAlive';

import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/ui/ScrollToTop';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Home from './pages/public/Home';

const About = lazy(() => import('./pages/public/About'));
const AuthCallback = lazy(() => import('./pages/public/AuthCallback'));
const ConfirmReservation = lazy(() => import('./pages/public/ConfirmReservation'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const LogementsList = lazy(() => import('./pages/public/LogementsList'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const PropertyDetails = lazy(() => import('./pages/public/PropertyDetails'));

const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const Availability = lazy(() => import('./pages/admin/Availability'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Login = lazy(() => import('./pages/admin/Login'));
const ManageContacts = lazy(() => import('./pages/admin/ManageContacts'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageProperties = lazy(() => import('./pages/admin/ManageProperties'));
const ManageReservations = lazy(() => import('./pages/admin/ManageReservations'));
const Reports = lazy(() => import('./pages/admin/Reports'));

function PageLoader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-brand-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      <p className="text-sm text-brand-muted">{label}</p>
    </div>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function AppProviders({ children }: { children: ReactNode }) {
  useSupabaseKeepAlive();
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
    return <PageLoader label="Chargement de l'espace admin…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <LazyPage>
      <AdminLayout />
    </LazyPage>
  );
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
                <Route
                  path="/catalogue"
                  element={
                    <LazyPage>
                      <LogementsList />
                    </LazyPage>
                  }
                />
                <Route
                  path="/galerie"
                  element={
                    <LazyPage>
                      <Gallery />
                    </LazyPage>
                  }
                />
                <Route
                  path="/a-propos"
                  element={
                    <LazyPage>
                      <About />
                    </LazyPage>
                  }
                />
                <Route
                  path="/logements/:id"
                  element={
                    <LazyPage>
                      <PropertyDetails />
                    </LazyPage>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <LazyPage>
                      <Contact />
                    </LazyPage>
                  }
                />
                <Route
                  path="*"
                  element={
                    <LazyPage>
                      <NotFound />
                    </LazyPage>
                  }
                />
              </Route>

              <Route
                path="/confirmer/:id"
                element={
                  <LazyPage>
                    <ConfirmReservation />
                  </LazyPage>
                }
              />
              <Route
                path="/auth/callback"
                element={
                  <LazyPage>
                    <AuthCallback />
                  </LazyPage>
                }
              />

              <Route
                path="/admin/login"
                element={
                  <LazyPage>
                    <Login />
                  </LazyPage>
                }
              />

              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route
                  index
                  element={
                    <LazyPage>
                      <Dashboard />
                    </LazyPage>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <LazyPage>
                      <Dashboard />
                    </LazyPage>
                  }
                />
                <Route
                  path="logements"
                  element={
                    <LazyPage>
                      <ManageProperties />
                    </LazyPage>
                  }
                />
                <Route
                  path="reservations"
                  element={
                    <LazyPage>
                      <ManageReservations />
                    </LazyPage>
                  }
                />
                <Route
                  path="disponibilites"
                  element={
                    <LazyPage>
                      <Availability />
                    </LazyPage>
                  }
                />
                <Route
                  path="rapports"
                  element={
                    <LazyPage>
                      <Reports />
                    </LazyPage>
                  }
                />
                <Route
                  path="galerie"
                  element={
                    <LazyPage>
                      <ManageGallery />
                    </LazyPage>
                  }
                />
                <Route
                  path="contacts"
                  element={
                    <LazyPage>
                      <ManageContacts />
                    </LazyPage>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProviders>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
