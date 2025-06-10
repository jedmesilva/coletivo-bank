
import React from 'react';
import { Home, ArrowUp, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const BottomNavigation: React.FC = () => {
  const { activeScreen, handleBackClick, handleAccountClick, handleDepositClick } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-white border-t border-gray-200 px-4 relative shadow-lg">
        <div className="flex justify-between items-end max-w-md mx-auto relative">
          <button 
            className={`flex flex-col items-center px-4 py-4 ${
              activeScreen === 'home' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
            onClick={handleBackClick}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Fundos</span>
          </button>
          
          <div className="transform -translate-y-4">
            <button 
              className="bg-primary text-white px-6 py-3 rounded-full flex items-center shadow-lg hover:bg-primary/90 transition-colors"
              onClick={() => handleDepositClick()}
            >
              <ArrowUp className="mr-2" size={18} />
              <span className="font-medium">Fazer Aporte</span>
            </button>
          </div>
          
          <button 
            className={`flex flex-col items-center px-4 py-4 ${
              activeScreen === 'account' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
            onClick={handleAccountClick}
          >
            <User size={24} />
            <span className="text-xs mt-1">Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
