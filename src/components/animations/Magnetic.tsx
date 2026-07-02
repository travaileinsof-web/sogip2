import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.3 }) => {
  const magneticRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = magneticRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'power3.out' });
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * strength);
      yTo(y * strength);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  // Wrap the child element to attach the ref safely
  return (
    <div ref={magneticRef as React.RefObject<HTMLDivElement>} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
};

export default Magnetic;
