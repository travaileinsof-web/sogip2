import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  elementType?: React.ElementType;
  delay?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className = '', 
  elementType: Component = 'div',
  delay = 0
}) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split the text into chars
    const split = new SplitType(textRef.current, { types: 'lines,words,chars' });

    // Animate the chars
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.chars,
        {
          y: 100,
          opacity: 0,
          rotateZ: 5,
        },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.02,
          delay: delay,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, textRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text, delay]);

  return (
    <Component ref={textRef} className={`clip-text-reveal ${className}`}>
      {text}
    </Component>
  );
};

export default TextReveal;
