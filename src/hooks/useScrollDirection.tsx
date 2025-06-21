import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Diferença mínima para considerar o scroll
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) return;
      
      const isScrollingDown = currentScrollY > lastScrollY.current;
      
      if (isScrollingDown && currentScrollY > 20) {
        // Oculta quando rola para baixo após 20px
        setIsVisible(false);
      } else if (!isScrollingDown || currentScrollY <= 20) {
        // Mostra quando rola para cima ou está no topo
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    let ticking = false;
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16);
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  return { isVisible };
};

