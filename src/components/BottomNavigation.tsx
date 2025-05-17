import React from 'react';
import { Home, Plus, User } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-10">
      <div className="bg-white border-t border-gray-200 px-4 shadow-lg">
        <div className="flex items-center justify-between max-w-lg mx-auto h-16">
          {/* Home button */}
          <button 
            className={`flex flex-col items-center justify-center w-full relative transition-all ${
              activeScreen === 'home' 
                ? 'text-primary font-medium' 
                : 'text-gray-500'
            }`}
            onClick={handleBackClick}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Início</span>
            {activeScreen === 'home' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary"></span>
            )}
          </button>

          {/* Add deposit button */}
          <button 
            className="flex flex-col items-center justify-center w-full relative"
            onClick={() => handleDepositClick()}
          >
            <div className="bg-primary text-white p-3 rounded-full flex items-center justify-center shadow-md">
              <Plus size={24} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Aporte</span>
          </button>

          {/* Profile button */}
          <button 
            className={`flex flex-col items-center justify-center w-full relative transition-all ${
              activeScreen === 'account' 
                ? 'text-primary font-medium'
                : 'text-gray-500'
            }`}
            onClick={handleAccountClick}
          >
            {activeScreen === 'account' ? (
              <Avatar className="w-8 h-8 border-2 border-primary">
                <AvatarImage src={currentUser.profileImage} alt={currentUser.name} className="object-cover" />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <User size={24} />
            )}
            <span className="text-xs mt-1">Perfil</span>
            {activeScreen === 'account' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary"></span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;