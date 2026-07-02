import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement<any>;
  strength?: number;
}

const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      xTo(dx * strength);
      yTo(dy * strength);
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

  return React.cloneElement(children, { ref } as any);
};

export default Magnetic;
