
import React from 'react';
import { Menu, Home, User, ArrowUp } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useApp } from '@/context/AppContext';
import SummaryCard from '@/components/SummaryCard';
import FundCard from '@/components/FundCard';
import BottomNavigation from '@/components/BottomNavigation';
import FundDetail from '@/components/FundDetail';
import Account from '@/components/Account';

const Index: React.FC = () => {
  const { 
    funds, 
    activeScreen, 
    handleFundClick,
    getTotalBalance,
    getTotalMembers,
    setIsFundCreationOpen
  } = useApp();

  // ACCOUNT SCREEN
  if (activeScreen === 'account') {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-md mx-auto p-4 pb-28">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Minha Conta</h1>
          </div>
          
          <Account />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // FUND DETAIL SCREEN
  if (activeScreen === 'fund-detail') {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-md mx-auto p-4 pb-28">
          {/* Header */}
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">Detalhes do Fundo</h1>
          </div>
          
          <FundDetail />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // HOME SCREEN (MAIN APP SCREEN)
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-md mx-auto p-4 pb-28">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-primary text-xl">Coletivo Bank</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Home size={20} className="text-primary" />
                  <span>Página Inicial</span>
                </button>
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User size={20} className="text-primary" />
                  <span>Minha Conta</span>
                </button>
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowUp size={20} className="text-primary" />
                  <span>Fazer Aporte</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-2xl font-bold">Olá, <span className="text-primary">Lucas</span>!</h1>
            <p className="text-sm text-gray-500 mt-1">Bem-vindo ao Coletivo Bank</p>
          </div>
        </div>

        {/* Summary Card */}
        <SummaryCard
          title="Resumo"
          balance={getTotalBalance()}
          leftLabel="Fundos"
          leftValue={funds.length}
          rightLabel="Membros"
          rightValue={getTotalMembers()}
        />

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
      <BottomNavigation />
    </div>
  );
};

export default Index;
