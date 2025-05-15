
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
      <div className="bg-white border-t border-gray-200 px-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <button 
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              activeScreen === 'home' 
                ? 'text-primary font-semibold bg-primary/10 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={handleBackClick}
          >
            <Home size={28} />
          </button>
          
          {/* Center deposit button */}
          <div className="flex items-center h-full">
            <button 
              className="bg-primary text-white px-6 py-3 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
              onClick={() => handleDepositClick()}
            >
              <ArrowUp className="mr-2" size={18} />
              <span className="font-medium">Fazer Aporte</span>
            </button>
          </div>
          
          <button 
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              activeScreen === 'account' 
                ? 'text-primary font-semibold bg-primary/10 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={handleAccountClick}
          >
            <Avatar className={`w-9 h-9 border-2 ${
              activeScreen === 'account' ? 'border-primary ring-2 ring-primary/20' : 'border-white'
            } shadow-sm`}>
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
