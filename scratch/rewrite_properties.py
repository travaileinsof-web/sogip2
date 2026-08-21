import re

with open('src/components/immobilier/PropertiesList.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace types
content = content.replace("image: string;", "image: string;\n  gallery: string | null;")

# We need to add the modal for viewing property details.
# Add state for selected property:
state_insertion = """  const [typeFilter, setTypeFilter] = useState('Tous');
  
  // Modale Detail Propriété
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
"""
content = content.replace("  const [typeFilter, setTypeFilter] = useState('Tous');", state_insertion)

# Replace the click on the card to open modal instead of doing nothing.
card_click = """                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 group flex flex-col cursor-pointer"
                  onClick={() => { setSelectedProperty(property); setActiveImageIndex(0); }}
                >"""
content = re.sub(r'<motion\.div[^>]+key=\{property\.id\}[^>]+className="bg-white[^>]+"([^>]+)?>', card_click, content)

# But wait, the phone button click should stop propagation and open the contact modal directly?
# Let's just make the "Je suis intéressé(e)" button inside the card stop propagation and trigger contact modal with preset message.
handle_interested = """
  const handleInterested = (property: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Instead of direct whatsapp link, we show search modal pre-filled
    setSearchForm({
      name: '', phone: '', email: '',
      message: `Je suis intéressé(e) par : ${property.title} (${property.location}) à ${formatPrice(property.price, property.currency)}.`
    });
    setShowSearchModal(true);
  };
"""
# Replace old handleInterested
content = re.sub(r'const handleInterested = \(property: Property\) => \{[\s\S]+?window\.open\(whatsappLink, \'_blank\'\);\s*\};', handle_interested.strip(), content)

# Fix button onClick in card
content = content.replace("onClick={() => handleInterested(property)}", "onClick={(e) => handleInterested(property, e)}")


# Build the Property Details Modal UI
details_modal = """
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
"""

# Now we need to modify the contact form submit to also redirect to whatsapp.
# Inside handleSearchSubmit, after api.post
whatsapp_redirect = """
      // Redirect to WhatsApp
      const whatsappMessage = `Bonjour Le Proprio !\n\nNom: ${nom} ${prenom}\nTéléphone: ${searchForm.phone}\n\n${searchForm.message}`;
      const whatsappLink = `https://wa.me/224610111100?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappLink, '_blank');
      
      setSearchStatus('success');
"""
content = content.replace("setSearchStatus('success');", whatsapp_redirect)


# Fix search modal Title
content = content.replace("Recherche sur Mesure", "Contact / Demande d'information")
content = content.replace("Dites-nous ce que vous cherchez, nous le trouverons pour vous.", "Laissez-nous vos coordonnées, un conseiller vous recontactera.")

# Also fix the encoding on the strings that were corrupted!
content = content.replace("TǸlǸphone", "Téléphone")
content = content.replace("DǸcrivez", "Décrivez")
content = content.replace("Envoyer ma demande", "Envoyer ma demande")
content = content.replace("rǸessayer", "réessayer")
content = content.replace("spǸcifique", "spécifique")
content = content.replace("intǸressǸ", "intéressé")
content = content.replace("Ǹquipe", "équipe")
content = content.replace("trs", "très")
content = content.replace("envoyǸe", "envoyée")

# Insert modal
content = content.replace("{/* Modal Recherche sur Mesure */}", details_modal + "\n\n      {/* Modal Recherche sur Mesure */}")


with open('src/components/immobilier/PropertiesList.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
