import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Preloader: React.FC = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Vérifier si c'est la première visite de la session
    const hasVisited = sessionStorage.getItem('sogip_visited');
    
    if (!hasVisited) {
      setIsFirstLoad(true);
      sessionStorage.setItem('sogip_visited', 'true');
    } else {
      setIsFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirstLoad) return;
    
    const container = containerRef.current;
    const text = textRef.current;
    const counter = counterRef.current;
    
    if (!container || !text || !counter) return;

    // Masquer le scroll pendant le preload
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        container.style.display = 'none';
      }
    });

    // Animation du compteur (0 à 100%)
    let counterValue = { val: 0 };
    tl.to(counterValue, {
      val: 100,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (counter) {
          counter.innerHTML = Math.round(counterValue.val) + '%';
        }
      }
    });

    // Révélation du texte "SOGIP"
    tl.fromTo(text, {
      y: 50,
      opacity: 0,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)'
    }, {
      y: 0,
      opacity: 1,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      duration: 1.2,
      ease: 'power4.out'
    }, "-=1.5");

    // Fondu et slide up de tout l'écran
    tl.to(container, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, "+=0.5");

  }, [isFirstLoad]);

  if (!isFirstLoad) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-sogip-resonance flex flex-col items-center justify-center text-white"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="overflow-hidden mb-8">
          <h1 ref={textRef} className="text-5xl md:text-7xl font-serif text-sogip-accent tracking-widest opacity-0">
            SOGIP
          </h1>
        </div>
      </div>
      
      <div className="absolute bottom-12 right-12 md:bottom-20 md:right-20">
        <span ref={counterRef} className="text-3xl md:text-5xl font-light text-gray-400 font-sans tracking-widest">
          0%
        </span>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-12 w-[1px] h-full bg-gray-800 opacity-50 hidden md:block"></div>
      <div className="absolute top-0 right-12 w-[1px] h-full bg-gray-800 opacity-50 hidden md:block"></div>
    </div>
  );
};

export default Preloader;
