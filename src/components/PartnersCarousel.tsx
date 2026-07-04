import { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const partners = [
  { name: 'SOGEB', country: 'Guinée' },
  { name: 'EDG', country: 'Guinée' },
  { name: 'TALENT DE GUINÉE', country: 'Guinée' },
  { name: 'ANAFIC', country: 'Guinée' },
  { name: 'SABOUTEK', country: 'Guinée' },
  { name: 'ANITA ORIENTATION PRO', country: 'Maroc' },
  { name: 'CENTRE PRO. DU SAVOIR', country: 'Maroc' },
  { name: 'CRDD', country: 'Burkina Faso' },
];

const items = [...partners, ...partners, ...partners]; // duplicate for seamless loop

export default function PartnersCarousel() {
  const controls = useAnimationControls();
  const isPaused = useRef(false);

  const startAnimation = () => {
    if (!isPaused.current) {
      controls.start({
        x: [0, -2000],
        transition: {
          x: { repeat: Infinity, repeatType: 'loop', duration: 40, ease: 'linear' },
        },
      });
    }
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <div className="bg-slate-50 py-16 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h2 className="title-font text-3xl font-bold text-blue-900 mb-2 capitalize">
          Nos Partenaires de Confiance
        </h2>
        <p className="text-slate-500">Un réseau solide à travers l'Afrique</p>
      </div>

      <div
        className="relative w-full"
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
          className="flex gap-6 will-change-transform"
          animate={controls}
          onViewportEnter={startAnimation}
          style={{ width: 'max-content' }}
        >
          {items.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center p-6 h-32 group hover:border-amber-300 hover:shadow-md transition-all"
            >
              <h3 className="font-bold text-slate-700 text-lg text-center title-font group-hover:text-blue-900 transition-colors">
                {p.name}
              </h3>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest mt-2 bg-amber-50 px-3 py-1 rounded-full">
                {p.country}
              </span>
            </div>
          ))}
        </motion.div>
        
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
