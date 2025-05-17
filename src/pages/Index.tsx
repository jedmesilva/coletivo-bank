import React from 'react';
import { Menu, Home, User, ArrowUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SummaryCard from '@/components/SummaryCard';
import FundCard from '@/components/FundCard';
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
      <>
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-lg mx-auto h-14 px-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Minha Conta</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-md mx-auto p-4 pb-28">
          <Account />
        </div>
      </>
    );
  }

  // FUND DETAIL SCREEN
  if (activeScreen === 'fund-detail') {
    return (
      <>
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="max-w-lg mx-auto h-14 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                onClick={handleBackClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h1 className="text-xl font-semibold">Detalhes do Fundo</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <path d="M3 12h18M3 6h18M3 18h18"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-md mx-auto p-4 pb-28">
          <FundDetail />
        </div>
      </>
    );
  }

  // HOME SCREEN (MAIN APP SCREEN)
  return (
    <>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-lg mx-auto h-14 px-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Coletivo Bank</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-md mx-auto p-4 pb-28">
        {/* User greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Olá, <span className="text-primary">Lucas</span>!</h2>
          <p className="text-sm text-gray-500 mt-1">Bem-vindo ao Coletivo Bank</p>
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
    </>
  );
};

export default Index;