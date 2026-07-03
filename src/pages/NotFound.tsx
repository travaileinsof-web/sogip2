import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/animations/FadeIn';

const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
    <FadeIn>
      <p className="text-amber-500 font-semibold uppercase tracking-widest mb-4">Erreur 404</p>
      <h1 className="title-font text-6xl font-bold text-blue-900 mb-6">Page introuvable</h1>
      <p className="text-slate-600 mb-10 max-w-md mx-auto">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transition">
        Retour à l'accueil →
      </Link>
    </FadeIn>
  </div>
);

export default NotFound;
