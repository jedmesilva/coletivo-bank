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
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <div className="bg-white border-t border-gray-200 px-2 sm:px-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <button 
            className={`flex flex-col items-center p-2 sm:p-3 relative transition-all ${
              activeScreen === 'home' 
                ? 'text-primary font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 sm:after:w-6 after:h-0.5 after:bg-primary after:rounded-full' 
                : 'text-gray-600'
            }`}
            onClick={handleBackClick}
          >
            <Home size={24} className="sm:w-[28px] sm:h-[28px]" />
          </button>

          {/* Center deposit button */}
          <div className="flex items-center h-full">
            <button 
              className="bg-primary text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              onClick={() => handleDepositClick()}
            >
              <ArrowUp className="mr-1 sm:mr-2" size={16} />
              <span className="font-medium">Fazer Aporte</span>
            </button>
          </div>

          <button 
            className={`flex flex-col items-center p-2 sm:p-3 relative transition-all ${
              activeScreen === 'account' 
                ? 'text-primary font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-5 sm:after:w-6 after:h-0.5 after:bg-primary after:rounded-full'
                : 'text-gray-600'
            }`}
            onClick={handleAccountClick}
          >
            <Avatar className={`w-7 h-7 sm:w-8 sm:h-8 border-2 transition-colors ${
              activeScreen === 'account' ? 'border-primary' : 'border-gray-100'
            }`}>
              <AvatarImage src={currentUser.profileImage} alt={currentUser.name} className="object-cover" />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;