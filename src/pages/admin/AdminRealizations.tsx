import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Save, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

interface Realization {
  id: number;
  title: string | null;
  category: string;
  image: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'btp', label: 'Infrastructures BTP' },
  { value: 'immo', label: 'Immobilier (LeProprio)' },
  { value: 'energie', label: 'Énergies Renouvelables (Soleil Guinée)' },
  { value: 'academie', label: 'Formation (Académie / CEF Conseils)' }
];

const AdminRealizations: React.FC = () => {
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Realization>>({ category: 'btp' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchRealizations();
  }, []);

  const fetchRealizations = async () => {
    try {
      const response = await api.get('/admin/realizations');
      setRealizations(response);
    } catch (error) {
      console.error('Failed to fetch realizations', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des réalisations.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage({ type: 'success', text: 'Upload en cours...' });
    const fd = new FormData();
    fd.append('image', file);
    try {
      const response = await api.post('/admin/upload', fd);
      setFormData(prev => ({ ...prev, image: response.url }));
      setMessage({ type: 'success', text: 'Image importée avec succès !' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Erreur lors de l'upload de l'image." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!formData.image) {
      setMessage({ type: 'error', text: 'Une image est obligatoire.' });
      return;
    }
    try {
      const response = await api.post('/admin/realizations', formData);
      setRealizations([response, ...realizations]);
      setMessage({ type: 'success', text: 'Réalisation ajoutée avec succès.' });
      setIsAdding(false);
      setFormData({ category: 'btp' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) return;
    try {
      await api.delete(`/admin/realizations/${id}`);
      setRealizations(realizations.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Réalisation supprimée avec succès.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression.' });
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nos Réalisations</h1>
            <p className="text-gray-500 mt-1">Gérez la galerie d'images des réalisations par filiale</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => { setIsAdding(true); setFormData({ category: 'btp' }); }}
              className="flex items-center gap-2 bg-sogip-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              Ajouter une réalisation
            </button>
          )}
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border`}>
            <AlertCircle size={20} />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Nouvelle Réalisation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie / Filiale</label>
                <select
                  required
                  name="category"
                  value={formData.category || 'btp'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre court (Optionnel)</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} placeholder="Ex: Chantier Kaloum" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de la réalisation *</label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <img src={formData.image} alt="Aperçu" className="h-24 w-32 object-cover rounded-lg shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="h-24 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      name="image"
                      required
                      value={formData.image || ''}
                      onChange={handleInputChange}
                      placeholder="URL de l'image (ou importez via le bouton)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Upload size={16} />
                      <span>Importer une image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => { setIsAdding(false); setFormData({ category: 'btp' }); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Annuler
              </button>
              <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                <Save size={18} />
                Enregistrer
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Aperçu</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Titre</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Catégorie</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {realizations.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Aucune réalisation pour le moment.</td></tr>
              ) : (
                realizations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={item.image} alt={item.title || 'Réalisation'} className="h-16 w-24 object-cover rounded shadow-sm" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRealizations;
