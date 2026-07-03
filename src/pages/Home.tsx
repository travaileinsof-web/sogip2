import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FadeIn from '../components/animations/FadeIn';
import { usePageData } from '../hooks/usePageData';
import { sanitizeHtml } from '../utils/sanitize';

const Home: React.FC = () => {
  const { data } = usePageData('home');

  return (
    <>
      <Helmet>
        <title>Accueil - SOGIP GROUP</title>
        <meta name="description" content={data?.hero?.sous_titre?.substring(0, 160) || "SOGIP Group est une holding guinéenne multisectorielle spécialisée dans la construction, l'immobilier, les énergies renouvelables et la formation."} />
      </Helmet>
      <div className="w-full">
      {/* HERO */}
      <section className="relative h-[85vh]">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
          alt="Hero SOGIP" 
          className="absolute inset-0 w-full h-[95%] md:h-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-slate-900/50"></div>

        <div className="relative max-w-7xl mx-auto h-full flex items-center px-6">
          <div className="max-w-2xl text-white">
            <FadeIn delay={0.1}>
              <h1 
                className="title-font text-5xl md:text-6xl font-bold mb-6 leading-tight"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.hero?.titre_ligne1 || `Vision &bull; Innovation &bull; <br/> <span className="text-amber-500">Réalisation</span>`) }}
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <p 
                className="text-sm md:text-base opacity-90 mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.hero?.sous_titre || `SOGIP Group est une holding guinéenne multisectorielle spécialisée dans la construction, l'immobilier, les énergies renouvelables et la formation professionnelle.<br/><br/>Notre mission est de développer des solutions modernes, durables et accessibles répondant aux besoins des particuliers, des entreprises et des institutions.`) }}
              />
            </FadeIn>
            <FadeIn delay={0.3} className="flex flex-wrap gap-4">
              <Link 
                to="/about"
                className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transition shadow-lg"
              >
                En savoir plus →
              </Link>
                <Link 
                  to="/services"
                  className="px-6 py-3 border-2 border-amber-500 text-amber-500 font-semibold rounded-full hover:bg-amber-500 hover:text-white transition shadow-lg bg-slate-900/40 backdrop-blur-sm"
                >
                  Nos services
                </Link>
                <Link 
                  to="/formations"
                  className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-400 transition shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                  Découvrir nos formations
                </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <span className="block text-center font-semibold text-amber-500 uppercase tracking-widest text-sm mb-2">Notre raison d'être</span>
            <h2 className="text-center title-font text-4xl font-bold mb-16 capitalize text-blue-900">
              Notre Vision & Nos Valeurs
            </h2>
            <p className="text-center text-slate-600 mb-16 max-w-3xl mx-auto">
              Construire un groupe innovant et durable capable d'impacter positivement les secteurs clés du développement en Guinée et en Afrique.<br/><br/>
              <b>SOGIP Group : Construire aujourd'hui les solutions de demain.</b>
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Vision Image */}
            <FadeIn className="relative rounded-2xl overflow-hidden shadow-luxury h-full min-h-[400px] hover:scale-[1.02] transition duration-500">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition duration-700 object-center" 
                alt="Notre vision" 
              />
              <div className="absolute inset-0 bg-slate-900/60 p-8 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-semibold mb-4">VISION</h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Grâce à une approche fondée sur l'innovation, la qualité et l'accompagnement, SOGIP Group ambitionne de devenir une référence en Guinée et en Afrique de l'Ouest.
                </p>
              </div>
            </FadeIn>

            {/* Values Cards */}
            <div className="space-y-6">
              {[
                { title: "Excellence", desc: "La recherche constante de la perfection et de la qualité supérieure." },
                { title: "Innovation", desc: "Développer des solutions créatives et modernes." },
                { title: "Transparence", desc: "Agir avec intégrité et clarté dans toutes nos démarches." },
                { title: "Engagement", desc: "S'investir pleinement pour la réussite de chaque projet." },
                { title: "Satisfaction client", desc: "Placer le client au centre de nos préoccupations." }
              ].map((val, idx) => (
                <FadeIn key={idx} delay={0.1 * idx} className="bg-white rounded-xl shadow p-6 flex gap-4 hover:-translate-y-2 hover:shadow-xl transition duration-300">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 font-bold text-xl">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-blue-900 mb-1">{val.title}</h4>
                    <p className="text-sm text-slate-600">
                      {val.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOS SERVICES */}
      <section className="bg-blue-900 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <FadeIn>
            <h2 className="title-font text-4xl font-bold mb-6 capitalize">
              Nos Pôles d'activité
            </h2>
            <p className="text-lg opacity-90 mb-12">
              Des services <em className="text-amber-400">complets</em><br />pour votre réussite.
            </p>
          </FadeIn>
          
                    <FadeIn delay={0.2} className="flex justify-center gap-6 mt-8">
              <Link 
                to="/services" 
                className="px-8 py-4 bg-transparent border-2 border-amber-500 text-amber-500 font-bold rounded-full hover:bg-amber-500 hover:text-white transition shadow-lg text-lg"
              >
                Découvrir nos filiales →
              </Link>
              <Link 
                to="/formations" 
                className="px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-400 transition shadow-[0_0_20px_rgba(245,158,11,0.4)] text-lg"
              >
                Nos formations certifiantes →
              </Link>
            </FadeIn>
        </div>
      </section>

      {/* REALISATIONS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="title-font text-blue-900 text-4xl font-bold mb-6 text-center capitalize">{data?.realisations?.titre || 'Nos Réalisations'}</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">{data?.realisations?.sous_titre || 'Découvrez les projets emblématiques qui ont marqué notre impact dans les secteurs de la construction, de l\'immobilier et de l\'énergie.'}</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FadeIn delay={0.1} className="bg-slate-50 rounded-xl shadow-luxury p-6 hover:scale-[1.02] transition duration-300">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800" className="w-full mb-6 h-48 object-cover rounded-lg" alt="BTP" />
              <div className="flex items-center space-x-3 mb-3">
                <img src="/images/logos/sogip_btp_new.jpg" alt="Logo GCB BTP" className="h-8 w-auto object-contain" />
                <h3 className="text-xl font-semibold text-blue-900">{data?.realisations?.btp_titre || 'Infrastructures BTP'}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {data?.realisations?.btp_desc || 'Construction de complexes résidentiels majeurs et aménagement routier, livrés avec une qualité irréprochable et un taux de satisfaction de 98%.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-slate-50 rounded-xl shadow-luxury p-6 hover:scale-[1.02] transition duration-300">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" className="w-full mb-6 h-48 object-cover rounded-lg" alt="Immobilier" />
              <div className="flex items-center space-x-3 mb-3">
                <img src="/images/logos/leproprio.jpg" alt="Logo SOGIP Immobilier" className="h-8 w-auto object-contain mix-blend-multiply" />
                <h3 className="text-xl font-semibold text-blue-900">{data?.realisations?.immo_titre || 'SOGIP IMMO - LePropio'}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {data?.realisations?.immo_desc || 'Gestion et vente de plus de 50 biens d\'exception, offrant à nos clients des investissements rentables et un patrimoine sécurisé.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.3} className="bg-slate-50 rounded-xl shadow-luxury p-6 hover:scale-[1.02] transition duration-300">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" className="w-full mb-6 h-48 object-cover rounded-lg" alt="Energie" />
              <div className="flex items-center space-x-3 mb-3">
                <img src="/images/logos/soleil_guinee_transparent.png" alt="Logo SOGIP Énergie" className="h-8 w-auto object-contain" />
                <h3 className="text-xl font-semibold text-blue-900">{data?.realisations?.energie_titre || 'SOGIP ÉNERGIE'}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {data?.realisations?.energie_desc || 'Déploiement de centrales solaires pour l\'autonomie énergétique des entreprises locales, réduisant drastiquement leur empreinte carbone.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="bg-slate-50 rounded-xl shadow-luxury p-6 hover:scale-[1.02] transition duration-300">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className="w-full mb-6 h-48 object-cover rounded-lg" alt="Academy" />
              <div className="flex items-center space-x-3 mb-3">
                <img src="/images/logos/academie_sogip.jpg" alt="Logo SOGIP Academy" className="h-8 w-auto object-contain mix-blend-multiply" />
                <h3 className="text-xl font-semibold text-blue-900">{data?.realisations?.academy_titre || 'SOGIP ACADEMY – CEF-CONSEIL'}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {data?.realisations?.academy_desc || 'Formations certifiantes et programmes de développement des compétences pour propulser votre carrière professionnelle.'}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLES (BANNER) */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeIn delay={0.1}>
              <strong className="title-font text-5xl font-bold block mb-2">{data?.stats?.annees_expertise || '15+'}</strong>
              <span className="text-amber-100 uppercase tracking-widest text-sm font-semibold">Années d'expérience</span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <strong className="title-font text-5xl font-bold block mb-2">{data?.stats?.projets || '100+'}</strong>
              <span className="text-amber-100 uppercase tracking-widest text-sm font-semibold">Projets réalisés</span>
            </FadeIn>
            <FadeIn delay={0.3}>
              <strong className="title-font text-5xl font-bold block mb-2">{data?.stats?.filiales || '4'}</strong>
              <span className="text-amber-100 uppercase tracking-widest text-sm font-semibold">Filiales Spécialisées</span>
            </FadeIn>
          </div>
        </div>
      </section>



      {/* MOT DU PRESIDENT */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2 className="title-font text-blue-900 text-4xl font-bold mb-16 text-center capitalize">{data?.mot_president?.titre || 'Mot de la Direction'}</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <FadeIn delay={0.1} className="md:col-span-1 rounded-2xl overflow-hidden shadow-luxury h-full min-h-[300px] bg-slate-50 flex items-center justify-center">
              <img 
                src="/images/fondateur.jpg" 
                alt="Direction SOGIP"
                className="w-full h-full object-contain"
              />
            </FadeIn>
            <FadeIn delay={0.2} className="md:col-span-2 bg-white rounded-2xl p-10 shadow-lg relative">
              <div className="absolute top-8 left-8 text-6xl text-amber-200 font-serif leading-none opacity-50">"</div>
              <div className="relative z-10 pl-8 pt-4">
                <p className="text-slate-700 text-lg leading-relaxed mb-6 italic" dangerouslySetInnerHTML={{ __html: sanitizeHtml((data?.mot_president?.contenu1 || "Bienvenue chez <strong>SOGIP GROUP</strong>. Depuis plusieurs années, nous accompagnons nos partenaires, nos clients et nos collaborateurs dans leurs projets d'envergure.") + "<br /><br />" + (data?.mot_president?.contenu2 || "Notre objectif est de proposer des solutions concrètes et adaptées, que ce soit pour bâtir les infrastructures de demain, optimiser les investissements immobiliers, réussir la transition énergétique ou former les futurs leaders.")) }} />
                <div className="border-t border-slate-100 pt-6 mt-6">
                  <h4 className="title-font text-2xl font-bold text-blue-900">{data?.mot_president?.signature || 'Le Président'}</h4>
                  <p className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Directeur Général - SOGIP Group</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
