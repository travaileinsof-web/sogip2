import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.5, className = '' }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current || !targetRef.current) return;

    const yMovement = -(window.innerHeight * speed);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.fromTo(
      targetRef.current,
      { y: 0 },
      { y: yMovement, ease: 'none' }
    );

    return () => {
      tl.kill();
    };
  }, [speed]);

  return (
    <div ref={triggerRef} className={`overflow-hidden ${className}`}>
      <div ref={targetRef} className="h-[120%] w-full relative -top-[10%]">
        {children}
      </div>
    </div>
  );
};

export default Parallax;
