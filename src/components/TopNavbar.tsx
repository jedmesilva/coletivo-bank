import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface TopNavbarProps {
  onMenuClick: () => void;
  onNotificationClick?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onNotificationClick }) => {
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
    <div className={`fixed top-0 left-0 right-0 z-50 bg-primary safe-area-pt transition-all duration-300 ease-in-out ${
      scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
    } ${
      isScrolled 
        ? 'backdrop-blur-md border-b border-white/20' 
        : ''
    }`}>
      <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <Menu size={20} className="text-white" />
        </button>
        
        <button 
          onClick={onNotificationClick}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors relative"
        >
          <Bell size={20} className="text-white" />
          {/* Badge de notificação (opcional) */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;