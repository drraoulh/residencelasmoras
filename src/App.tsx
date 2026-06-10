import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import AdminLayout from './components/layout/AdminLayout';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
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
import Home from './pages/public/Home';
import LogementsList from './pages/public/LogementsList';
import PropertyDetails from './pages/public/PropertyDetails';

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
    <LocalStorageStoreProvider>
      <BrowserRouter>
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
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="logements" element={<ManageLogements />} />
            <Route path="reservations" element={<ManageReservations />} />
            <Route path="disponibilites" element={<Availability />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="contacts" element={<ManageContacts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalStorageStoreProvider>
  );
}

export default App;
