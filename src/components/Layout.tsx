import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageData } from '../hooks/usePageData';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { data: contactData } = usePageData('contact');

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Formations', path: '/formations' },
    { name: 'Produits', path: '/boutique' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Link to="/">
              <img src="/images/logos/sogip_group.svg" className="h-10 w-auto" alt="Logo SOGIP" />
            </Link>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`transition hover:text-amber-500 ${location.pathname === link.path ? 'text-amber-500' : 'text-slate-800'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link 
            to="/contact"
            className="hidden md:inline-block bg-amber-500 text-white transition font-semibold px-5 py-2 rounded-full hover:bg-amber-400"
          >
            Démarrer →
          </Link>

          {/* Bouton Hamburger Mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none"
            aria-label="Menu"
          >
            <span className={`w-full h-0.5 bg-slate-800 transition-all duration-300 origin-left ${isMenuOpen ? 'rotate-45' : ''}`}></span>
            <span className={`w-full h-0.5 bg-slate-800 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-0.5 bg-slate-800 transition-all duration-300 origin-left ${isMenuOpen ? '-rotate-45' : ''}`}></span>
          </button>
        </div>

        {/* Menu Déroulant Mobile */}
        <div className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 p-6 flex flex-col gap-6 md:hidden transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0 p-0 overflow-hidden'}`}>
          <nav className="flex flex-col gap-4 text-base font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`mobile-link transition py-2 border-b border-slate-50 hover:text-amber-500 ${location.pathname === link.path ? 'text-amber-500' : 'text-slate-800'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <Link 
            to="/contact"
            className="mobile-link block text-center bg-amber-500 text-white transition font-semibold px-5 py-3 rounded-full hover:bg-amber-400 mt-4"
          >
            Démarrer →
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col w-full relative pt-20">
        {children}
      </main>

      {/* FOOTER CLASSIQUE (plus de sticky reveal) */}
      <footer className="bg-slate-900 text-white py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/images/logos/sogip_group.svg" className="h-10 w-auto brightness-0 invert mb-6" alt="Logo SOGIP" />
            <p className="text-sm text-slate-400">
              Transformons le potentiel en réussite. SOGIP Group est votre partenaire de confiance pour le BTP, l'Immobilier, l'Énergie et la Formation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-500">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-amber-500 transition">Accueil</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition">À propos</Link></li>
              <li><Link to="/services" className="hover:text-amber-500 transition">Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-500">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{contactData?.info?.email || "contact@sogipgroup.com"}</li>
              <li>{contactData?.info?.telephone || "+224 620 52 12 49"}</li>
              <li>{contactData?.info?.adresse || "Bluezone de Dixinn, Conakry, Guinée"}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-amber-500">Réseaux</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-500 transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SOGIP Group. Tous droits réservés.
        </div>
      </footer>

      {/* WHATSAPP WIDGET */}
      <a 
        href="https://wa.me/224620521249" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-transform hover:scale-110 z-50 flex items-center justify-center group"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
};

export default Layout;
