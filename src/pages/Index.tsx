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
    setIsFundCreationOpen
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
      />

      {/* Header Section com cor de destaque */}
      <HeaderSection>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Olá, <span className="text-white/90">Lucas</span>!</h1>
          <p className="text-sm text-white/70 mt-1">Bem-vindo ao Coletivo Bank</p>
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

      <div className="max-w-md mx-auto p-4 pb-28">
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

        {/* Collective Fund Section */}
        <div className="flex justify-between items-center mb-5 mt-8">
          <h2 className="text-2xl font-bold flex items-center">
            Fundo coletivo
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {funds.length}
            </span>
          </h2>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-full shadow-sm hover:bg-primary/90 
                      transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
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
    </div>
  );
};

export default Index;