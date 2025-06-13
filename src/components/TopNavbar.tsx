import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface TopNavbarProps {
  onMenuClick: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onNotificationClick, notificationCount = 0 }) => {
  const scrollDirection = useScrollDirection();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const findScrollContainer = () => {
      const containers = document.querySelectorAll('.h-full.overflow-y-auto');
      return containers[0] as HTMLElement || window;
    };

    const handleScroll = () => {
      const container = findScrollContainer();
      const scrollY = container === window ? window.pageYOffset : container.scrollTop;
      setIsScrolled(scrollY > 20);
    };

    const container = findScrollContainer();
    
    if (container === window) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    } ${
      isScrolled 
        ? 'bg-slate-900/70 backdrop-blur-lg border-b border-white/10 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <button 
          onClick={onMenuClick}
          className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
        >
          <Menu size={20} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="relative">
          <button 
            onClick={onNotificationClick}
            className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
          >
            <Bell size={20} className="text-white group-hover:scale-110 transition-transform" />
          </button>
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center px-1 shadow-lg">
              <span className="text-white text-xs font-bold leading-none">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;