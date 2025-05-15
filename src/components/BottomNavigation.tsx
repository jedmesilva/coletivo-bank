
import React from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BottomNavigation: React.FC = () => {
  const { 
    activeScreen, 
    handleBackClick, 
    handleAccountClick, 
    handleDepositClick,
    currentUser
  } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-white border-t border-gray-200 px-4 relative shadow-lg">
        <div className="flex justify-between items-end max-w-md mx-auto relative">
          <button 
            className={`flex flex-col items-center px-4 py-4 h-16 ${
              activeScreen === 'home' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
            onClick={handleBackClick}
          >
            <Home size={24} />
            {activeScreen === 'home' && (
              <span className="text-xs mt-1 opacity-0 animate-[fade-in_0.3s_ease-in-out_forwards]">Fundos</span>
            )}
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
            <Avatar className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200 hover:scale-110 border-2 ${
              activeScreen === 'account' ? 'border-primary ring-2 ring-primary/20' : 'border-white'
            } shadow-sm`}>
              <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {activeScreen === 'account' && (
              <span className="text-xs mt-1 opacity-0 animate-[fade-in_0.3s_ease-in-out_forwards]">Conta</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
