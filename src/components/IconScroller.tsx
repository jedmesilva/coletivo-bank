
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, DollarSign } from 'lucide-react';

export default function IconScroller() {
  const icons = [
    { component: ArrowUp },
    { component: DollarSign },
  ];

  const [visibleIcons, setVisibleIcons] = useState([0, 1]);
  const containerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const animateScroll = () => {
    if (isAnimatingRef.current || !containerRef.current) return;
    isAnimatingRef.current = true;

    const container = containerRef.current;
    
    // Primeiro movimento: deslizar para cima
    container.style.transition = "transform 0.6s ease-in-out";
    container.style.transform = "translateY(-100%)";
    
    // Após a animação, reposicionar e atualizar os ícones
    setTimeout(() => {
      container.style.transition = "none";
      container.style.transform = "translateY(0)";
      
      setVisibleIcons(prev => [
        prev[1],
        (prev[1] + 1) % icons.length
      ]);
      
      // Permitir nova animação
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 50);
    }, 600);
  };

  useEffect(() => {
    const interval = setInterval(animateScroll, 3000);
    return () => clearInterval(interval);
  }, []);

  const Icon1 = icons[visibleIcons[0]].component;
  const Icon2 = icons[visibleIcons[1]].component;

  return (
    <div className="h-[18px] w-[18px] mr-2 overflow-hidden relative">
      <div ref={containerRef} className="transform-gpu">
        <div className="h-[18px] flex items-center justify-center">
          <Icon1 size={18} className="text-white" />
        </div>
        <div className="h-[18px] flex items-center justify-center">
          <Icon2 size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}
