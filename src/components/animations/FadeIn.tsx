import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  stagger?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 1.2,
  distance = 50,
  className = '',
  stagger = 0,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case 'up':
        y = distance;
        break;
      case 'down':
        y = -distance;
        break;
      case 'left':
        x = distance;
        break;
      case 'right':
        x = -distance;
        break;
      default:
        break;
    }

    gsap.fromTo(
      element,
      {
        opacity: 0,
        x,
        y,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [direction, delay, duration, distance, stagger]);

  return (
    <div ref={elementRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
};

export default FadeIn;
