import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string | React.ReactNode;
  type?: 'chars' | 'words' | 'lines';
  delay?: number;
  className?: string;
  element?: React.ElementType;
}

const RevealText: React.FC<RevealTextProps> = ({
  children,
  type = 'words',
  delay = 0,
  className = '',
  element: Element = 'div',
}) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split the text
    const text = new SplitType(textRef.current, { types: type });
    const target = text[type as keyof typeof text] as HTMLElement[];

    if (!target) return;

    // Setup initial state (prevent flash of unstyled content)
    gsap.set(target, { y: '100%', opacity: 0 });
    
    // We wrap words in a span with overflow: hidden so they animate from the bottom of their bounding box
    if (type === 'words' || type === 'lines') {
        target.forEach((el) => {
            if(!el.parentElement?.classList.contains('reveal-overflow-hidden')) {
                const wrapper = document.createElement('span');
                wrapper.classList.add('reveal-overflow-hidden');
                wrapper.style.overflow = 'hidden';
                wrapper.style.display = 'inline-block';
                wrapper.style.verticalAlign = 'top';
                el.parentNode?.insertBefore(wrapper, el);
                wrapper.appendChild(el);
            }
        });
    }

    gsap.to(target, {
      y: '0%',
      opacity: 1,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.05,
      delay,
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      text.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === textRef.current) t.kill();
      });
    };
  }, [type, delay]);

  return (
    // @ts-ignore
    <Element ref={textRef} className={`${className}`}>
      {children}
    </Element>
  );
};

export default RevealText;
