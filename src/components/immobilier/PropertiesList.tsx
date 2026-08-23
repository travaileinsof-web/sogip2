import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, Home, BedDouble, Bath, Square, Droplet, Zap, Shield, Car, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

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
  specifications: string | null;
  actif: boolean;
}

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filterType, setFilterType] = useState('Tous');
  const [filterTransaction, setFilterTransaction] = useState('Tous');
  const [filterCity, setFilterCity] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/admin/properties');
        setProperties(response.data.filter((p: Property) => p.actif));
      } catch (err) {
        setError('Erreur lors du chargement des offres immobilières.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-GN', { 
      style: 'currency', 
      currency: currency || 'GNF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInterested = (property: Property) => {
    setContactForm({
      name: '', phone: '', email: '',
      message: `Bonjour, je suis intéressé(e) par votre offre : ${property.title} (${property.propertyType} en ${property.transactionType} à ${formatPrice(property.price, property.currency)}).`
    });
    setShowContactModal(true);
  };

    const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Envoyer les infos dans la boite du dashboard admin
      const names = contactForm.name.split(' ');
      const nom = names.length > 1 ? names.slice(1).join(' ') : contactForm.name;
      const prenom = names[0];
      
      await api.post('/contacts', {
        nom: nom,
        prenom: prenom,
        email: contactForm.email || 'non.renseigne@email.com',
        telephone: contactForm.phone,
        sujet: 'Intérêt pour une offre immobilière (Le Proprio)',
        filiale: 'SOGIP IMMO',
        message: contactForm.message
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi au dashboard', error);
    }

    // 2. Rediriger vers WhatsApp
    const whatsappMessage = `*Nouvelle Demande SOGIP IMMO*
Nom: ${contactForm.name}
Email: ${contactForm.email}
Téléphone: ${contactForm.phone}

${contactForm.message}`;
    const whatsappLink = `https://wa.me/224620521249?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
    setShowContactModal(false);
  };

  const parseSpecs = (specsStr: string | null) => {
    if (!specsStr) return {};
    try {
      return JSON.parse(specsStr);
    } catch(e) {
      return {};
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filterType !== 'Tous' && p.propertyType !== filterType) return false;
    if (filterTransaction !== 'Tous' && p.transactionType !== filterTransaction) return false;
    if (filterCity && !(p.city?.toLowerCase().includes(filterCity.toLowerCase()) || p.location.toLowerCase().includes(filterCity.toLowerCase()))) return false;
    if (filterMinPrice && p.price < Number(filterMinPrice)) return false;
    if (filterMaxPrice && p.price > Number(filterMaxPrice)) return false;
    return true;
  });

  if (loading) return <div className="text-center py-20 text-gray-500">Chargement des offres...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      {/* Barre de recherche / Filtres */}
      <div className="bg-white p-4 rounded-xl shadow-md border mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type de bien</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500">
            <option value="Tous">Tous les types</option>
            <option value="Terrain">Terrain</option>
            <option value="Maison">Maison</option>
            <option value="Villa">Villa</option>
            <option value="Appartement">Appartement</option>
            <option value="Immeuble">Immeuble</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction</label>
          <select value={filterTransaction} onChange={e => setFilterTransaction(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500">
            <option value="Tous">Toutes (Vente / Location)</option>
            <option value="Vente">Vente</option>
            <option value="Location">Location</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville / Zone</label>
          <input type="text" placeholder="Ex: Conakry, Kipé" value={filterCity} onChange={e => setFilterCity(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget Min</label>
          <input type="number" placeholder="Min" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget Max</label>
          <input type="number" placeholder="Max" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow border">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>Aucune offre ne correspond à vos critères.</p>
          <button onClick={() => { setFilterType('Tous'); setFilterTransaction('Tous'); setFilterCity(''); setFilterMinPrice(''); setFilterMaxPrice(''); }} className="mt-4 text-emerald-600 font-bold">Réinitialiser les filtres</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div 
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group flex flex-col cursor-pointer hover:-translate-y-1"
              onClick={() => { setSelectedProperty(property); setActiveImageIndex(0); }}
            >
              <div className="relative h-64 overflow-hidden">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {property.transactionType}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {property.propertyType}
                </div>
                {property.status !== 'Disponible' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold bg-red-600/90 px-6 py-2 rounded-lg transform -rotate-12 border-4 border-white/20">
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                )}
                {property.area && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm flex items-center">
                    <Square size={14} className="mr-1" /> {property.area} m²
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="title-font text-xl font-bold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                <div className="flex items-center text-gray-500 mb-4 text-sm">
                  <MapPin size={16} className="mr-1 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{property.city ? `${property.neighborhood ? property.neighborhood + ', ' : ''}${property.city}` : property.location}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatPrice(property.price, property.currency)}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleInterested(property); }}
                    disabled={property.status !== 'Disponible'}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${property.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale Details */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10">
              <button onClick={() => setSelectedProperty(null)} className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Gallery Side */}
              <div className="w-full md:w-1/2 bg-black flex flex-col relative h-[40vh] md:h-auto">
                {(() => {
                  let images = [selectedProperty.image];
                  if (selectedProperty.gallery) {
                    try {
                      const galleryArr = JSON.parse(selectedProperty.gallery);
                      if (Array.isArray(galleryArr)) images = [...images, ...galleryArr];
                    } catch(e) {}
                  }
                  return (
                    <>
                      <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                        <img src={images[activeImageIndex]} alt={selectedProperty.title} className="max-w-full max-h-full object-contain" />
                        {images.length > 1 && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1); }} className="absolute left-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/90 transition">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0); }} className="absolute right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/90 transition">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                          </>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {activeImageIndex + 1} / {images.length}
                        </div>
                      </div>
                      {images.length > 1 && (
                        <div className="h-24 bg-gray-900 flex gap-2 overflow-x-auto p-2">
                          {images.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-20 h-full rounded border-2 ${activeImageIndex === idx ? 'border-emerald-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                              <img src={img} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Details Side */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${selectedProperty.transactionType === 'Vente' ? 'bg-blue-600' : 'bg-emerald-600'}`}>{selectedProperty.transactionType}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">{selectedProperty.propertyType}</span>
                  {selectedProperty.area && <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{selectedProperty.area} m²</span>}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedProperty.status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedProperty.status}</span>
                </div>
                
                <h2 className="title-font text-3xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h2>
                <div className="flex items-center text-gray-500 mb-6 text-lg">
                  <MapPin size={20} className="mr-2 text-emerald-500" />
                  {selectedProperty.city ? `${selectedProperty.neighborhood ? selectedProperty.neighborhood + ', ' : ''}${selectedProperty.city}` : selectedProperty.location}
                </div>
                
                <p className="text-4xl font-bold text-emerald-600 mb-8 border-b pb-6">
                  {formatPrice(selectedProperty.price, selectedProperty.currency)}
                </p>

                {/* Specs Section */}
                {(() => {
                  const specs = parseSpecs(selectedProperty.specifications);
                  if (Object.keys(specs).length === 0) return null;
                  
                  return (
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Caractéristiques Principales</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {specs.chambres && <div className="flex items-center text-gray-700"><BedDouble className="mr-2 text-gray-400" size={18} /> {specs.chambres} Chambres</div>}
                        {specs.salons && <div className="flex items-center text-gray-700"><Home className="mr-2 text-gray-400" size={18} /> {specs.salons} Salons</div>}
                        {specs.douches && <div className="flex items-center text-gray-700"><Bath className="mr-2 text-gray-400" size={18} /> {specs.douches} Douches</div>}
                        {specs.toilettes && <div className="flex items-center text-gray-700"><Bath className="mr-2 text-gray-400" size={18} /> {specs.toilettes} Toilettes</div>}
                        {specs.balcons && <div className="flex items-center text-gray-700"><Square className="mr-2 text-gray-400" size={18} /> {specs.balcons} Balcons</div>}
                        {specs.etages && <div className="flex items-center text-gray-700"><Home className="mr-2 text-gray-400" size={18} /> Niveaux : {specs.etages}</div>}
                        
                        {/* Checkboxes Booleans */}
                        {specs.forage && <div className="flex items-center text-emerald-700 font-medium"><Droplet className="mr-2 text-emerald-500" size={18} /> Forage (Eau)</div>}
                        {specs.groupe_electro && <div className="flex items-center text-emerald-700 font-medium"><Zap className="mr-2 text-emerald-500" size={18} /> Groupe Électrogène</div>}
                        {specs.gardiennage && <div className="flex items-center text-emerald-700 font-medium"><Shield className="mr-2 text-emerald-500" size={18} /> Gardiennage</div>}
                        {specs.parking && <div className="flex items-center text-emerald-700 font-medium"><Car className="mr-2 text-emerald-500" size={18} /> Parking / Garage</div>}
                        {specs.titre_foncier && <div className="flex items-center text-emerald-700 font-medium"><CheckCircle className="mr-2 text-emerald-500" size={18} /> Titre Foncier</div>}
              {specs.chauffage_eau && <div className="flex items-center gap-1.5"><Thermometer size={16} /> Chauffe-eau</div>}
              {specs.electricite && <div className="flex items-center gap-1.5"><Zap size={16} /> Électricité</div>}
              {specs.cloture && <div className="flex items-center gap-1.5"><Shield size={16} /> Clôturé</div>}
              {specs.electrifie && <div className="flex items-center gap-1.5"><Zap size={16} /> Zone Électrifiée</div>}
              {specs.documents_ok && <div className="flex items-center gap-1.5"><FileCheck size={16} /> Documents au point</div>}

                        {specs.cloture && <div className="flex items-center text-emerald-700 font-medium"><CheckCircle className="mr-2 text-emerald-500" size={18} /> Clôturé</div>}
                      </div>
                    </div>
                  );
                })()}

                <div className="prose prose-emerald max-w-none mb-8 text-gray-600 whitespace-pre-line flex-grow">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Description complète</h4>
                  {selectedProperty.description}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => { setSelectedProperty(null); handleInterested(selectedProperty); }}
                    disabled={selectedProperty.status !== 'Disponible'}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedProperty.status === 'Disponible' ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <Phone size={24} />
                    Je suis intéressé(e)
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Contact */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contactez-nous</h3>
              <form onSubmit={submitContact} className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom complet *</label><input required type="text" value={contactForm.name} onChange={e => setContactForm(prev => ({...prev, name: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Jean Dupont" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Votre Numéro de Téléphone *</label><input required type="tel" value={contactForm.phone} onChange={e => setContactForm(prev => ({...prev, phone: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="+224 620 00 00 00" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Votre Email *</label><input required type="email" value={contactForm.email} onChange={e => setContactForm(prev => ({...prev, email: e.target.value}))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="jean@email.com" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea required value={contactForm.message} onChange={e => setContactForm(prev => ({...prev, message: e.target.value}))} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></textarea></div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowContactModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Annuler</button>
                  <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <Phone size={18} /> Continuer
                  </button>
                </div>
                <p className="text-xs text-center text-gray-500 mt-4">Vous serez redirigé vers WhatsApp pour finaliser l'envoi.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
