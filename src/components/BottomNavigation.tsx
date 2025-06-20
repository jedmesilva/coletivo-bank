import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconScroller from './IconScroller';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    handleDepositClick,
    currentUser
  } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-white border-t border-gray-200 px-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto h-16">
          <button 
            className={`flex flex-col items-center p-3 relative transition-all duration-200 ${
              location.pathname === '/' 
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg font-semibold' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl'
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
            className={`flex flex-col items-center p-3 relative transition-all duration-200 ${
              location.pathname === '/account' 
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl'
            }`}
            onClick={() => navigate('/account')}
          >
            <Avatar className={`w-8 h-8 border-2 transition-colors rounded-lg overflow-hidden ${
              location.pathname === '/account' ? 'border-white' : 'border-gray-200'
            }`}>
              <AvatarImage 
                src={currentUser.profileImage} 
                alt={currentUser.name} 
                className="object-cover rounded-lg" 
                style={{ borderRadius: '0.5rem', objectFit: 'cover' }}
              />
              <AvatarFallback className={`text-sm font-semibold rounded-lg ${
                location.pathname === '/account' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;