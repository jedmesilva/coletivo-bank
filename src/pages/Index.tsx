
import React from 'react';
import { Menu } from 'lucide-react';
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
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold">Olá, Lucas!</h1>
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
        <div className="flex justify-between items-center mb-4 mt-8">
          <h2 className="text-2xl font-bold">Fundo coletivo</h2>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-full shadow-sm hover:bg-primary/90 transition-colors"
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
