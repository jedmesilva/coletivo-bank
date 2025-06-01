import React, { useState, useEffect } from 'react';
import { Home, ArrowUp, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconScroller from './IconScroller';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    handleDepositClick,
    currentUser
  } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-white border-t border-gray-200 px-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <button 
            className={`flex flex-col items-center p-3 relative transition-all ${
              location.pathname === '/' 
                ? 'text-primary font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-primary after:rounded-full' 
                : 'text-gray-600'
            }`}
            onClick={() => navigate('/')}
          >
            <Home size={28} />
          </button>

          {/* Center deposit button */}
          <div className="flex items-center h-full">
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] gap-2"
              onClick={() => handleDepositClick()}
            >
              <IconScroller />
              <span className="font-semibold">Fazer Aporte</span>
            </button>
          </div>

          <button 
            className={`flex flex-col items-center p-3 relative transition-all ${
              location.pathname === '/account' 
                ? 'text-primary font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-primary after:rounded-full'
                : 'text-gray-600'
            }`}
            onClick={() => navigate('/account')}
          >
            <Avatar className={`w-8 h-8 border-2 transition-colors ${
              location.pathname === '/account' ? 'border-primary' : 'border-gray-100'
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