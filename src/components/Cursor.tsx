import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Position initiale
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // Tween rapide pour que le curseur "rattrape" la souris (80ms lag per the ultra-luxe guide)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(250, 204, 21, 0.2)', backdropFilter: 'blur(2px)', duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: 'var(--color-accent)', backdropFilter: 'blur(0px)', duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Observer pour écouter l'ajout de nouveaux boutons/liens (important en React)
    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-cursor="hover"]');
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attachement
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-cursor="hover"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ backgroundColor: 'var(--color-accent)', transition: 'background-color 0.3s, backdrop-filter 0.3s' }}
    />
  );
};

export default Cursor;
