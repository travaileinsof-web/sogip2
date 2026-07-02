import React, { useState } from 'react';
import FadeIn from '../components/animations/FadeIn';

const Formations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Toutes");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const formationsList = [
    {
      category: "Génie Civil, BTP & Infrastructures",
      courses: [
        { 
          title: "CONCEPTION, CALCULS ET DIMENSIONNEMENT DES STRUCTURES AVANCÉES DES BÂTIMENTS", 
          duration: "2 mois", 
          price: "500", 
          desc: "Maîtrisez la conception et le dimensionnement avancé des structures de bâtiments en intégrant les calculs statiques, dynamiques et parasismiques.",
          image: "/images/formations/btp.jpg"
        },
        { 
          title: "GESTION DE PROJETS BTP – PLANIFICATION, BUDGÉTISATION, SUIVI ET CONTRÔLE DES COÛTS", 
          duration: "2 mois", 
          price: "490", 
          desc: "Planification de projets BTP, budgétisation, contrôle des coûts et analyse.",
          image: "/images/formations/management.jpg"
        },
        { 
          title: "CONCEPTION ET RÉALISATION DES OUVRAGES D’ART (PONTS)", 
          duration: "2 mois", 
          price: "500", 
          desc: "Cycle complet de conception et de réalisation des ouvrages d’art, de l’étude préliminaire jusqu’au dimensionnement.",
          image: "/images/formations/digital.jpg"
        },
        { 
          title: "MAÎTRISE DE LA GÉOTECHNIQUE : ANALYSE DES SOLS ET DIMENSIONNEMENT DES FONDATIONS", 
          duration: "2 mois", 
          price: "499", 
          desc: "Comprendre en profondeur le comportement des sols et assurer le dimensionnement optimal des fondations.",
          image: "/images/formations/qhse.jpg"
        },
        { 
          title: "CONCEPTION ET DIMENSIONNEMENT DE LA VOIRIE URBAINE-V.R.D", 
          duration: "2 mois", 
          price: "490", 
          desc: "Aménagement urbain moderne dédié à la conception et au dimensionnement de la voirie urbaine.",
          image: "/images/formations/btp.jpg"
        },
        { 
          title: "BIM AVANCÉ : MODÉLISATION, COORDINATION & GESTION DE PROJETS", 
          duration: "2 mois", 
          price: "499", 
          desc: "Plongez au cœur de la révolution numérique du secteur du bâtiment grâce au Building Information Modeling (BIM).",
          image: "/images/formations/management.jpg"
        },
        { 
          title: "CONCEPTION, DIMENSIONNEMENT ET RÉALISATION DES INFRASTRUCTURES ROUTIÈRES AVANCÉES", 
          duration: "2 mois", 
          price: "490", 
          desc: "Ingénierie routière moderne de A à Z : conception, dimensionnement et réalisation.",
          image: "/images/formations/digital.jpg"
        }
      ]
    },
    {
      category: "Mines & Géologie",
      courses: [
        { 
          title: "SUPERVISEUR MINIER 4.0 : LEADERSHIP OPÉRATIONNEL & INTELLIGENCE ARTIFICIELLE APPLIQUÉE", 
          duration: "2 mois", 
          price: "500", 
          desc: "Maîtriser les leviers critiques de la performance minière (leadership opérationnel et IA).",
          image: "/images/formations/qhse.jpg"
        },
        { 
          title: "GESTION INTÉGRÉE DES PROJETS MINIERS DE LA PROSPECTION À L'EXPLOITATION", 
          duration: "2 mois", 
          price: "490", 
          desc: "Maîtriser l’ensemble du cycle de vie d’un projet minier, de la découverte d’un gisement jusqu’à sa mise en exploitation.",
          image: "/images/formations/btp.jpg"
        },
        { 
          title: "MODELISATION 3D APPLIQUÉE À LA GÉOLOGIE MINIÈRE & GÉOTECHNIQUE", 
          duration: "1 mois", 
          price: "550", 
          desc: "Transformer des données géologiques et géotechniques complexes en modèles numériques.",
          image: "/images/formations/management.jpg"
        }
      ]
    },
    {
      category: "Eau, Environnement & SIG",
      courses: [
        { 
          title: "MODÉLISATION HYDRO GÉOPHYSIQUE ET HYDROGÉOLOGIQUE DES AQUIFÈRES", 
          duration: "2 mois", 
          price: "490", 
          desc: "Maîtriser les outils et méthodes avancés de modélisation des aquifères.",
          image: "/images/formations/digital.jpg"
        },
        { 
          title: "ASSAINISSEMENT: GESTION DURABLE DES EAUX USÉES ET PLUVIALES", 
          duration: "2 mois", 
          price: "490", 
          desc: "Dimensionnement, modélisation et optimisation des réseaux.",
          image: "/images/formations/qhse.jpg"
        },
        { 
          title: "MODÉLISATION HYDRAULIQUE 2D SOUS LES LOGICIELS (HEC-RAS)", 
          duration: "2 mois", 
          price: "490", 
          desc: "Simulation hydraulique avancée pour anticiper les risques liés aux inondations.",
          image: "/images/formations/btp.jpg"
        },
        { 
          title: "SIG ET TÉLÉDÉTECTION SPATIALE – MÉTHODES AVANCÉES SOUS ENVI", 
          duration: "2 mois", 
          price: "490", 
          desc: "Maîtriser les techniques modernes d’analyse et d’exploitation des images satellites.",
          image: "/images/formations/management.jpg"
        }
      ]
    },
    {
      category: "Management, Ressources Humaines & Audit",
      courses: [
        { 
          title: "MANAGEMENT DES RESSOURCES HUMAINES APPLIQUÉ", 
          duration: "2 mois", 
          price: "350", 
          desc: "Maîtriser les leviers stratégiques du management RH, de la gestion des talents et du leadership.",
          image: "/images/formations/digital.jpg"
        },
        { 
          title: "AUDIT INTERNE PRÉPARATION À LA CERTIFICATION CIA", 
          duration: "2 mois", 
          price: "499", 
          desc: "Expertise avancée en maîtrise des normes internationales IIA et COSO, et contrôle interne.",
          image: "/images/formations/qhse.jpg"
        },
        { 
          title: "GESTION DES MARCHÉS PUBLICS ET APPELS D'OFFRES", 
          duration: "2 mois", 
          price: "490", 
          desc: "Maîtrise complète du cycle de la commande publique (de l'identification du besoin à l'exécution).",
          image: "/images/formations/btp.jpg"
        },
        { 
          title: "AUDIT SOCIAL ET EFFICACITÉ ORGANISATIONNELLE", 
          duration: "1 mois", 
          price: "490", 
          desc: "Évaluation des politiques RH, analyse du climat social et maîtrise des risques sociaux.",
          image: "/images/formations/management.jpg"
        }
      ]
    },
    {
      category: "Qualité & HSE",
      courses: [
        { 
          title: "MANAGER HSE STRATÉGIE, PERFORMANCE & LEADERSHIP SAFETY", 
          duration: "2 mois", 
          price: "490", 
          desc: "Pilotage HSE, performance opérationnelle, conformité réglementaire et excellence.",
          image: "/images/formations/digital.jpg"
        },
        { 
          title: "FORMATION SUPERVISEUR HSE – MAÎTRISE DES RISQUES & MANAGEMENT INTÉGRÉ", 
          duration: "2 mois", 
          price: "490", 
          desc: "Outils essentiels de maîtrise des risques dans les secteurs industriels, miniers, BTP.",
          image: "/images/formations/qhse.jpg"
        },
        { 
          title: "SYSTÈME DE MANAGEMENT DE LA QUALITÉ (SMQ) — ISO 9001", 
          duration: "2 mois", 
          price: "490", 
          desc: "Performance organisationnelle dédiée au Système de Management de la Qualité.",
          image: "/images/formations/btp.jpg"
        }
      ]
    }
  ];

  const categories = ["Toutes", ...formationsList.map(f => f.category)];

  const filteredFormations = activeCategory === "Toutes" 
    ? formationsList 
    : formationsList.filter(f => f.category === activeCategory);

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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.courses.map((course, courseIdx) => (
                  <FadeIn key={courseIdx} delay={courseIdx * 0.05}>
                    <div className="group h-full bg-blue-900 border border-blue-800 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-blue-800 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col relative">
                      
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 z-20">
                           <span className="inline-flex items-center justify-center px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                            {course.duration}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1 relative z-20">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
                            {course.title}
                          </h3>
                        </div>
                        
                        <p className="text-slate-200 text-sm leading-relaxed mb-8 flex-1">
                          {course.desc}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-white">{course.price}</span>
                            <span className="text-sm text-slate-300 mb-1">€</span>
                          </div>
                          <button 
                            onClick={() => handleOpenModal(course)}
                            className="px-5 py-2.5 bg-blue-800 hover:bg-amber-500 hover:text-slate-900 border border-blue-700 hover:border-amber-500 text-white rounded-xl font-semibold transition-all duration-300"
                          >
                            S'inscrire
                          </button>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-slate-900 border border-amber-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Decorative glow */}
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
    </div>
  );
};

export default Formations;
