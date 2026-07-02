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
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import FilmGrain from './components/FilmGrain';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPages from './pages/admin/AdminPages';
import AdminMedia from './pages/admin/AdminMedia';
import AdminContacts from './pages/admin/AdminContacts';
import AdminTrainings from './pages/admin/AdminTrainings';

import Preloader from './components/animations/Preloader';

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
        
        {/* Redirects for old routes */}
        <Route path="/filiales/*" element={<Navigate to="/services" replace />} />
        
        {/* Admin Routes (No transition to avoid messing with dashboard layout) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
        <Route path="/admin/trainings" element={<AdminTrainings />} />
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
