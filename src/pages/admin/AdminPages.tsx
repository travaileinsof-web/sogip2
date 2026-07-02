import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Edit, Save, X, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface PageContent {
  id: number;
  page: string;
  section: string;
  cle: string;
  valeur: string;
  type: string;
  modifie_le: string;
}

const AdminPages: React.FC = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await api.get('/admin/pages');
      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch pages content', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des pages.' });
    } finally {
      setLoading(false);
    }
  };

  // Grouper par page
  const pagesList = Array.from(new Set(contents.map(c => c.page)));

  const handleEdit = (page: string) => {
    const pageContents = contents.filter(c => c.page === page);
    const formData: Record<string, string> = {};
    pageContents.forEach(c => {
      formData[`${c.section}__${c.cle}`] = c.valeur;
    });
    setEditFormData(formData);
    setEditingPage(page);
    setMessage(null);
  };

  const handleFormChange = (key: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);
    setMessage(null);

    const items = Object.entries(editFormData).map(([key, valeur]) => {
      const [section, cle] = key.split('__');
      // On cherche le type d'origine
      const original = contents.find(c => c.page === editingPage && c.section === section && c.cle === cle);
      return {
        page: editingPage,
        section,
        cle,
        valeur,
        type: original ? original.type : 'texte'
      };
    });

    try {
      const response = await api.post('/admin/pages/batch', { items });
      if (response.success) {
        setMessage({ type: 'success', text: 'Contenus mis à jour avec succès.' });
        await fetchPages();
        setTimeout(() => setEditingPage(null), 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Erreur de sauvegarde.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur réseau.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Chargement...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Gestion des Contenus (Pages)</h3>
        </div>
        
        {message && (
          <div className={`m-4 p-4 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
             <AlertCircle className="w-5 h-5 mr-2" />
             {message.text}
          </div>
        )}

        {editingPage === null ? (
          <div className="overflow-x-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagesList.length === 0 ? (
                <p className="text-gray-500">Aucun contenu trouvé dans la base de données. Exécutez le script SQL d'initialisation.</p>
              ) : (
                pagesList.map((page) => (
                  <div key={page} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h4 className="text-xl font-bold text-gray-800 capitalize mb-2">{page}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {contents.filter(c => c.page === page).length} clés de contenu
                    </p>
                    <button 
                      onClick={() => handleEdit(page)}
                      className="w-full py-2 bg-blue-50 text-sogip-primary rounded-md font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <Edit size={16} className="mr-2" /> Éditer le contenu
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 capitalize">
                Édition : {editingPage}
              </h4>
              <button 
                onClick={() => { setEditingPage(null); setMessage(null); }}
                className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Grouper par section pour l'affichage */}
              {Array.from(new Set(contents.filter(c => c.page === editingPage).map(c => c.section))).map(section => (
                <div key={section} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-800 capitalize mb-4 pb-2 border-b border-gray-200">
                    Section : {section}
                  </h5>
                  <div className="space-y-4">
                    {contents.filter(c => c.page === editingPage && c.section === section).map(item => (
                      <div key={item.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {item.cle} <span className="text-xs text-gray-400">({item.type})</span>
                        </label>
                        {item.type === 'texte_long' || item.type === 'json' ? (
                          <textarea 
                            rows={item.type === 'json' ? 6 : 4}
                            value={editFormData[`${item.section}__${item.cle}`] || ''}
                            onChange={(e) => handleFormChange(`${item.section}__${item.cle}`, e.target.value)}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary ${item.type === 'json' ? 'font-mono text-sm' : ''}`}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={editFormData[`${item.section}__${item.cle}`] || ''}
                            onChange={(e) => handleFormChange(`${item.section}__${item.cle}`, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-sogip-primary text-white rounded-md hover:bg-blue-900 transition-colors flex items-center font-medium disabled:opacity-50"
                >
                  <Save size={18} className="mr-2" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
