import React, { useState } from 'react';
import FadeIn from '../components/animations/FadeIn';

const Boutique: React.FC = () => {
  const [currency, setCurrency] = useState('GNF');
  const RATES: Record<string, number> = { EUR: 1, USD: 1.08, FCFA: 655, GNF: 9300 };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    quantity: 1,
    details: ''
  });

  const products = [
    {
      id: 1,
      title: "Panneaux Solaires Monocristallins Haute Performance",
      category: "Énergie Solaire",
      desc: "Idéal pour les installations résidentielles et commerciales avec un rendement optimal même par faible ensoleillement.",
      image: "/images/produits/solar_panels.jpg"
    },
    {
      id: 2,
      title: "Batteries Lithium-Ion de Stockage",
      category: "Stockage d'Énergie",
      desc: "Batteries de dernière génération offrant une durée de vie prolongée et une capacité de stockage maximale pour l'autonomie nocturne.",
      image: "/images/produits/battery.jpg"
    },
    {
      id: 3,
      title: "Onduleurs Hybrides Intelligents",
      category: "Équipements",
      desc: "Conversion de courant avec gestion intelligente de l'énergie entre les panneaux, le réseau public et les batteries.",
      image: "/images/produits/inverter.jpg"
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate WhatsApp order / Mail order
    const companyPhone = "224620521249";
    const textMessage = `*NOUVELLE COMMANDE - SOLEIL GUINÉE*\n\n` +
                        `*Nom :* ${formData.name}\n` +
                        `*Email :* ${formData.email}\n` +
                        `*Téléphone :* ${formData.phone}\n` +
                        `*Produit :* ${formData.product}\n` +
                        `*Quantité :* ${formData.quantity}\n` +
                        `*Détails :* ${formData.details}\n\n` +
                        `Veuillez me contacter pour finaliser cette commande.`;
    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
      
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <FadeIn>
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
            Soleil Guinée - Énergies Renouvelables
          </span>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Produits</span>
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Découvrez nos équipements d'énergies renouvelables ultra-qualitatifs pour répondre à tous vos besoins en autonomie énergétique.
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-slate-500 font-medium">Afficher les prix en :</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm"
            >
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
              <option value="FCFA">FCFA</option>
              <option value="GNF">GNF</option>
            </select>
          </div>
        </FadeIn>
      </div>


      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 0.1}>
              <div className="group h-full bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-500 hover:shadow-[0_10px_40px_rgba(245,158,11,0.1)] flex flex-col relative">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1 relative z-20">
                  
                  <h3 className="text-xl font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-500 transition-colors">
                    {product.title}
                  </h3>
                  <div className="mb-4 text-lg font-extrabold text-amber-600">
                    {product.price ? (
                      currency === 'EUR' ? `${product.price} €` : 
                      currency === 'USD' ? `${Math.round(product.price * RATES.USD)} $` : 
                      currency === 'FCFA' ? `${product.price * RATES.FCFA} FCFA` : 
                      `${product.price * RATES.GNF} GNF`
                    ) : 'Prix sur demande'}
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                    {product.desc}
                  </p>
                  <button 
                    onClick={() => {
                      setFormData({...formData, product: product.title});
                      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-amber-500 text-slate-800 hover:text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Sélectionner ce produit
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* COMMAND FORM SECTION */}
      <div id="order-form" className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Passer Commande</h2>
            <p className="text-slate-600 mb-8">
              Remplissez ce formulaire pour commander vos équipements Soleil Guinée. Notre équipe commerciale vous contactera très rapidement pour valider la livraison.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone / WhatsApp</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    placeholder="+224 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Produit souhaité</label>
                  <select
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  >
                    <option value="">Sélectionnez un produit...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                    <option value="Autre demande sur-mesure">Autre demande sur-mesure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantité</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Détails de la commande (Optionnel)</label>
                <textarea 
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="Précisions, adresse de livraison, besoins spécifiques..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-3 text-lg mt-4"
              >
                <span>Confirmer ma commande</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </FadeIn>
      </div>

    </div>
  );
};

export default Boutique;
