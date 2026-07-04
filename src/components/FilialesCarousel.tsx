import { useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Link } from 'react-router-dom';

const filiales = [
  {
    id: 'btp',
    slug: '/services/btp',
    name: 'SOGIP BTP',
    tagline: "L'excellence dans la construction et les travaux publics",
    logo: '/images/logos/sogip_btp_new.jpg',
    accent: '#f59e0b',
    icon: '🏗️',
  },
  {
    id: 'immo',
    slug: '/services/immo',
    name: 'SOGIP IMMO — LePropio',
    tagline: "L'immobilier transparent, au service de vos ambitions",
    logo: '/images/logos/leproprio.jpg',
    accent: '#f59e0b',
    icon: '🏠',
  },
  {
    id: 'energie',
    slug: '/services/energie',
    name: 'SOGIP ÉNERGIE — Soleil Guinée',
    tagline: "L'énergie solaire, propre et accessible pour tous",
    logo: '/images/logos/soleil_guinee_transparent.png',
    accent: '#f59e0b',
    icon: '☀️',
  },
  {
    id: 'cef',
    slug: '/services/cef-conseils',
    name: 'CEF CONSEILS',
    tagline: 'Former, Conseiller, Transformer votre avenir professionnel',
    logo: '/images/logos/academie_sogip.jpg',
    accent: '#f59e0b',
    icon: '🎓',
  },
];

// Duplicate array for seamless loop
const items = [...filiales, ...filiales, ...filiales];

export default function FilialesCarousel() {
  const controls = useAnimationControls();
  const isPaused = useRef(false);

  const DURATION = 30;

  const startAnimation = () => {
    if (!isPaused.current) {
      controls.start({
        x: [0, -1200],
        transition: {
          x: { repeat: Infinity, repeatType: 'loop', duration: DURATION, ease: 'linear' },
        },
      });
    }
  };

  return (
    <div
      className="relative overflow-hidden py-6"
      onMouseEnter={() => {
        isPaused.current = true;
        controls.stop();
      }}
      onMouseLeave={() => {
        isPaused.current = false;
        startAnimation();
      }}
    >
      <motion.div
        className="flex gap-8 will-change-transform"
        animate={controls}
        onViewportEnter={startAnimation}
        style={{ width: 'max-content' }}
      >
        {items.map((f, i) => (
          <Link
            key={`${f.id}-${i}`}
            to={f.slug}
            className="block group flex-shrink-0 w-[320px]"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative rounded-2xl overflow-hidden bg-white border border-amber-200 shadow-xl h-[220px] flex flex-col justify-between p-6 cursor-pointer"
              style={{ boxShadow: `0 4px 20px rgba(245, 158, 11, 0.1)` }}
            >
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-amber-50/50"
              />

              {/* Top row: logo + icon */}
              <div className="flex items-center justify-between relative z-10">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                  <img
                    src={f.logo}
                    alt={f.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-3xl">{f.icon}</span>
              </div>

              {/* Name + tagline */}
              <div className="relative z-10">
                <h3 className="text-blue-900 font-bold text-lg title-font leading-tight mb-1">
                  {f.name}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
                  {f.tagline}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full transition-all bg-amber-100 text-amber-600 border border-amber-200"
                >
                  Découvrir →
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-blue-900 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-blue-900 to-transparent pointer-events-none z-10" />
    </div>
  );
}
