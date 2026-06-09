import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import AdminLayout from './components/layout/AdminLayout';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ManageLogements from './pages/admin/ManageLogements';
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="logements" element={<ManageLogements />} />
          <Route
            path="reservations"
            element={
              <div className="flex h-full items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-500">Page Réservations à venir</h2>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
