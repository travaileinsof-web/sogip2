import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, MapPin, Home } from 'lucide-react';
import { api } from '../../services/api';

export interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  transactionType: string;
  status: string;
  price: number;
  currency: string;
  location: string;
  area: number | null;
  image: string;
  gallery: string | null;
  features: string | null;
  actif: boolean;
  createdAt: string;
}

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/admin/properties');
      setProperties(response);
    } catch (error) {
      console.error('Failed to fetch properties', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des offres immobilières.' });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image est trop volumineuse (max 5MB).' });
      return;
    }

    setMessage({ type: 'success', text: 'Upload en cours...' });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setMessage({ type: 'success', text: 'Image principale importée avec succès !' });
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: "Erreur lors de la lecture de l'image." });
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    setMessage({ type: 'success', text: 'Upload galerie en cours...' });
    
    const newGallery: string[] = [];
    let currentGallery: string[] = [];
    
    if (typeof formData.gallery === 'string') {
      try { currentGallery = JSON.parse(formData.gallery); } catch(e) {}
    } else if (Array.isArray(formData.gallery)) {
      currentGallery = formData.gallery;
    }
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newGallery.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    
    setFormData(prev => ({ ...prev, gallery: JSON.stringify([...currentGallery, ...newGallery]) }));
    setMessage({ type: 'success', text: `${newGallery.length} image(s) ajoutée(s) à  la galerie.` });
  };

  const removeGalleryImage = (index: number) => {
    let currentGallery: string[] = [];
    if (typeof formData.gallery === 'string') {
      try { currentGallery = JSON.parse(formData.gallery); } catch(e) {}
    }
    currentGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, gallery: JSON.stringify(currentGallery) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setMessage(null);
    setIsSubmitting(true);
    try {
      if (editingId) {
        const response = await api.put(`/admin/properties/${editingId}`, formData);
        setProperties(properties.map(p => p.id === editingId ? response : p));
        setMessage({ type: 'success', text: 'Offre mise à  jour avec succès.' });
      } else {
        const response = await api.post('/admin/properties', formData);
        setProperties([response, ...properties]);
        setMessage({ type: 'success', text: 'Offre ajoutée avec succès.' });
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('àƒÅ tes-vous sà»r de vouloir supprimer cette offre ?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(properties.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Offre supprimée avec succès.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la suppression.' });
    }
  };

  const toggleStatus = async (property: Property) => {
    try {
      const response = await api.put(`/admin/properties/${property.id}/toggle`, { actif: !property.actif });
      setProperties(properties.map(p => p.id === property.id ? { ...p, actif: response.property.actif } : p));
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de statut (visibilité).' });
    }
  };

  if (loading) return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Immobilier (Le Proprio)</h1>
            <p className="text-gray-500 mt-1">Gérez le catalogue des offres immobilières</p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => { setIsAdding(true); setFormData({ actif: true, price: 0, propertyType: 'Terrain', transactionType: 'Vente', status: 'Disponible', currency: 'GNF' }); }}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus size={20} />
              Nouvelle Offre
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
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
              {isAdding ? 'Ajouter une Offre Immobilière' : 'Modifier l\'Offre'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'annonce</label>
                <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="ex: Magnifique Villa à  Kipé" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input required type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="ex: Kipé, Conakry" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
                <select required name="propertyType" value={formData.propertyType || 'Terrain'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="Terrain">Terrain</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison/Villa">Maison / Villa</option>
                  <option value="Immeuble">Immeuble</option>
                  <option value="Bureau/Commerce">Bureau / Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction</label>
                <select required name="transactionType" value={formData.transactionType || 'Vente'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="Vente">Vente</option>
                  <option value="Location">Location</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut du bien</label>
                <select required name="status" value={formData.status || 'Disponible'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="Disponible">Disponible</option>
                  <option value="Vendu">Déjà  Vendu</option>
                  <option value="Loué">Déjà  Loué</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                <div className="flex gap-2">
                  <input required type="number" name="price" value={formData.price || ''} onChange={handleInputChange} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
                  <select name="currency" value={formData.currency || 'GNF'} onChange={handleInputChange} className="w-24 px-2 border rounded-lg bg-gray-50">
                    <option value="GNF">GNF</option>
                    <option value="FCFA">FCFA</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surface (m²) - Optionnel</label>
                <input type="number" name="area" value={formData.area || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="0" placeholder="ex: 500" />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
                <textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Décrivez le bien en détail..."></textarea>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Principale</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="space-y-2 text-center">
                    {formData.image ? (
                      <div className="relative inline-block">
                        <img src={formData.image} alt="Aperà§u" className="max-h-48 rounded-lg mx-auto shadow-sm" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Home className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 px-2 py-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Importer un fichier</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleFileUpload} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à  5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Galerie d'images additionnelles</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:bg-gray-50 transition-colors">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 px-2 py-1">
                          <span>Ajouter des images à  la galerie</span>
                          <input type="file" multiple className="sr-only" accept="image/*" onChange={handleGalleryUpload} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Vous pouvez sélectionner plusieurs images en même temps</p>
                    </div>
                  </div>
                  
                  {formData.gallery && typeof formData.gallery === 'string' && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        try {
                          const parsed = JSON.parse(formData.gallery);
                          return parsed.map((img: string, idx: number) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
                              <img src={img} alt={`Gallery ${idx}`} className="h-24 w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ));
                        } catch(e) { return null; }
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="col-span-full">
                  <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" name="actif" checked={formData.actif !== false} onChange={handleInputChange} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <div>
                    <span className="block font-medium text-gray-900">Publier l'offre immédiatement</span>
                    <span className="block text-sm text-gray-500">Si décoché, l'offre sera sauvegardée mais invisible pour les visiteurs.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({}); }} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">{isSubmitting ? "Enregistrement..." : "Enregistrer l'offre"}</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Bien</th>
                  <th className="p-4 font-semibold text-gray-600">Détails</th>
                  <th className="p-4 font-semibold text-gray-600">Prix</th>
                  <th className="p-4 font-semibold text-gray-600">Statut</th>
                  <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={prop.image || 'https://via.placeholder.com/150'} alt={prop.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border" />
                        <div>
                          <p className="font-semibold text-gray-900">{prop.title}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1" />
                            {prop.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium mb-1 mr-2">{prop.propertyType}</span>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${prop.transactionType === 'Vente' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                        {prop.transactionType}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {prop.price.toLocaleString('fr-FR')} <span className="text-sm text-gray-500">{prop.currency}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-center w-28 ${
                          prop.status === 'Disponible' ? 'bg-green-100 text-green-800' : 
                          prop.status === 'Vendu' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {prop.status}
                        </span>
                        <button
                          onClick={() => toggleStatus(prop)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-28 transition-colors ${
                            prop.actif ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {prop.actif ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Masqué</>}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setFormData(prop);
                            setEditingId(prop.id);
                            setIsAdding(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      <Home className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900">Aucune offre immobilière</p>
                      <p className="mt-1">Cliquez sur "Nouvelle Offre" pour commencer à  ajouter des biens.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;


