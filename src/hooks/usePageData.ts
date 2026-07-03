import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface PageContentItem {
  id: number;
  page: string;
  section: string;
  cle: string;
  valeur: string;
  type: string;
  ordre: number;
  actif: number;
}

// Cache global pour éviter les requêtes dupliquées
const pageCache: Record<string, Record<string, Record<string, string>>> = {};

export const usePageData = (pageName: string) => {
  const [data, setData] = useState<Record<string, Record<string, string>>>(
    pageCache[pageName] || {}
  );
  const [loading, setLoading] = useState<boolean>(!pageCache[pageName]);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = React.useRef(!!pageCache[pageName]);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchPageData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/pages/${pageName}`);
        if (response.success && response.data) {
          // Gérer soit le format PHP (déjà imbriqué) soit un format plat
          let formattedData = response.data;
          
          if (Array.isArray(response.data)) {
            // Fallback si c'est le vieux format
            formattedData = {};
            response.data.forEach((item: PageContentItem) => {
              if (item.page !== pageName) return;
              if (!formattedData[item.section]) formattedData[item.section] = {};
              formattedData[item.section][item.cle] = item.valeur;
            });
          }

          pageCache[pageName] = formattedData;
          setData(formattedData);
          hasFetched.current = true;
        } else {
          setError('Format de réponse invalide');
        }
      } catch (err: any) {
        console.error(`Erreur lors du chargement des données de la page ${pageName}:`, err);
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageName]);

  return { data, loading, error };
};
