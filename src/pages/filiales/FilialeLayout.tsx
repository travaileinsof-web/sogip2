import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/animations/FadeIn';

interface Service {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}

interface FilialePageProps {
  seo: { title: string; description: string };
  hero: {
    image: string;
    logo: string;
    name: string;
    tagline: string;
    accent: string;
  };
  intro: string;
  services: Service[];
  whyUs: { icon: string; title: string; desc: string }[];
  extra?: React.ReactNode;
}

export default function FilialePage({ seo, hero, intro, services, whyUs, extra }: FilialePageProps) {
  return (
    <>
      <title>{seo.title}</title>

      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-end pt-32 pb-16 overflow-hidden">
        <img
          src={hero.image}
          alt={hero.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/40" />

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <FadeIn>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden">
                <img src={hero.logo} alt={hero.name} className="w-16 h-16 object-contain" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold tracking-widest uppercase mb-1"
                  style={{ color: hero.accent }}
                >
                  Filiale SOGIP GROUP
                </p>
                <h1 className="title-font text-5xl md:text-7xl font-bold text-white leading-none">
                  {hero.name}
                </h1>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl leading-relaxed">
              {hero.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="bg-slate-900 py-10 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 text-lg leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <span
                className="inline-block text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4"
                style={{ backgroundColor: `${hero.accent}18`, color: hero.accent }}
              >
                Nos Services
              </span>
              <h2 className="title-font text-4xl md:text-5xl font-bold text-blue-900">
                Ce que nous proposons
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 20px 60px -10px ${hero.accent}33` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl p-8 h-full flex flex-col border border-slate-100 shadow-md"
                >
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3
                    className="title-font text-xl font-bold mb-3"
                    style={{ color: hero.accent }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{s.desc}</p>
                  <ul className="mt-auto flex flex-col gap-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                        <span style={{ color: hero.accent }} className="mt-0.5 shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA CONTENT (formations for CEF) */}
      {extra}

      {/* WHY US */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="title-font text-3xl md:text-4xl font-bold text-blue-900">
                Pourquoi nous choisir ?
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((w, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="text-5xl mb-4">{w.icon}</div>
                  <h3 className="title-font text-xl font-bold text-blue-900 mb-3">{w.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0a1628, ${hero.accent}22, #0a1628)` }}
      >
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <FadeIn>
            <h2 className="title-font text-4xl font-bold text-white mb-4">
              Un projet en tête ?
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Contactez notre équipe pour un devis gratuit et personnalisé.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-slate-900 transition-transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: hero.accent }}
              >
                Nous contacter
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition"
              >
                ← Retour aux services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
