import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = (event: Event) => {
      const target = event.target as HTMLElement;
      let currentScrollY = 0;
      
      // Detecta o tipo de scroll
      if (target === document || target === document.documentElement) {
        currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      } else if (target.classList.contains('overflow-y-auto')) {
        currentScrollY = target.scrollTop;
      } else {
        ticking.current = false;
        return;
      }
      
      // Diferença mínima para considerar o scroll
      if (Math.abs(currentScrollY - lastScrollY.current) < 8) {
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

    const requestTick = (event: Event) => {
      if (!ticking.current) {
        requestAnimationFrame(() => updateScrollDirection(event));
        ticking.current = true;
      }
    };

    // Adiciona listeners para window e containers
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Observer para detectar novos containers de scroll
    const observer = new MutationObserver(() => {
      const scrollContainers = document.querySelectorAll('.overflow-y-auto');
      scrollContainers.forEach(container => {
        container.addEventListener('scroll', requestTick, { passive: true });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Adiciona para containers existentes
    const existingContainers = document.querySelectorAll('.overflow-y-auto');
    existingContainers.forEach(container => {
      container.addEventListener('scroll', requestTick, { passive: true });
    });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
      existingContainers.forEach(container => {
        container.removeEventListener('scroll', requestTick);
      });
      observer.disconnect();
    };
  }, []);

  return { isVisible };
};

