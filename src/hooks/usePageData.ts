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

export const usePageData = (pageName: string) => {
  const [data, setData] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/pages');
        if (response.success && Array.isArray(response.data)) {
          // Filtrer par page et transformer en objet imbriqué: data[section][cle] = valeur
          const pageItems = response.data.filter((item: PageContentItem) => item.page === pageName);
          
          const formattedData: Record<string, Record<string, string>> = {};
          
          pageItems.forEach((item: PageContentItem) => {
            if (!formattedData[item.section]) {
              formattedData[item.section] = {};
            }
            formattedData[item.section][item.cle] = item.valeur;
          });
          
          setData(formattedData);
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
