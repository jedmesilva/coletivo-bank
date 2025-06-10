
import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Tentar encontrar o container de scroll da página atual
    const findScrollContainer = () => {
      const containers = document.querySelectorAll('.h-full.overflow-y-auto');
      return containers[0] as HTMLElement || window;
    };

    const updateScrollDirection = () => {
      const container = scrollContainerRef.current || findScrollContainer();
      const scrollY = container === window ? window.pageYOffset : container.scrollTop;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      // Usar thresholds diferentes: 10px para esconder, 1px para aparecer
      const threshold = direction === 'down' ? 10 : 1;
      const scrollDiff = Math.abs(scrollY - lastScrollY);
      
      if (direction !== scrollDirection && scrollDiff >= threshold) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    const container = findScrollContainer();
    scrollContainerRef.current = container;
    
    if (container === window) {
      window.addEventListener('scroll', updateScrollDirection);
      return () => {
        window.removeEventListener('scroll', updateScrollDirection);
      };
    } else {
      container.addEventListener('scroll', updateScrollDirection);
      return () => {
        container.removeEventListener('scroll', updateScrollDirection);
      };
    }
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};
