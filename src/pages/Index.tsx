import React, { useState } from 'react';
import { Home, User, ArrowUp, Menu, Settings, MapPin, CreditCard, Bell, Lock, Shield, Palette, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import SummaryCard from '@/components/SummaryCard';
import FundCard from '@/components/FundCard';
import TopNavbar from '@/components/TopNavbar';
import HeaderSection from '@/components/HeaderSection';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { 
    funds, 
    getTotalBalance,
    getTotalMembers,
    setIsFundCreationOpen,
    handleDepositClick
  } = useApp();
  
  // Estado para controlar a abertura/fechamento do menu lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFundClick = (fundId: string) => {
    navigate(`/fund/${fundId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Top Navbar Transparente */}
      <TopNavbar 
        onMenuClick={() => setIsMenuOpen(true)}
        onNotificationClick={() => console.log('Notificações')}
        notificationCount={3}
      />

      {/* Header Section com cor de destaque */}
      <HeaderSection>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Olá, Lucas! 👋
          </h1>
          <p className="text-blue-200/80 text-lg font-medium">
            Bem-vindo ao Coletivo Bank
          </p>
        </div>
        
        {/* Summary Card dentro do header */}
        <SummaryCard
          title="Resumo"
          balance={getTotalBalance()}
          leftLabel="Fundos"
          leftValue={funds.length}
          rightLabel="Membros"
          rightValue={getTotalMembers()}
        />
      </HeaderSection>

      {/* Seção Fundos - Fundo Branco */}
      <div className="bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 pt-8">
          {/* Menu Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-lg">Coletivo Bank</SheetTitle>
                </div>
              </SheetHeader>
              <div className="overflow-y-auto h-full py-2">
                {/* Menu Principal */}
                <div className="px-2 py-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
                    Menu Principal
                  </h3>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/')}
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <Home className="w-5 h-5" />
                      <span>Página Inicial</span>
                    </Button>
                  </SheetClose>
                  <Separator className="my-2 mx-3" />
                </div>
                
                {/* Dados Pessoais */}
                <div className="px-2 py-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
                    Dados Pessoais
                  </h3>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/account')}
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <User className="w-5 h-5" />
                      <span>Meu Perfil</span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Endereço</span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Dados Bancários</span>
                    </Button>
                  </SheetClose>
                  <Separator className="my-2 mx-3" />
                </div>
                
                {/* Configurações */}
                <div className="px-2 py-3">
                  <h3 className="text-sm font-medium text-muted-foreground px-3 mb-2">
                    Configurações
                  </h3>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <Bell className="w-5 h-5" />
                      <span>Notificações</span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Privacidade</span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Segurança</span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-5 h-auto text-base"
                    >
                      <Palette className="w-5 h-5" />
                      <span>Tema</span>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Seção Fundos */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">Fundo coletivo</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{funds.length}</span>
              </div>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => setIsFundCreationOpen(true)}
              >
                + Novo fundo
              </button>
            </div>

            {/* Fund Cards */}
            {funds.map(fund => (
              <FundCard
                key={fund.id}
                fund={fund}
                onClick={() => handleFundClick(fund.id)}
              />
            ))}
          </div>

          {/* Bottom Spacing */}
          <div className="pb-28">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;