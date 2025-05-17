import React from 'react';
import { Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../components/ui/sheet';
import { Home, User, MapPin, CreditCard, Bell, Lock, Shield, Palette } from 'lucide-react';

const MobileHeader: React.FC = () => {
  const { setActiveScreen, activeScreen } = useApp();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="max-w-lg mx-auto h-14 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Coletivo Bank</h2>
              </div>
              
              <div className="py-4">
                <div className="px-4 pb-2">
                  <p className="text-xs font-medium text-gray-500">Menu Principal</p>
                </div>
                <button
                  className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 ${
                    activeScreen === 'home' ? 'bg-gray-100 text-primary' : ''
                  }`}
                  onClick={() => {
                    setActiveScreen('home');
                    document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                      new Event('click', { bubbles: true })
                    );
                  }}
                >
                  <Home className="w-4 h-4" />
                  <span>Página Inicial</span>
                </button>
              </div>

              <div className="py-2">
                <div className="px-4 pb-2">
                  <p className="text-xs font-medium text-gray-500">Dados Pessoais</p>
                </div>
                <button
                  className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 ${
                    activeScreen === 'account' ? 'bg-gray-100 text-primary' : ''
                  }`}
                  onClick={() => {
                    setActiveScreen('account');
                    document.querySelector('[data-radix-collection-item]')?.dispatchEvent(
                      new Event('click', { bubbles: true })
                    );
                  }}
                >
                  <User className="w-4 h-4" />
                  <span>Meu Perfil</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Endereço</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Dados Bancários</span>
                </button>
              </div>

              <div className="py-2">
                <div className="px-4 pb-2">
                  <p className="text-xs font-medium text-gray-500">Configurações</p>
                </div>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notificações</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <Lock className="w-4 h-4" />
                  <span>Privacidade</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <Shield className="w-4 h-4" />
                  <span>Segurança</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 flex items-center space-x-3"
                >
                  <Palette className="w-4 h-4" />
                  <span>Tema</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-semibold">
            {activeScreen === 'home' && 'Coletivo Bank'}
            {activeScreen === 'fund-detail' && 'Detalhes do Fundo'}
            {activeScreen === 'account' && 'Minha Conta'}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;