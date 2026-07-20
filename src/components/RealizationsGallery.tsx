import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Realization {
  id: number;
  title: string | null;
  category: string;
  image: string;
  createdAt: string;
}

interface Props {
  category?: string;
  limit?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  btp: 'BTP & Ingénierie',
  immo: 'Immobilier',
  energie: 'Énergies Renouvelables',
  academie: 'Académie & Formation'
};

const CATEGORY_LINKS: Record<string, string> = {
  btp: '/sogip-btp',
  immo: '/sogip-immo',
  energie: '/sogip-energie',
  academie: '/cef-conseils'
};

const RealizationsGallery: React.FC<Props> = ({ category, limit }) => {
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealizations = async () => {
      try {
        const queryParams = category ? `?category=${category}` : '';
        let data = await api.get(`/realizations${queryParams}`);
        if (limit && limit > 0) {
          data = data.slice(0, limit);
        }
        setRealizations(data);
      } catch (error) {
        console.error('Failed to load realizations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRealizations();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-sogip-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (realizations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
        <p>Aucune réalisation trouvée dans cette catégorie pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {realizations.map((item) => (
        <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200">
          <img 
            src={item.image} 
            alt={item.title || 'Réalisation SOGIP'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <span className="text-sogip-accent font-semibold text-sm mb-1 uppercase tracking-wider">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            {item.title && (
              <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
            )}
            {!category && CATEGORY_LINKS[item.category] && (
              <Link 
                to={CATEGORY_LINKS[item.category]}
                className="inline-flex items-center text-white hover:text-sogip-primary transition-colors text-sm font-medium gap-2"
              >
                Découvrir le service <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RealizationsGallery;
