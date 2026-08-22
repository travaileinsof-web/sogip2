import sys

code = """import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Eye, EyeOff, MapPin, Home, X, Upload } from 'lucide-react';
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
  city?: string | null;
  neighborhood?: string | null;
  area: number | null;
  image: string;
  gallery: string | null;
  features: string | null;
  specifications: string | null;
  actif: boolean;
}

const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 1200;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7)); // Compress as webp 70% quality
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Property> & { specs?: any }>({
    status: 'Disponible',
    transactionType: 'Vente',
    propertyType: 'Maison',
    currency: 'GNF',
    specs: {}
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/admin/properties');
      setProperties(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des offres immobilières.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await compressImage(file);
      setFormData(prev => ({ ...prev, image: base64 }));
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    let currentGallery: string[] = [];
    if (typeof formData.gallery === 'string') {
      try { currentGallery = JSON.parse(formData.gallery); } catch(e) {}
    } else if (Array.isArray(formData.gallery)) {
      currentGallery = formData.gallery;
    }

    const newGallery: string[] = [];
    for (const file of files) {
      const base64 = await compressImage(file);
      newGallery.push(base64);
    }

    setFormData(prev => ({ 
      ...prev, 
      gallery: JSON.stringify([...currentGallery, ...newGallery]) 
    }));
    setMessage({ type: 'success', text: `${newGallery.length} image(s) ajoutée(s) à la galerie.` });
  };

  const removeGalleryImage = (indexToRemove: number) => {
    let currentGallery: string[] = [];
    if (typeof formData.gallery === 'string') {
      try { currentGallery = JSON.parse(formData.gallery); } catch(e) {}
    }
    currentGallery.splice(indexToRemove, 1);
    setFormData(prev => ({ ...prev, gallery: JSON.stringify(currentGallery) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        specifications: formData.specs ? JSON.stringify(formData.specs) : null,
      };

      if (formData.id) {
        await api.put(`/admin/properties/${formData.id}`, payload);
        setMessage({ type: 'success', text: 'Offre mise à jour avec succès.' });
      } else {
        await api.post('/admin/properties', payload);
        setMessage({ type: 'success', text: 'Offre créée avec succès.' });
      }
      setShowForm(false);
      setFormData({ status: 'Disponible', transactionType: 'Vente', propertyType: 'Maison', currency: 'GNF', specs: {} });
      fetchProperties();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setMessage({ type: 'success', text: 'Offre supprimée.' });
      fetchProperties();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/admin/properties/${id}/toggle`, { actif: !currentStatus });
      fetchProperties();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification du statut.' });
    }
  };

  const editProperty = (property: Property) => {
    let parsedSpecs = {};
    if (property.specifications) {
      try { parsedSpecs = JSON.parse(property.specifications); } catch(e) {}
    }
    setFormData({ ...property, specs: parsedSpecs });
    setShowForm(true);
  };

  const renderDynamicFields = () => {
    const type = formData.propertyType;
    
    if (type === 'Terrain') {
      return (
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="col-span-full font-bold text-gray-700">Caractéristiques du Terrain</h4>
          <label className="flex items-center space-x-2"><input type="checkbox" name="cloture" checked={formData.specs?.cloture || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Clôturé</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="bord_route" checked={formData.specs?.bord_route || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Bordure de route</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="electrifie" checked={formData.specs?.electrifie || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Zone Électrifiée</span></label>
          <label className="flex items-center space-x-2"><input type="checkbox" name="titre_foncier" checked={formData.specs?.titre_foncier || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Titre Foncier</span></label>
        </div>
      );
    }
    
    if (['Maison', 'Villa', 'Appartement'].includes(type || '')) {
      return (
        <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border space-y-4">
          <h4 className="font-bold text-gray-700">Pièces</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div><label className="text-xs text-gray-500">Chambres</label><input type="number" name="chambres" value={formData.specs?.chambres || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Salons</label><input type="number" name="salons" value={formData.specs?.salons || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Douches</label><input type="number" name="douches" value={formData.specs?.douches || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Toilettes</label><input type="number" name="toilettes" value={formData.specs?.toilettes || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Balcons</label><input type="number" name="balcons" value={formData.specs?.balcons || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Magasin</label><input type="number" name="magasins" value={formData.specs?.magasins || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Niveaux (R+)</label><input type="text" name="etages" value={formData.specs?.etages || ''} onChange={handleSpecChange} placeholder="ex: R+1" className="w-full border rounded p-2" /></div>
          </div>
          <h4 className="font-bold text-gray-700 pt-2 border-t">Commodités</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2"><input type="checkbox" name="forage" checked={formData.specs?.forage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Forage (Eau)</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="groupe_electro" checked={formData.specs?.groupe_electro || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Groupe Électrogène</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="gardiennage" checked={formData.specs?.gardiennage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Gardiennage</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="chauffe_eau" checked={formData.specs?.chauffe_eau || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Chauffe-eau</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="piscine" checked={formData.specs?.piscine || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Piscine</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="parking" checked={formData.specs?.parking || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Parking / Garage</span></label>
          </div>
        </div>
      );
    }

    if (type === 'Immeuble') {
      return (
        <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border space-y-4">
          <h4 className="font-bold text-gray-700">Caractéristiques de l'Immeuble</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="text-xs text-gray-500">Nombre d'étages (R+)</label><input type="number" name="nb_etages" value={formData.specs?.nb_etages || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
            <div><label className="text-xs text-gray-500">Nombre d'appartements</label><input type="number" name="nb_apparts" value={formData.specs?.nb_apparts || ''} onChange={handleSpecChange} className="w-full border rounded p-2" min="0" /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <label className="flex items-center space-x-2"><input type="checkbox" name="parking" checked={formData.specs?.parking || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Parking sous-terrain</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="ascenseur" checked={formData.specs?.ascenseur || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Ascenseur</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="forage" checked={formData.specs?.forage || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Forage</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="groupe_electro" checked={formData.specs?.groupe_electro || false} onChange={handleSpecChange} className="rounded text-emerald-600 focus:ring-emerald-500" /><span>Groupe Électrogène</span></label>
          </div>
        </div>
      );
    }

    return null;
  };

  let galleryArr: string[] = [];
  if (formData.gallery) {
    try { galleryArr = JSON.parse(formData.gallery); } catch(e) {}
  }

  return (
    <AdminLayout title="Gestion Immobilière">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Catalogue Immobilier</h2>
            <p className="text-gray-500 mt-1">Gérez vos offres, ajoutez des images et définissez les spécificités</p>
          </div>
          <button
            onClick={() => { setFormData({ status: 'Disponible', transactionType: 'Vente', propertyType: 'Maison', currency: 'GNF', specs: {} }); setShowForm(true); }}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Offre
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {showForm ? (
          <div className="bg-gray-50 p-6 rounded-xl border mb-8">
            <h3 className="text-lg font-bold mb-4">{formData.id ? 'Modifier l\'Offre' : 'Ajouter une Offre'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'annonce</label>
                  <input required type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="ex: Magnifique Villa à Kipé" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Région / Préfecture</label>
                  <input required type="text" name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="ex: Conakry, Kindia, Coyah..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville / Commune</label>
                    <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="ex: Ratoma" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                    <input type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="ex: Kipé" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien</label>
                  <select name="propertyType" value={formData.propertyType || 'Maison'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option value="Terrain">Terrain</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Villa">Villa</option>
                    <option value="Immeuble">Immeuble</option>
                    <option value="Bureau">Bureau</option>
                    <option value="Commerce">Commerce / Boutique</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction</label>
                    <select name="transactionType" value={formData.transactionType || 'Vente'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                      <option value="Vente">Vente</option>
                      <option value="Location">Location</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut du bien</label>
                    <select name="status" value={formData.status || 'Disponible'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                      <option value="Disponible">Disponible</option>
                      <option value="Vendu">Déjà Vendu</option>
                      <option value="Loué">Déjà Loué</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                    <input required type="number" name="price" value={formData.price || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                    <select name="currency" value={formData.currency || 'GNF'} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                      <option value="GNF">GNF</option>
                      <option value="FCFA">FCFA</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surface (m²) - Optionnel</label>
                  <input type="number" name="area" value={formData.area || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>

                {renderDynamicFields()}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description libre</label>
                  <textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                {/* IMAGE PRINCIPALE */}
                <div className="md:col-span-2 bg-white p-4 border rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Image Principale (Vitrine)</label>
                  <div className="flex items-center gap-6">
                    {formData.image && (
                      <div className="relative">
                        <img src={formData.image} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg border shadow-sm" />
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-lg p-6 text-center cursor-pointer hover:bg-emerald-100 transition-colors">
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      <Upload className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                      <span className="text-emerald-700 font-medium">{formData.image ? 'Changer l\'image principale' : 'Sélectionner l\'image principale'}</span>
                      <p className="text-xs text-gray-500 mt-1">Image qui apparaîtra sur la carte</p>
                    </label>
                  </div>
                </div>

                {/* GALERIE D'IMAGES */}
                <div className="md:col-span-2 bg-white p-4 border rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Galerie Photos (Optionnel, plusieurs possibles)</label>
                  
                  {galleryArr.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      {galleryArr.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-24 object-cover rounded-lg border" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="file" multiple className="sr-only" accept="image/*" onChange={handleGalleryUpload} onClick={(e) => { e.currentTarget.value = ''; }} />
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-700 font-medium">Ajouter des photos à la galerie</span>
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez plusieurs images simultanément</p>
                  </label>
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={isSubmitting} className={`px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 ${isSubmitting ? 'opacity-50' : ''}`}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'offre'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Home className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Aucune offre immobilière disponible.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-4 rounded-tl-lg">Bien</th>
                  <th className="p-4">Type / Statut</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4 text-center">Visibilité</th>
                  <th className="p-4 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={property.image} alt={property.title} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city || property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{property.propertyType}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${property.status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {property.transactionType} - {property.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-600">
                      {new Intl.NumberFormat('fr-GN').format(property.price)} {property.currency}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleStatus(property.id, property.actif)} className={`p-2 rounded-lg transition-colors ${property.actif ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {property.actif ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => editProperty(property)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(property.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
"""

with open('src/pages/admin/AdminProperties.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated AdminProperties.tsx")
