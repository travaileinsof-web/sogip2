import React from 'react';
import FadeIn from '../components/animations/FadeIn';
import { Helmet } from 'react-helmet-async';
import { usePageData } from '../hooks/usePageData';
import { sanitizeHtml } from '../utils/sanitize';
const About: React.FC = () => {
  const { data } = usePageData('about');

  return (
    <>
      <Helmet>
        <title>À propos - SOGIP GROUP</title>
        <meta name="description" content="Découvrez SOGIP Group, notre histoire, nos valeurs et nos engagements." />
      </Helmet>
      <div className="w-full bg-slate-50 min-h-screen">
      {/* HEADER */}
      <section className="relative pt-32 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h1 
              className="title-font text-5xl md:text-6xl font-bold mb-6 text-blue-900 text-center"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.hero?.titre || `À propos de <span className="text-amber-500">Nous</span>`) }}
            />
            <p className="text-center text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              {data?.hero?.sous_titre || "SOGIP Group est une holding guinéenne multisectorielle spécialisée dans la construction, l'immobilier, les énergies renouvelables et la formation professionnelle. Notre mission est de développer des solutions modernes, durables et accessibles répondant aux besoins des particuliers, des entreprises et des institutions."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FONDATEUR */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="title-font text-4xl font-bold mb-6 text-blue-900">{data?.histoire?.titre || 'Notre Fondateur'}</h2>
              <h3 className="text-2xl font-bold text-amber-500 mb-4">Amara Camara</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-semibold">
                Diplômé en DES en Génie rural, Master 1 Génie civil, DEC en Évaluation et Estimation en Bâtiment (Canada).
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                {data?.histoire?.paragraphe1 || "Fort de son expertise internationale et de sa connaissance approfondie du marché local, Amara Camara a fondé SOGIP Group avec une vision claire : bâtir un écosystème multisectoriel capable de répondre aux défis de développement en Guinée et en Afrique."}
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                {data?.histoire?.paragraphe2 || "Aujourd'hui, sous son leadership, le groupe allie innovation, qualité et accompagnement pour offrir des réalisations d'envergure dans le BTP, l'immobilier, l'énergie et l'éducation."}
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="relative h-[500px] rounded-2xl overflow-hidden shadow-luxury bg-slate-50 flex items-center justify-center">
              <img 
                src="/images/fondateur2.jpg" 
                alt="Amara Camara - Fondateur" 
                className="w-full h-full object-contain" 
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* BANNIÈRE APPEL À L'ACTION */}
      <section className="bg-blue-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2 className="title-font text-4xl text-white font-bold mb-8">Prêt à démarrer votre projet ?</h2>
            <p className="text-slate-300 text-lg mb-10">
              Qu'il s'agisse de construction, d'investissement immobilier, de transition énergétique ou de formation, nos experts sont à votre disposition.
            </p>
            <a href="/contact" className="inline-block px-8 py-4 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-400 transition shadow-lg text-lg">
              Contactez-nous
            </a>
          </FadeIn>
        </div>
      </section>
      </div>
    </>
  );
};

export default About;
