import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Home, ArrowRight, CheckCircle, Mail, Phone, Tag } from 'lucide-react';
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
  createdAt: string;
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [activeTab, setActiveTab] = useState<'Tous' | 'Vente' | 'Location'>('Tous');
  const [typeFilter, setTypeFilter] = useState('Tous');
  
  // Modale Detail Propriété
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  
  // Modale Contact / Demande d'information
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchForm, setSearchForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await api.get('/properties');
      setProperties(data);
    } catch (error) {
      console.error('Erreur chargement propriétés', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('loading');
    try {
      const nameParts = searchForm.name.trim().split(' ');
      const prenom = nameParts[0] || 'Client';
      const nom = nameParts.slice(1).join(' ') || 'Immobilier';
      
      await api.post('/contacts', {
        nom: nom,
        prenom: prenom,
        email: searchForm.email || 'no-email@sogip.com',
        telephone: searchForm.phone,
        sujet: 'Recherche Immobilière sur Mesure',
        message: searchForm.message
      });
      
      // Redirect to WhatsApp
      const whatsappMessage = `Bonjour Le Proprio !

Nom: ${nom} ${prenom}
Téléphone: ${searchForm.phone}

${searchForm.message}`;
      const whatsappLink = `https://wa.me/224610111100?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappLink, '_blank');
      
      setSearchStatus('success');

      setTimeout(() => {
        setShowSearchModal(false);
        setSearchStatus('idle');
        setSearchForm({ name: '', phone: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      setSearchStatus('error');
    }
  };

  const filteredProperties = properties.filter(p => {
    if (activeTab !== 'Tous' && p.transactionType !== activeTab) return false;
    if (typeFilter !== 'Tous' && p.propertyType !== typeFilter) return false;
    return true;
  });

  const propertyTypes = ['Tous', ...Array.from(new Set(properties.map(p => p.propertyType)))];

  const handleInterested = (property: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Instead of direct whatsapp link, we show search modal pre-filled
    setSearchForm({
      name: '', phone: '', email: '',
      message: `Je suis intéressé(e) par : ${property.title} (${property.location}) à  ${formatPrice(property.price, property.currency)}.`
    });
    setShowSearchModal(true);
  };

  return (
    <section className="py-20 bg-gray-50" id="offres">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="title-font text-4xl font-bold text-gray-900 mb-4">Nos <span className="text-emerald-600">Offres</span> Immobilières</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de biens immobiliers vérifiés et certifiés. Que ce soit pour acheter, vendre ou louer, nous vous accompagnons à  chaque étape.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            {['Tous', 'Vente', 'Location'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border-gray-200 border rounded-lg text-gray-700 outline-none focus:border-emerald-500 flex-1 md:w-48"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type === 'Tous' ? 'Tous les types' : type}</option>
              ))}
            </select>
            
            <button 
              onClick={() => setShowSearchModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Recherche sur mesure</span>
            </button>
          </div>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProperties.map((property) => (
                                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 group flex flex-col cursor-pointer"
                  onClick={() => { setSelectedProperty(property); setActiveImageIndex(0); }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                        property.transactionType === 'Vente' ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}>
                        {property.transactionType}
                      </span>
                    </div>
                    {property.status !== 'Disponible' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                        <div className="bg-white px-6 py-2 rounded-full font-bold text-lg text-gray-900 uppercase tracking-widest rotate-[-15deg] shadow-xl border-2 border-gray-200">
                          {property.status}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="title-font text-xl font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2">
                        {property.propertyType}
                      </span>
                    </div>
                    
                    <p className="text-2xl font-bold text-emerald-600 mb-4">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin size={16} className="mr-1 text-gray-400" />
                      {property.location}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {property.description}
                    </p>
                    
                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={(e) => handleInterested(property, e)}
                        disabled={property.status !== 'Disponible'}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                          property.status === 'Disponible' 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Phone size={18} />
                        Je suis intéressé(e)
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Home className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun bien ne correspond</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres ou faites une recherche sur mesure.</p>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="mt-6 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
            >
              Faire une demande spécifique
            </button>
          </div>
        )}
      </div>

      {/* Modal Details Propriété */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedProperty(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Gallery Section */}
              <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
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
                      <div className="relative h-64 md:h-96 bg-black">
                        <img 
                          src={images[activeImageIndex]} 
                          alt={selectedProperty.title} 
                          className="w-full h-full object-contain"
                        />
                        {images.length > 1 && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                          </>
                        )}
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto p-4 bg-white border-t">
                          {images.map((img, idx) => (
                            <button 
                              key={idx} 
                              onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${activeImageIndex === idx ? 'border-emerald-600' : 'border-transparent'}`}
                            >
                              <img src={img} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${selectedProperty.transactionType === 'Vente' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {selectedProperty.transactionType}
                  </span>
                  <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded text-xs font-semibold">
                    {selectedProperty.propertyType}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${selectedProperty.status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedProperty.status}
                  </span>
                </div>
                
                <h2 className="title-font text-3xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h2>
                <div className="flex items-center text-gray-500 mb-6">
                  <MapPin size={18} className="mr-1 text-gray-400" />
                  {selectedProperty.location}
                </div>
                
                <p className="text-4xl font-bold text-emerald-600 mb-8">
                  {formatPrice(selectedProperty.price, selectedProperty.currency)}
                </p>

                <div className="prose prose-emerald max-w-none mb-8 text-gray-600 whitespace-pre-line flex-grow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b pb-2">Description</h4>
                  {selectedProperty.description}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setSelectedProperty(null);
                      handleInterested(selectedProperty);
                    }}
                    disabled={selectedProperty.status !== 'Disponible'}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-colors ${
                      selectedProperty.status === 'Disponible' 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
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

      {/* Modal Contact / Demande d'information */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSearchModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="bg-emerald-600 p-6 text-white text-center">
                <h3 className="title-font text-2xl font-bold mb-1">Contact / Demande d'information</h3>
                <p className="text-emerald-100 text-sm">Laissez-nous vos coordonnées, un conseiller vous recontactera.</p>
              </div>
              
              <div className="p-6">
                {searchStatus === 'success' ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h4>
                    <p className="text-gray-600">Notre équipe va traiter votre demande et vous recontactera très vite.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSearchSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom complet *</label>
                      <input required type="text" value={searchForm.name} onChange={e => setSearchForm({...searchForm, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                        <input required type="tel" value={searchForm.phone} onChange={e => setSearchForm({...searchForm, phone: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={searchForm.email} onChange={e => setSearchForm({...searchForm, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Décrivez votre besoin *</label>
                      <textarea required value={searchForm.message} onChange={e => setSearchForm({...searchForm, message: e.target.value})} rows={4} placeholder="Ex: Je cherche un terrain de 500m2 à àà Coyah, budget max 50M GNF..." className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                    </div>
                    
                    {searchStatus === 'error' && (
                      <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowSearchModal(false)} className="flex-1 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                        Annuler
                      </button>
                      <button type="submit" disabled={searchStatus === 'loading'} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center">
                        {searchStatus === 'loading' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Envoyer ma demande'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertiesList;


