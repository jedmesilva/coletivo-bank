import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopNavbarProps {
  onMenuClick: () => void;
  onNotificationClick?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, onNotificationClick }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-colors"
        >
          <Menu size={20} className="text-white" />
        </button>
        
        <button 
          onClick={onNotificationClick}
          className="p-2 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-colors relative"
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