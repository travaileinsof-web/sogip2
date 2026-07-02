import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface Training {
  id: number;
  titre: string;
  niveau: string;
  duree_heures: number | null;
  duree_jours: number | null;
  actif: number;
  description: string;
}

const AdminTrainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Training>>({});
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/admin/formations');
      if (response.success) {
        setTrainings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch trainings', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des formations.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (editingId) {
        const response = await api.put(`/admin/formations/${editingId}`, formData);
        if (response.success) {
          setMessage({ type: 'success', text: 'Formation mise à jour avec succès.' });
        }
      } else {
        const response = await api.post('/admin/formations', formData);
        if (response.success) {
          setMessage({ type: 'success', text: 'Formation créée avec succès.' });
        }
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      fetchTrainings();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
    }
  };

  const handleEdit = (t: Training) => {
    setFormData(t);
    setEditingId(t.id);
    setIsAdding(true);
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette formation ?')) return;
    try {
      await api.delete(`/admin/formations/${id}`);
      fetchTrainings();
    } catch (error) {
      console.error('Failed to delete training', error);
    }
  };

  const handleToggle = async (id: number, actif: number) => {
    try {
      await api.put(`/admin/formations/${id}/toggle`, { actif: actif ? 0 : 1 });
      fetchTrainings();
    } catch (error) {
      console.error('Failed to toggle training', error);
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
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Gestion des Formations (Académie)</h3>
          {!isAdding && (
            <button 
              onClick={() => { setFormData({ niveau: 'intermediaire', actif: 1 }); setIsAdding(true); setEditingId(null); setMessage(null); }}
              className="px-4 py-2 bg-sogip-primary text-white rounded-md hover:bg-blue-900 transition-colors flex items-center text-sm font-medium"
            >
              <Plus size={18} className="mr-2" />
              Nouvelle Formation
            </button>
          )}
        </div>
        
        {message && (
          <div className={`mx-6 mt-4 p-4 rounded-md flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
             <AlertCircle className="w-5 h-5 mr-2" />
             {message.text}
          </div>
        )}

        {isAdding ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-800">{editingId ? 'Modifier la formation' : 'Ajouter une formation'}</h4>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la formation *</label>
                <input required type="text" name="titre" value={formData.titre || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select name="niveau" value={formData.niveau || 'intermediaire'} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary">
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
                  <input type="number" name="duree_jours" value={formData.duree_jours || ''} onChange={handleInputChange} placeholder="ex: 3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required rows={4} name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sogip-primary focus:border-sogip-primary" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-sogip-primary text-white rounded-md hover:bg-blue-900 transition-colors flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {editingId ? 'Mettre à jour' : 'Créer la formation'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {trainings.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Aucune formation disponible.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 border-b">Titre</th>
                    <th className="px-6 py-4 border-b">Niveau</th>
                    <th className="px-6 py-4 border-b">Durée</th>
                    <th className="px-6 py-4 border-b">Statut</th>
                    <th className="px-6 py-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trainings.map((training) => (
                    <tr key={training.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{training.titre}</td>
                      <td className="px-6 py-4 text-gray-500 capitalize">{training.niveau}</td>
                      <td className="px-6 py-4 text-gray-500">{training.duree_jours ? `${training.duree_jours} jours` : '-'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggle(training.id, training.actif)} className="flex items-center focus:outline-none">
                          {training.actif ? (
                            <ToggleRight size={24} className="text-green-500 mr-2" />
                          ) : (
                            <ToggleLeft size={24} className="text-gray-400 mr-2" />
                          )}
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${training.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {training.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(training)} className="text-sogip-primary hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Modifier">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(training.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTrainings;
