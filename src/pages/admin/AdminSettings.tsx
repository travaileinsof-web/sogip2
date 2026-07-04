import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, AlertCircle, Plus, Trash2, Upload } from 'lucide-react';
import { api } from '../../services/api';

const parseArray = (str: any, defaultArr: any[]) => {
  if (!str) return defaultArr;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [str];
  } catch {
    return [str];
  }
};

const AdminSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    contact_emails: [''],
    contact_phones: [''],
    contact_address: '',
    socials: [{ platform: 'Facebook', url: '' }],
    photo_fondateur: '',
    photo_directeur: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setFormData(prev => ({
        ...prev,
        contact_emails: parseArray(response.contact_emails || response.contact_email, ['']),
        contact_phones: parseArray(response.contact_phones || response.contact_phone, ['']),
        socials: parseArray(response.socials, [
          { platform: 'Facebook', url: response.social_facebook || '' },
          { platform: 'LinkedIn', url: response.social_linkedin || '' },
          { platform: 'TikTok', url: response.social_tiktok || '' },
        ]).filter((s: any) => s.url || s.platform),
        photo_fondateur: response.photo_fondateur || '',
        photo_directeur: response.photo_directeur || '',
        contact_address: response.contact_address || ''
      }));
    } catch (error) {
      console.error('Erreur chargement settings', error);
      setMessage({ type: 'error', text: 'Impossible de charger les paramètres.' });
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (index: number, field: 'contact_emails' | 'contact_phones', value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'contact_emails' | 'contact_phones') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index: number, field: 'contact_emails' | 'contact_phones') => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    if (newArray.length === 0) newArray.push('');
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSocialChange = (index: number, key: 'platform' | 'url', value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index] = { ...newSocials[index], [key]: value };
    setFormData(prev => ({ ...prev, socials: newSocials }));
  };

  const addSocial = () => {
    setFormData(prev => ({ ...prev, socials: [...prev.socials, { platform: '', url: '' }] }));
  };

  const removeSocial = (index: number) => {
    const newSocials = [...formData.socials];
    newSocials.splice(index, 1);
    if (newSocials.length === 0) newSocials.push({ platform: '', url: '' });
    setFormData(prev => ({ ...prev, socials: newSocials }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'photo_fondateur' | 'photo_directeur') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMessage({ type: 'success', text: 'Upload en cours...' });
    const fd = new FormData();
    fd.append('image', file);
    
    try {
      const response = await api.post('/admin/upload', fd);
      setFormData(prev => ({ ...prev, [field]: response.url }));
      setMessage({ type: 'success', text: 'Image importée avec succès !' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Erreur lors de l'upload de l'image." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const dataToSave = {
        contact_emails: JSON.stringify(formData.contact_emails.filter(e => e.trim())),
        contact_phones: JSON.stringify(formData.contact_phones.filter(p => p.trim())),
        socials: JSON.stringify(formData.socials.filter(s => s.url.trim())),
        contact_address: formData.contact_address,
        photo_fondateur: formData.photo_fondateur,
        photo_directeur: formData.photo_directeur,
      };
      await api.put('/admin/settings', dataToSave);
      setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-8">Chargement...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Généraux</h1>
          <p className="text-gray-500 mt-2">Gérez les informations de contact, les réseaux sociaux et les images de l'équipe de direction affichées publiquement sur le site.</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 \${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <AlertCircle size={20} />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
          {/* Contacts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Emails de Contact</h2>
            <div className="space-y-3">
              {formData.contact_emails.map((email, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="email" value={email} onChange={(e) => handleArrayChange(i, 'contact_emails', e.target.value)} placeholder="exemple@sogipgroup.com" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => removeArrayItem(i, 'contact_emails')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('contact_emails')} className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 mt-2"><Plus size={16} /> Ajouter un email</button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Téléphones</h2>
            <div className="space-y-3">
              {formData.contact_phones.map((phone, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={phone} onChange={(e) => handleArrayChange(i, 'contact_phones', e.target.value)} placeholder="+224 620 00 00 00" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => removeArrayItem(i, 'contact_phones')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('contact_phones')} className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 mt-2"><Plus size={16} /> Ajouter un numéro</button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Adresse Physique</h2>
            <input type="text" value={formData.contact_address} onChange={(e) => setFormData({...formData, contact_address: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Réseaux Sociaux</h2>
            <div className="space-y-3">
              {formData.socials.map((social, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border">
                  <div className="w-1/3">
                    <input type="text" value={social.platform} onChange={(e) => handleSocialChange(i, 'platform', e.target.value)} placeholder="Nom (ex: Facebook)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="w-2/3 flex gap-2">
                    <input type="url" value={social.url} onChange={(e) => handleSocialChange(i, 'url', e.target.value)} placeholder="Lien URL" className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => removeSocial(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addSocial} className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 mt-2"><Plus size={16} /> Ajouter un réseau social</button>
            </div>
          </div>

          {/* Images Direction */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Photos de la Direction</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-dashed border-gray-300 p-4 rounded-xl text-center bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Fondateur</label>
                {formData.photo_fondateur && <img src={formData.photo_fondateur} alt="Fondateur" className="mx-auto h-32 rounded-lg object-cover mb-4 shadow-sm" />}
                <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload size={18} />
                  <span>Importer une image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_fondateur')} />
                </label>
              </div>
              <div className="border border-dashed border-gray-300 p-4 rounded-xl text-center bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo Directeur Général</label>
                {formData.photo_directeur && <img src={formData.photo_directeur} alt="Directeur" className="mx-auto h-32 rounded-lg object-cover mb-4 shadow-sm" />}
                <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload size={18} />
                  <span>Importer une image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo_directeur')} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={20} />
              {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
