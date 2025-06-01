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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-primary transition-all duration-300 ease-in-out ${
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    } ${
      isScrolled 
        ? 'backdrop-blur-md border-b border-white/20' 
        : ''
    }`}>
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center h-18">
        <button 
          onClick={onMenuClick}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center"
        >
          <Menu size={20} className="text-white" />
        </button>
        
        {/* Grupo do ícone de notificação com badge */}
        <div className="relative">
          <button 
            onClick={onNotificationClick}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <Bell size={20} className="text-white" />
          </button>
          {/* Badge de notificação com contador */}
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 rounded-full flex items-center justify-center px-1">
              <span className="text-white text-xs font-medium leading-none">
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