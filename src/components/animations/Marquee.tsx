import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  outline?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 1, className = "", outline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    
    if (!text1 || !text2) return;

    // Reset initial positions
    gsap.set(text1, { xPercent: 0 });
    gsap.set(text2, { xPercent: 100 });

    const duration = 20 / speed;

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    
    tl.to(text1, { xPercent: -100, duration }, 0)
      .to(text2, { xPercent: 0, duration }, 0);

  }, [speed]);

  const outlineStyle = outline 
    ? { WebkitTextStroke: '2px rgba(255,255,255,0.05)', color: 'transparent' }
    : { opacity: 0.05 };

  return (
    <div ref={containerRef} className={`overflow-hidden flex whitespace-nowrap pointer-events-none select-none w-full ${className}`}>
      <div className="relative flex w-full">
        <div ref={text1Ref} className="text-[10rem] md:text-[15rem] font-serif font-bold uppercase tracking-widest whitespace-nowrap" style={outlineStyle}>
          {text} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp;
        </div>
        <div ref={text2Ref} className="absolute top-0 left-0 text-[10rem] md:text-[15rem] font-serif font-bold uppercase tracking-widest whitespace-nowrap" style={outlineStyle}>
          {text} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp;
        </div>
      </div>
    </div>
  );
};

export default Marquee;
