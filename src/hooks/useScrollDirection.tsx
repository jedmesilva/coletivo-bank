import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Diferença mínima para considerar o scroll
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
        ticking.current = false;
        return;
      }
      
      const isScrollingDown = currentScrollY > lastScrollY.current;
      
      if (isScrollingDown && currentScrollY > 20) {
        setIsVisible(false);
      } else if (!isScrollingDown || currentScrollY <= 20) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const requestTick = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  return { isVisible };
};

