
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, DollarSign } from 'lucide-react';

export default function IconScroller() {
  const icons = [
    { component: ArrowUp },
    { component: DollarSign },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      container.style.transition = "transform 1.2s cubic-bezier(0.37, 0, 0.63, 1)";
      container.style.transform = "translateY(-100%)";

      setTimeout(() => {
        container.style.transition = "none";
        container.style.transform = "translateY(0)";
        setCurrentIndex((prev) => (prev + 1) % icons.length);
      }, 1200);
    }, 10000);

    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIndex].component;
  const NextIcon = icons[(currentIndex + 1) % icons.length].component;

  return (
    <div className="h-[18px] w-[18px] mr-2 overflow-hidden relative">
      <div ref={containerRef}>
        <div className="h-[18px] flex items-center justify-center">
          <CurrentIcon size={18} className="text-white" />
        </div>
        <div className="h-[18px] flex items-center justify-center">
          <NextIcon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}
