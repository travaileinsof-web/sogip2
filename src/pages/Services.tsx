import React, { useState } from 'react';
import FadeIn from '../components/animations/FadeIn';
import FilialesCarousel from '../components/FilialesCarousel';
import { Helmet } from 'react-helmet-async';
import { usePageData } from '../hooks/usePageData';
import { sanitizeHtml } from '../utils/sanitize';
import RealizationsGallery from '../components/RealizationsGallery';

const Services: React.FC = () => {
  const [openServiceId, setOpenServiceId] = useState<string | null>(null);
  const { data } = usePageData('services');

  const services = [
    {
      id: 'btp',
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
      title: data?.btp?.titre || 'SOGIP BTP',
      icon: (
        <img loading="lazy" src="/images/logos/sogip_btp_new.jpg" alt="Logo SOGIP BTP" className="h-12 w-auto object-contain" />
      ),
      desc: data?.btp?.desc || "SOGIP BTP intervient dans la construction de bâtiments, les travaux publics et l'aménagement de bas-fonds avec une approche moderne et durable.",
      items: [
        data?.btp?.item1 || "Constructions résidentielles et commerciales",
        data?.btp?.item2 || "Travaux de génie civil",
        data?.btp?.item3 || "Voiries et aménagements",
        data?.btp?.item4 || "Réhabilitation et rénovation",
        data?.btp?.item5 || "Aménagement de bas-fonds agricoles"
      ]
    },
    {
      id: 'immo',
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
      title: data?.immo?.titre || 'SOGIP IMMO - LePropio',
      icon: (
        <img loading="lazy" src="/images/logos/leproprio.jpg" alt="Logo SOGIP IMMO" className="h-12 w-auto object-contain mix-blend-multiply" />
      ),
      desc: data?.immo?.desc || "LePropio révolutionne l'immobilier en proposant une vente sans commission, centrée sur les intérêts du client.",
      items: [
        data?.immo?.item1 || "Vente et achat de biens immobiliers",
        data?.immo?.item2 || "Évaluation immobilière",
        data?.immo?.item3 || "Accompagnement juridique",
        data?.immo?.item4 || "Coaching immobilier",
        data?.immo?.item5 || "Mise en valeur des propriétés"
      ]
    },
    {
      id: 'energie',
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
      title: data?.energie?.titre || 'SOGIP ÉNERGIE - Soleil Guinée',
      icon: (
        <img loading="lazy" src="/images/logos/soleil_guinee_transparent.png" alt="Logo SOGIP ÉNERGIE" className="h-12 w-auto object-contain" />
      ),
      desc: data?.energie?.desc || "Soleil Guinée accompagne particuliers et entreprises dans leurs projets d'énergies renouvelables grâce à des solutions fiables, économiques et durables.",
      items: [
        data?.energie?.item1 || "Études énergétiques",
        data?.energie?.item2 || "Dimensionnement solaire",
        data?.energie?.item3 || "Fourniture d'équipements",
        data?.energie?.item4 || "Installation et mise en service",
        data?.energie?.item5 || "Paramétrage et assistance technique",
        data?.energie?.item6 || "Maintenance et suivi"
      ]
    },
    {
      id: 'academy',
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      title: data?.academy?.titre || 'SOGIP ACADEMY - CEF-CONSEIL',
      icon: (
        <img loading="lazy" src="/images/logos/academie_sogip.jpg" alt="Logo SOGIP ACADEMY" className="h-12 w-auto object-contain mix-blend-multiply" />
      ),
      desc: data?.academy?.desc || "SOGIP Academy propose des formations certifiantes en ligne et hybrides adaptées aux réalités du marché professionnel moderne.",
      items: [
        data?.academy?.item1 || "Flexibilité d'apprentissage",
        data?.academy?.item2 || "Pédagogie innovante",
        data?.academy?.item3 || "Expertise reconnue",
        data?.academy?.item4 || "Accompagnement professionnel",
        data?.academy?.item5 || "Formations orientées résultats"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Services & Expertises - SOGIP GROUP</title>
        <meta name="description" content="Découvrez nos expertises en BTP, Immobilier, Énergies Renouvelables et Formation." />
      </Helmet>
      <div className="w-full bg-slate-50 min-h-screen">
      {/* BANNER */}
      <section className="pt-32">
        <div className="relative h-[60vh] min-h-[400px]">
          <img 
            loading="lazy"
            src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=1200" 
            alt="Nos Services" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>

          <div className="relative max-w-7xl mx-auto h-full flex items-center px-6">
            <div className="max-w-2xl text-white">
              <FadeIn>
                <h1 
                  className="title-font text-5xl md:text-7xl font-bold mb-6 text-white"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.hero?.titre || `Nos <span className="text-amber-500">Expertises</span>`) }}
                />
                <p className="text-lg opacity-90 leading-relaxed text-slate-200">
                  {data?.hero?.sous_titre || "Découvrez l'ensemble de nos pôles d'activités conçus pour répondre à vos exigences les plus élevées en matière de construction, d'immobilier, d'énergie et de formation."}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED FOCUS (Like the 3 large cards on Anita) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="title-font text-4xl font-bold text-blue-900 mb-4">Démarquez-vous avec SOGIP</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                À travers ses différents pôles d'activités, le groupe conçoit et déploie des solutions innovantes.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <FadeIn key={service.id} delay={0.1 * idx} className="flex flex-col items-center gap-4 group">
                <div className="overflow-hidden rounded-xl shadow-luxury w-full aspect-square">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
                <h6 className="font-semibold text-lg text-blue-900 title-font mt-2 text-center">{service.title}</h6>
                
                <button 
                  onClick={() => setOpenServiceId(openServiceId === service.id ? null : service.id)} 
                  className="rounded-full bg-amber-500 text-white hover:bg-amber-400 py-2 px-6 text-sm font-medium transition cursor-pointer"
                >
                  {openServiceId === service.id ? 'Fermer ↑' : 'Découvrir ↓'}
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${openServiceId === service.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <ul className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 flex flex-col gap-2 shadow-inner">
                    {service.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FILIALES CAROUSEL */}
      <section className="py-16 bg-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <FadeIn>
            <h2 className="title-font text-4xl font-bold text-white mb-4 text-center">Nos <span className="text-amber-400">Filiales</span></h2>
            <p className="text-blue-100 text-center">Cliquez sur une filiale pour découvrir tous ses services en détail</p>
          </FadeIn>
        </div>
        <FilialesCarousel />
      </section>

      {/* REALISATIONS GLOBALES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="title-font text-4xl font-bold text-blue-900 mb-16 text-center capitalize">
              Un aperçu de nos réalisations
            </h2>
          </FadeIn>
          <RealizationsGallery limit={6} />
        </div>
      </section>

      {/* DETAILED SERVICES GRID (Like the slate-200 cards on Anita) */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="title-font text-4xl font-bold text-blue-900 mb-16 capitalize">
              Le Détail de nos Pôles
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <FadeIn key={service.id} delay={0.1 * idx}>
                <div id={service.id} style={{ scrollMarginTop: '100px' }} className="bg-slate-200 text-slate-800 rounded-xl p-8 hover:scale-[1.02] transition duration-300 shadow-sm h-full flex flex-col text-left">
                  <div className="flex items-center w-full mb-6 justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-center title-font text-blue-900">{service.title}</h3>
                  <p className="mb-6 text-slate-600 font-medium text-center">
                    {service.desc}
                  </p>
                  
                  <ul className="flex flex-col gap-3 mt-auto">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-6 w-6 shrink-0 mt-0.5" viewBox="0 0 22 22" fill="none" strokeLinecap="square">
                          <circle cx="11" cy="11" r="11" className="fill-blue-400/25" />
                          <circle cx="11" cy="11" r="10.5" className="stroke-blue-400/25" />
                          <path d="M8 11.5L10.5 14L14 8" className="stroke-blue-800" strokeWidth="1.5" />
                        </svg>
                        <span className="ml-3 text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-10 text-center">
                    <a href={`/contact?pole=${service.title}`} className="inline-block border-2 border-slate-300 hover:border-amber-500 hover:text-amber-500 text-slate-500 font-semibold rounded-full px-6 py-2 transition text-sm">
                      Nous contacter pour ce pôle
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Services;
