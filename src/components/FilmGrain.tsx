import React from 'react';

const FilmGrain: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03] mix-blend-overlay">
      <svg className="film-grain-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      {/* Animation simple CSS inline pour faire scintiller le grain */}
      <style>{`
        .film-grain-svg {
          animation: noise 0.2s infinite alternate;
        }
        @keyframes noise {
          0% { transform: translate(0,0) }
          10% { transform: translate(-5%,-5%) }
          20% { transform: translate(-10%,5%) }
          30% { transform: translate(5%,-10%) }
          40% { transform: translate(-5%,15%) }
          50% { transform: translate(-10%,5%) }
          60% { transform: translate(15%,0) }
          70% { transform: translate(0,15%) }
          80% { transform: translate(3%,35%) }
          90% { transform: translate(-10%,10%) }
          100% { transform: translate(0,0) }
        }
      `}</style>
    </div>
  );
};

export default FilmGrain;
