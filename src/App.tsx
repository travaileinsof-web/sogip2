import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PageTransition from './components/animations/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Formations from './pages/Formations';
import Boutique from './pages/Boutique';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import FilmGrain from './components/FilmGrain';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPages from './pages/admin/AdminPages';
import AdminMedia from './pages/admin/AdminMedia';
import AdminContacts from './pages/admin/AdminContacts';
import AdminTrainings from './pages/admin/AdminTrainings';

import SogipBtp from './pages/filiales/SogipBtp';
import SogipImmo from './pages/filiales/SogipImmo';
import SogipEnergie from './pages/filiales/SogipEnergie';
import CefConseils from './pages/filiales/CefConseils';
import Preloader from './components/animations/Preloader';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Layout & PageTransition */}
        <Route path="/" element={<Layout><PageTransition><Home /></PageTransition></Layout>} />
        <Route path="/about" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
        <Route path="/services" element={<Layout><PageTransition><Services /></PageTransition></Layout>} />
        <Route path="/formations" element={<Layout><PageTransition><Formations /></PageTransition></Layout>} />
        <Route path="/boutique" element={<Layout><PageTransition><Boutique /></PageTransition></Layout>} />
        <Route path="/contact" element={<Layout><PageTransition><Contact /></PageTransition></Layout>} />
        <Route path="/mentions-legales" element={<Layout><PageTransition><MentionsLegales /></PageTransition></Layout>} />
        
        <Route path="/services/btp" element={<Layout><PageTransition><SogipBtp /></PageTransition></Layout>} />
        <Route path="/services/immo" element={<Layout><PageTransition><SogipImmo /></PageTransition></Layout>} />
        <Route path="/services/energie" element={<Layout><PageTransition><SogipEnergie /></PageTransition></Layout>} />
        <Route path="/services/cef-conseils" element={<Layout><PageTransition><CefConseils /></PageTransition></Layout>} />
        
        

        {/* Redirects for old routes */}
        <Route path="/filiales/*" element={<Navigate to="/services" replace />} />
        
        {/* Admin Routes (No transition to avoid messing with dashboard layout) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/pages" element={<PrivateRoute><AdminPages /></PrivateRoute>} />
        <Route path="/admin/media" element={<PrivateRoute><AdminMedia /></PrivateRoute>} />
        <Route path="/admin/contacts" element={<PrivateRoute><AdminContacts /></PrivateRoute>} />
        <Route path="/admin/trainings" element={<PrivateRoute><AdminTrainings /></PrivateRoute>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Preloader />
      <SmoothScroll>
        <FilmGrain />
        <Cursor />
        <AnimatedRoutes />
      </SmoothScroll>
    </Router>
  );
}

export default App;
