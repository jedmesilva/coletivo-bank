import React, { useEffect, useState } from 'react';
import { X, Home, CreditCard, PieChart, Settings, HelpCircle, LogOut, User, Wallet, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import GeometricStatusBadge from '@/components/GeometricStatusBadge';
import NotificationPanel from '@/components/NotificationPanel';

const SidebarMenu = () => {
  const { currentUser, isSidebarMenuOpen, setIsSidebarMenuOpen } = useApp();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  // Prevenir scroll do body quando o menu estiver aberto
  useEffect(() => {
    if (isSidebarMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup quando o componente for desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarMenuOpen]);
  const handleNotificationClick = () => {
    setIsNotificationPanelOpen(true);
    setIsSidebarMenuOpen(false); // Fechar o menu lateral
  };

  const menuItems = [
    { icon: Home, label: 'Início', active: true, onClick: () => {} },
    { icon: User, label: 'Dados pessoais', onClick: () => {
      setIsSidebarMenuOpen(false);
      // Abrir dados pessoais
      setTimeout(() => {
        const event = new CustomEvent('openPersonalData');
        window.dispatchEvent(event);
      }, 300);
    }},
    { icon: Bell, label: 'Notificações', badge: '3', onClick: handleNotificationClick },
    { icon: Settings, label: 'Configurações', onClick: () => {} },
    { icon: HelpCircle, label: 'Suporte', onClick: () => {} },
  ];

  return (
    <div className={`fixed inset-0 z-[99999] transition-all duration-300 ease-in-out ${
      isSidebarMenuOpen ? 'visible' : 'invisible'
    }`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsSidebarMenuOpen(false)}
      />
      
      {/* Menu Panel */}
      <div className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isSidebarMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header do Menu */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6 flex-shrink-0">
          {/* Profile Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg rounded-2xl">
                <AvatarImage src={currentUser.profileImage} alt={currentUser.name} className="object-cover rounded-2xl" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold rounded-2xl">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold">{currentUser.name}</h3>
                <p className="text-blue-200/80 text-sm">Coletivo Bank</p>
              </div>
            </div>
            <GeometricStatusBadge level={currentUser.accountLevel} />
          </div>
        </div>

        {/* Menu Items - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4" style={{ touchAction: 'pan-y' }}>
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:scale-105'
                  }`}>
                    <IconComponent size={18} />
                  </div>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.active 
                        ? 'bg-blue-200 text-blue-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all duration-200 group-hover:scale-105">
                <LogOut size={18} />
              </div>
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </div>
  );
};

export default SidebarMenu;
