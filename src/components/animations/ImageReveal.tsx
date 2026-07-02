import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

const ImageReveal: React.FC<ImageRevealProps> = ({ src, alt, className = "", imageClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    // Mask reveal animation
    gsap.fromTo(container,
      { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
        }
      }
    );

    // Image slight scale down while revealing
    gsap.fromTo(image,
      { scale: 1.2 },
      {
        scale: 1,
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
        }
      }
    );

    // Continuous Ken Burns effect after reveal
    gsap.to(image, {
      scale: 1.05,
      duration: 10,
      ease: "none",
      repeat: -1,
      yoyo: true,
      delay: 1.5,
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause"
      }
    });

  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden relative ${className}`}>
      <img 
        ref={imageRef} 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover origin-center ${imageClassName}`} 
      />
    </div>
  );
};

export default ImageReveal;
