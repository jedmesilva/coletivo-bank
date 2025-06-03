import React, { useState } from 'react';
import { ArrowUp, ArrowDownCircle, CreditCard, Check, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from '@/context/AppContext';
import SummaryCard from './SummaryCard';
import FundBalanceCard from './FundBalanceCard';
import TabNavigation from './TabNavigation';
import TopNavbar from './TopNavbar';
import HeaderSection from './HeaderSection';
import SidebarMenu from './MainMenu';
import { formatCurrency } from '@/utils/formatCurrency';

const FundDetail: React.FC = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    funds,
    fundTab, 
    setFundTab, 
    hideValues,
    userDebts,
    handleDepositClick,
    handleCapitalRequestClick,
    handleDebtPaymentClick
  } = useApp();

  const selectedFund = funds.find(fund => fund.id === fundId);
  
  // Get debts related to this fund
  const fundDebts = userDebts.filter(debt => debt.fundId === fundId);

  if (!selectedFund) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center mt-20">
            <h2 className="text-xl font-bold mb-4">Fundo não encontrado</h2>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-white px-4 py-2 rounded-full"
            >
              Voltar para home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'approvals', label: 'Aprovações' },
    { id: 'debts', label: 'Dívidas' },
    { id: 'history', label: 'Histórico' },
    { id: 'members', label: 'Membros' }
  ];

  const handleTabChange = (tabId: string) => {
    setFundTab(tabId as 'history' | 'approvals' | 'members' | 'debts');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans w-full overflow-x-hidden">
      {/* Top Navbar */}
      <TopNavbar 
        onMenuClick={() => setIsMenuOpen(true)}
        onNotificationClick={() => console.log('Notificações')}
      />

      {/* Header Section */}
      <HeaderSection className="pt-20">
        <div className="mb-6">
          {/* Fund info header */}
          <div className="flex items-center mb-6">
            <img 
              src={selectedFund.image} 
              alt={selectedFund.name} 
              className="w-16 h-16 rounded-2xl object-cover mr-4 shadow-sm border-2 border-white/20"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedFund.name}</h2>
              <p className="text-white/70">{selectedFund.description}</p>
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <FundBalanceCard 
          title="Saldo" 
          balance={selectedFund.balance}
          leftLabel="Membros"
          leftValue={selectedFund.members.length}
          showGrowth={true}
          growthValue={selectedFund.growth}
          fundId={selectedFund.id}
        />
      </HeaderSection>

      {/* Seção de Conteúdo - Fundo Branco */}
      <div className="bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 pt-8 pb-28">
          
          {/* Menu Lateral */}
          <SidebarMenu 
            isMenuOpen={isMenuOpen} 
            toggleMenu={() => setIsMenuOpen(false)} 
          />

          {/* Action Buttons */}
          <div className="flex justify-between mb-6">
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl flex flex-col items-center flex-1 mr-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              onClick={() => handleDepositClick(selectedFund.id)}
            >
              <ArrowUp size={20} className="mb-1" />
              <span className="font-medium">Aportar capital</span>
            </button>
            <button 
              className="bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-xl flex flex-col items-center flex-1 mx-2 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              onClick={() => handleCapitalRequestClick(selectedFund.id)}
            >
              <ArrowDownCircle size={20} className="mb-1" />
              <span className="font-medium">Solicitar capital</span>
            </button>
            <button 
              className="bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-xl flex flex-col items-center flex-1 ml-2 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              onClick={() => handleDebtPaymentClick(selectedFund.id)}
            >
              <CreditCard size={20} className="mb-1" />
              <span className="font-medium">Pagar dívida</span>
            </button>
          </div>

        {/* Tabs */}
        <TabNavigation
          tabs={tabs}
          activeTab={fundTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {fundTab === 'approvals' && (
            <div className="space-y-4">
              {selectedFund.approvals.map(approval => (
                <div key={approval.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{approval.description}</p>
                      <p className="text-sm text-gray-500">{approval.date}</p>
                    </div>
                    <div className="flex items-center">
                      {approval.status === 'pending' && <X className="text-orange-500 w-5 h-5" />}
                      {approval.status === 'approved' && <Check className="text-green-500 w-5 h-5" />}
                      {approval.status === 'rejected' && <X className="text-red-500 w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${approval.status === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                      ${approval.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${approval.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {approval.status === 'pending' ? 'Pendente' : 
                       approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </span>
                    {approval.value && (
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(approval.value, hideValues)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {fundTab === 'history' && (
            <div className="space-y-4">
              {selectedFund.history.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        item.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.type === 'deposit' ? '+' : '-'}{formatCurrency(item.value, hideValues)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fundTab === 'debts' && (
            <div className="space-y-4">
              {fundDebts.length > 0 ? (
                fundDebts.map(debt => (
                  <div key={debt.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{debt.description}</p>
                        <p className="text-sm text-gray-500">Vencimento: {debt.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {formatCurrency(debt.amount, hideValues)}
                        </p>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Em aberto
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDebtPaymentClick(selectedFund.id)}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Pagar dívida
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Nenhuma dívida em aberto</p>
                  <p className="text-gray-400 text-sm mt-1">Este fundo não possui dívidas pendentes</p>
                </div>
              )}
            </div>
          )}

          {fundTab === 'members' && (
            <div className="space-y-4">
              {selectedFund.members.map(member => (
                <div key={member.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-3">
                        <AvatarImage src={member.profileImage} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">Membro desde {member.joined}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetail;