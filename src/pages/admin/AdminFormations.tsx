import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, AlertCircle, Upload } from 'lucide-react';
import { api } from '../../services/api';

interface Formation {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  actif: boolean;
}

const RATES: Record<string, number> = { EUR: 1, USD: 1.08, FCFA: 655, GNF: 9300 };

const AdminFormations: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Formation>>({});
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [inputCurrency, setInputCurrency] = useState('GNF');
  const [inputValue, setInputValue] = useState<number | string>('');

  useEffect(() => {
    fetchFormations();
  }, []);

  useEffect(() => {
    if (formData.price !== undefined && formData.price !== null) {
      setInputValue(Math.round(formData.price * RATES[inputCurrency]));
    } else {
      setInputValue('');
    }
  }, [inputCurrency, formData.price]);

  const fetchFormations = async () => {
    try {
      const response = await api.get('/admin/formations');
      setFormations(response);
    } catch (error) {
      console.error('Failed to fetch formations', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des formations.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputValue(e.target.value);
    if (!isNaN(val)) {
      setFormData(prev => ({ ...prev, price: Math.round(val / RATES[inputCurrency]) }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image est trop volumineuse (max 2MB).' });
      return;
    }

    setMessage({ type: 'success', text: 'Upload en cours...' });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setMessage({ type: 'success', text: 'Image importée avec succès !' });
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: "Erreur lors de la lecture de l'image." });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (editingId) {
        const response = await api.put(`/admin/formations/${editingId}`, formData);
        setFormations(formations.map(f => f.id === editingId ? response : f));
        setMessage({ type: 'success', text: 'Formation mise à jour avec succès.' });
      } else {
        const response = await api.post('/admin/formations', formData);
        setFormations([response, ...formations]);
        setMessage({ type: 'success', text: 'Formation ajoutée avec succès.' });
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
    try {
      await api.delete(`/admin/formations/${id}`);
      setFormations(formations.filter(f => f.id !== id));
      setMessage({ type: 'success', text: 'Formation supprimée avec succès.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression.' });
    }
  };

  const toggleStatus = async (formation: Formation) => {
    try {
      // Use dedicated toggle route to avoid sending full object with Date fields
      const response = await api.put(`/admin/formations/${formation.id}/toggle`, { actif: !formation.actif });
      setFormations(formations.map(f => f.id === formation.id ? { ...f, actif: response.actif } : f));
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de statut.' });
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formations (Cef Conseils)</h1>
            <p className="text-gray-500 mt-1">Gérez le catalogue des formations professionnelles</p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => { setIsAdding(true); setFormData({ actif: true, price: 0 }); setInputValue(''); }}
              className="flex items-center gap-2 bg-sogip-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              Nouvelle Formation
            </button>
          )}
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border`}>
            <AlertCircle size={20} />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              {isAdding ? 'Nouvelle Formation' : 'Modifier la Formation'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select required name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Environnement & Énergies">Environnement & Énergies</option>
                  <option value="Agriculture & Agronomie">Agriculture & Agronomie</option>
                  <option value="Bâtiment & Travaux Publics">Bâtiment & Travaux Publics</option>
                  <option value="Santé">Santé</option>
                  <option value="Commerce & Informatique">Commerce & Informatique</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (ex: 2 Jours)</label>
                <input required type="text" name="duration" value={formData.duration || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    value={inputValue}
                    onChange={handlePriceChange}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Montant"
                    min="0"
                  />
                  <select
                    value={inputCurrency}
                    onChange={(e) => setInputCurrency(e.target.value)}
                    className="w-24 px-2 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="FCFA">FCFA</option>
                    <option value="GNF">GNF</option>
                  </select>
                </div>
                {formData.price !== undefined && inputCurrency !== 'EUR' && (
                  <p className="text-xs text-gray-500 mt-1">Équivalent stocké : {formData.price} EUR</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de la formation</label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg shadow-sm flex-shrink-0" />}
                  <div className="flex-1">
                    <input
                      type="text"
                      name="image"
                      value={formData.image || ''}
                      onChange={handleInputChange}
                      placeholder="URL de l'image (ou importez via le bouton ci-dessous)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Upload size={16} />
                      <span>Importer une image depuis votre appareil</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                <textarea required rows={3} name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="actif" name="actif" checked={formData.actif !== false} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="actif" className="text-sm text-gray-700">Formation visible publiquement</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">
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
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Formation</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Catégorie</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Durée</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Statut</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formations.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucune formation trouvée.</td></tr>
              ) : (
                formations.map((formation) => (
                  <tr key={formation.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formation.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{formation.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{formation.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formation.duration}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(formation)} className={`flex items-center gap-2 ${formation.actif ? 'text-green-600' : 'text-gray-400'}`}>
                        {formation.actif ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        <span className="text-sm font-medium">{formation.actif ? 'Actif' : 'Inactif'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingId(formation.id); setFormData(formation); setIsAdding(false); window.scrollTo(0,0); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(formation.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default AdminFormations;
