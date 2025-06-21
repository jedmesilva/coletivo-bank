import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

interface TopNavbarProps {
  onMenuClick: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onNotificationClick, notificationCount = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      let scrollY = 0;
      
      // Detecta se é scroll da window ou de um container
      if (target === document || target === document.documentElement) {
        scrollY = window.pageYOffset || document.documentElement.scrollTop;
      } else if (target.classList.contains('overflow-y-auto')) {
        scrollY = target.scrollTop;
      } else {
        return;
      }
      
      // Atualiza o estado de rolagem para o background
      setIsScrolled(scrollY > 20);
      
      // Lógica de auto-hide com debounce para evitar tremulação
      if (Math.abs(scrollY - lastScrollY) > 5) {
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        
        if (direction === 'down' && scrollY > 50) {
          setIsVisible(false);
        } else if (direction === 'up' || scrollY <= 20) {
          setIsVisible(true);
        }
        
        lastScrollY = scrollY;
      }
    };

    // Adiciona listeners tanto para window quanto para containers com scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Busca containers com scroll e adiciona listeners
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
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
            onClick={() => {
              setIsNotificationPanelOpen(true);
              onNotificationClick?.();
            }}
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

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default TopNavbar;