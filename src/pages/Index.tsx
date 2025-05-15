import React from 'react';
import { Menu, Home, User, ArrowUp } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
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
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto pb-28">
            {/* Removed header as per request */}
            <div className="h-2"></div>

            <Account />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // FUND DETAIL SCREEN
  if (activeScreen === 'fund-detail') {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto pb-28">
            {/* Removed header as per request */}
            <div className="h-2"></div>

            <FundDetail />
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // HOME SCREEN (MAIN APP SCREEN)
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto pb-28">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <SidebarTrigger className="mr-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {funds.map(fund => (
              <FundCard
                key={fund.id}
                fund={fund}
                onClick={() => handleFundClick(fund.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Index;