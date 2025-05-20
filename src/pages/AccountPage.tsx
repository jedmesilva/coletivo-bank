
import React from 'react';
import { CreditCard, Check, X, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';
import SummaryCard from '@/components/SummaryCard';
import TabNavigation from '@/components/TabNavigation';
import { formatCurrency } from '@/utils/formatCurrency';
import BottomNavigation from '@/components/BottomNavigation';

const AccountPage: React.FC = () => {
  const { 
    currentUser,
    userDebts, 
    userMovements, 
    userApprovals,
    accountTab, 
    setAccountTab,
    hideValues,
    getTotalUserDeposits,
    setSelectedDebtId,
    setIsDebtPaymentOpen,
    handleDebtPaymentClick
  } = useApp();

  const tabs = [
    { id: 'approvals', label: 'Aprovações' },
    { id: 'debts', label: 'Dívidas' },
    { id: 'movements', label: 'Movimentações' }
  ];

  const handleTabChange = (tabId: string) => {
    setAccountTab(tabId as 'debts' | 'movements' | 'approvals');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans w-full overflow-x-hidden">
      {/* Navbar */}
      <div className="w-full max-w-md mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-gray-100">
            <AvatarImage src={currentUser.profileImage} alt={currentUser.name} className="object-cover" />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">@{currentUser.username}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto pb-20 px-4">
        <div className="fade-in">
          {/* Account Summary Card */}
          <SummaryCard 
            title="Meus Aportes" 
            balance={getTotalUserDeposits()}
            leftLabel="Fundos ativos"
            leftValue={2}
            rightLabel="Dívidas ativas"
            rightValue={userDebts.length}
          />

          {/* Tabs */}
          <TabNavigation 
            tabs={tabs}
            activeTab={accountTab}
            onTabChange={handleTabChange}
          />

          {/* Tab Content */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mt-4">
            {/* Debts Tab */}
            {accountTab === 'debts' && (
              <div>
                {userDebts.length > 0 ? (
                  userDebts.map((debt) => (
                    <div key={debt.id} className="py-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{debt.description}</p>
                          <p className="text-gray-500 text-sm">{debt.fundName}</p>
                          <p className="text-gray-500 text-sm">Vencimento: {debt.dueDate}</p>
                        </div>
                        <p className="font-bold text-red-500">
                          {formatCurrency(debt.amount, hideValues)}
                        </p>
                      </div>
                      <button 
                        className="mt-3 bg-primary text-white px-4 py-2.5 sm:py-3 rounded-lg w-full flex items-center justify-center hover:bg-primary/90 transition-colors text-sm sm:text-base"
                        onClick={() => {
                          setSelectedDebtId(debt.id);
                          setIsDebtPaymentOpen(true);
                        }}
                      >
                        <CreditCard className="mr-2" size={16} />
                        Pagar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">Você não tem dívidas ativas</p>
                )}
              </div>
            )}

            {/* Movements Tab */}
            {accountTab === 'movements' && (
              <div>
                {userMovements.map((movement) => (
                  <div key={movement.id} className="py-3 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{movement.description}</p>
                        <p className="text-gray-500 text-sm">{movement.fundName}</p>
                        <p className="text-gray-500 text-sm">{movement.date}</p>
                      </div>
                      <p className={`font-bold ${
                        movement.type === 'deposit' ? 'text-green-500' : 
                        movement.type === 'debt-payment' ? 'text-blue-500' : 'text-red-500'
                      }`}>
                        {movement.type === 'deposit' ? '+' : movement.type === 'debt-payment' ? '' : '-'}
                        {formatCurrency(Math.abs(movement.value), hideValues)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Approvals Tab */}
            {accountTab === 'approvals' && (
              <div>
                {userApprovals.length > 0 ? (
                  userApprovals.map((approval) => (
                    <div key={approval.id} className="py-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-semibold">{approval.description}</p>
                          <p className="text-gray-500 text-sm">{approval.fundName}</p>
                          <p className="text-gray-500 text-sm">{approval.date}</p>
                        </div>
                        {approval.value && (
                          <p className="font-bold">
                            {formatCurrency(approval.value, hideValues)}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-500 text-white px-3 py-2.5 sm:py-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors text-sm sm:text-base">
                          <Check className="mr-2" size={16} />
                          Aprovar
                        </button>
                        <button className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                          <X className="mr-2" size={16} />
                          Recusar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">Nenhuma aprovação pendente</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AccountPage;
