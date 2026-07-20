import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FadeIn from '../components/animations/FadeIn';

const Formations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");
  const [activeMode, setActiveMode] = useState<string>("Tous les modes");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'EUR'|'USD'|'FCFA'|'GNF'>('EUR');

  const RATES = { EUR: 1, USD: 1.08, FCFA: 655.957, GNF: 9350 };
  const SYMBOLS = { EUR: '€', USD: '$', FCFA: 'F CFA', GNF: 'GNF' };
  const convertPrice = (priceEur: number) => {
    const converted = priceEur * RATES[currency];
    const formatted = converted >= 1000 ? Math.round(converted).toLocaleString('fr-FR') : converted.toFixed(0);
    return `${SYMBOLS[currency]} ${formatted}`;
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  
  const [formationsList, setFormationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const { api } = await import('../services/api');
        const response = await api.get('/formations');
        
        // Group by category
        const grouped = response.reduce((acc, curr) => {
          const cat = curr.category;
          if (!acc[cat]) {
            acc[cat] = {
              category: cat,
              courses: []
            };
          }
          acc[cat].courses.push({
            id: curr.id,
            title: curr.title,
            duration: curr.duration,
            price: curr.price,
            desc: curr.description,
            image: curr.image,
            mode: curr.mode
          });
          return acc;
        }, {});
        
        setFormationsList(Object.values(grouped));
      } catch (error) {
        console.error('Erreur chargement formations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, []);

  const categories = ["Toutes", ...formationsList.map(f => f.category)];
  const modes = ["Tous les modes", "En Ligne", "Présentiel", "Hybride"];

  const filteredFormations = formationsList.filter(f => {
    return activeCategory === "Toutes" || f.category === activeCategory;
  }).map(f => {
    if (activeMode === "Tous les modes") return f;
    return {
      ...f,
      courses: f.courses.filter((c: any) => c.mode === activeMode)
    };
  }).filter(f => f.courses.length > 0);

  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const companyPhone = "224620521249";
    const textMessage = `Bonjour, je souhaite m'inscrire à la formation : *${selectedCourse.title}*.\n\n` +
                        `*Mes informations :*\n` +
                        `- Nom complet : ${formData.name}\n` +
                        `- Email : ${formData.email}\n` +
                        `- Téléphone : ${formData.phone}\n\n` +
                        `Merci de m'indiquer la marche à suivre pour finaliser mon inscription.`;

    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    handleCloseModal();
  };

  return (
    <>
      <Helmet>
        <title>Formations - SOGIP GROUP</title>
        <meta name="description" content="Développez vos compétences avec SOGIP Academy. Découvrez nos formations professionnelles." />
      </Helmet>
      <div className="pt-32 pb-24 min-h-screen bg-white text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
        
        {/* HEADER SECTION */}
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <FadeIn>
            <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              SOGIP ACADEMY by CEF CONSEIL
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
              Formations <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Certifiantes</span>
            </h1>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Propulsez votre carrière avec nos programmes de formation de pointe, conçus par des experts du terrain et reconnus à l'international.
            </p>
          </FadeIn>
        </div>

        {/* FILTER BUTTONS */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat 
                      ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {modes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                      activeMode === mode 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* CURRENCY SWITCHER */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-slate-500 text-sm font-medium">Afficher les prix en :</span>
              {(['EUR', 'USD', 'FCFA', 'GNF'] as const).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-5 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                    currency === cur
                      ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg shadow-amber-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {cur === 'EUR' ? '€ EUR' : cur === 'USD' ? '$ USD' : cur === 'FCFA' ? 'F CFA' : 'GNF'}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* COURSES LIST */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            {filteredFormations.map((section, idx) => (
              <div key={idx} className="relative">
                
                {activeCategory === "Toutes" && (
                  <FadeIn>
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-2xl font-bold text-slate-900">{section.category}</h2>
                      <div className="h-px bg-gradient-to-r from-amber-500/50 to-transparent flex-1"></div>
                    </div>
                  </FadeIn>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.courses.map((course, cIdx) => (
                    <div key={cIdx} className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-amber-500/30">
                      <div className="h-48 overflow-hidden rounded-xl mb-6 relative">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {course.mode && (
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                            {course.mode}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug min-h-[3.5rem]">{course.title}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.desc}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-600">{course.duration}</span>
                        <span className="text-lg font-bold text-amber-600">
                          {currency === 'EUR' ? `${course.price} €` : 
                           currency === 'USD' ? `${Math.round(parseInt(course.price) * 1.1)} $` : 
                           currency === 'FCFA' ? `${parseInt(course.price) * 655} FCFA` : 
                           `${parseInt(course.price) * 9000} GNF`}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleOpenModal(course)}
                        className="w-full mt-4 py-2.5 rounded-lg border border-amber-500 text-amber-600 font-semibold hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        S'inscrire
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-slate-900 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Demande d'inscription</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Remplissez vos informations pour vous inscrire à la formation : <span className="text-amber-400 font-semibold">{selectedCourse.title}</span>. Vous serez redirigé vers notre WhatsApp pour finaliser l'inscription.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone / WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="+224 ..."
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-amber-500 text-slate-900 font-bold py-3.5 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
              >
                <span>Envoyer ma demande via WhatsApp</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Formations;
