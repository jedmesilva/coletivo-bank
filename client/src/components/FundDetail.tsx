
import React from 'react';
import { ArrowUp, ArrowDownCircle, CreditCard, Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SummaryCard from './SummaryCard';
import TabNavigation from './TabNavigation';
import { formatCurrency } from '@/utils/formatCurrency';

const FundDetail: React.FC = () => {
  const { 
    selectedFund, 
    fundTab, 
    setFundTab, 
    hideValues,
    handleDepositClick,
    handleCapitalRequestClick,
    handleDebtPaymentClick
  } = useApp();

  if (!selectedFund) return null;

  const tabs = [
    { id: 'history', label: 'Histórico' },
    { id: 'approvals', label: 'Aprovações' },
    { id: 'members', label: 'Membros' }
  ];

  const handleTabChange = (tabId: string) => {
    setFundTab(tabId as 'history' | 'approvals' | 'members');
  };

  return (
    <div className="fade-in">
      {/* Fund info header */}
      <div className="flex items-center mb-4">
        <img 
          src={selectedFund.image} 
          alt={selectedFund.name} 
          className="w-16 h-16 rounded-lg object-cover mr-4 shadow-sm"
        />
        <div>
          <h2 className="text-xl font-bold">{selectedFund.name}</h2>
          <p className="text-gray-600">{selectedFund.description}</p>
        </div>
      </div>

      {/* Balance Card */}
      <SummaryCard 
        title="Saldo" 
        balance={selectedFund.balance}
        leftLabel="Membros"
        leftValue={selectedFund.members.length}
        showGrowth={true}
        growthValue={selectedFund.growth}
      />

      {/* Action Buttons */}
      <div className="flex justify-between mb-6">
        <button 
          className="bg-primary text-white px-4 py-3 rounded-xl flex flex-col items-center flex-1 mr-2 shadow-sm hover:bg-primary/90 transition-colors"
          onClick={() => handleDepositClick(selectedFund.id)}
        >
          <ArrowUp size={20} className="mb-1" />
          <span className="font-medium">Aportar capital</span>
        </button>
        <button 
          className="bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-xl flex flex-col items-center flex-1 mx-2 shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => handleCapitalRequestClick(selectedFund.id)}
        >
          <ArrowDownCircle size={20} className="mb-1" />
          <span className="font-medium">Solicitar capital</span>
        </button>
        <button 
          className="bg-white text-gray-900 border border-gray-300 px-4 py-3 rounded-xl flex flex-col items-center flex-1 ml-2 shadow-sm hover:bg-gray-50 transition-colors"
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
      <div className="bg-white rounded-xl p-4 shadow-sm">
        {/* History Tab */}
        {fundTab === 'history' && (
          <div>
            {selectedFund.history.length > 0 ? (
              selectedFund.history.map((item) => (
                <div key={item.id} className="py-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-gray-500 text-sm">{item.date}</p>
                    </div>
                    <p className={`font-bold ${item.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.type === 'deposit' ? '+' : '-'}
                      {hideValues ? "R$ ***" : `R$ ${Math.abs(item.value).toLocaleString('pt-BR')}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">Nenhum histórico disponível</p>
            )}
          </div>
        )}

        {/* Approvals Tab */}
        {fundTab === 'approvals' && (
          <div>
            {selectedFund.approvals.length > 0 ? (
              selectedFund.approvals.map((item) => (
                <div key={item.id} className="py-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-gray-500 text-sm">{item.date}</p>
                    </div>
                    <div className="text-right">
                      {item.value !== null && (
                        <p className="font-bold">
                          {formatCurrency(item.value, hideValues)}
                        </p>
                      )}
                      <p className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full inline-block mt-1">
                        {item.status === 'pending' ? 'Pendente' : 
                          item.status === 'approved' ? 'Aprovado' : 'Recusado'}
                      </p>
                    </div>
                  </div>
                  
                  {item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                        <Check className="mr-2" size={16} />
                        Aprovar
                      </button>
                      <button className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                        <X className="mr-2" size={16} />
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">Nenhuma aprovação pendente</p>
            )}
          </div>
        )}

        {/* Members Tab */}
        {fundTab === 'members' && (
          <div>
            {selectedFund.members.map((member) => (
              <div key={member.id} className="py-3 border-b border-gray-100 last:border-0 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-gray-500 text-sm">Desde {member.joined}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm px-2 py-1 rounded-full inline-block ${
                    member.role === 'Admin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundDetail;
