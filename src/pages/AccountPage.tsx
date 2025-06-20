import React, { useState } from 'react';
import { CreditCard, Check, X, User, ArrowUp, ArrowDown, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';
import SummaryCard from '@/components/SummaryCard';
import TabNavigation from '@/components/TabNavigation';
import { formatCurrency } from '@/utils/formatCurrency';
import TopNavbar from '@/components/TopNavbar';
import HeaderSection from '@/components/HeaderSection';
import SidebarMenu from '@/components/MainMenu';
import GeometricStatusBadge from '@/components/GeometricStatusBadge';
import MovementDetailSheet from '@/components/MovementDetailSheet';
import DebtDetailSheet from '@/components/DebtDetailSheet';
import ApprovalDetailSheet from '@/components/ApprovalDetailSheet';
import AppliedBalanceCard from '@/components/AppliedBalanceCard';

const AccountPage: React.FC = () => {
  const { 
    currentUser,
    userDebts, 
    userMovements, 
    userApprovals,
    accountTab, 
    setAccountTab,
    hideValues,
    getUserFreeBalance,
    funds,
    setSelectedDebtId,
    setIsDebtPaymentOpen,
    handleDebtPaymentClick,
    // Detail sheets
    isMovementDetailOpen,
    setIsMovementDetailOpen,
    selectedMovement,
    isDebtDetailOpen,
    setIsDebtDetailOpen,
    selectedDebtForDetail,
    isApprovalDetailOpen,
    setIsApprovalDetailOpen,
    selectedApproval,
    handleMovementClick,
    handleDebtDetailClick,
    handleApprovalClick
  } = useApp();

  // Estado para controlar a abertura/fechamento do menu lateral
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'approvals', label: 'Aprovações' },
    { id: 'debts', label: 'Dívidas' },
    { id: 'movements', label: 'Movimentações' }
  ];

  const handleTabChange = (tabId: string) => {
    setAccountTab(tabId as 'debts' | 'movements' | 'approvals');
  };

  return (
    <div className="fixed inset-0 bg-gray-50 font-sans overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* Top Navbar */}
        <TopNavbar 
          onMenuClick={() => setIsMenuOpen(true)}
          onNotificationClick={() => console.log('Notificações')}
          notificationCount={3}
        />

        {/* Header Section com cor de destaque */}
        <HeaderSection className="pt-20">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white/20 rounded-2xl">
                <AvatarImage src={currentUser.profileImage} alt={currentUser.name} className="object-cover rounded-2xl" />
                <AvatarFallback className="bg-white/20 text-white rounded-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white text-lg">{currentUser.name}</h2>
                <p className="text-sm text-white/70">Minha conta</p>
              </div>
            </div>
            <GeometricStatusBadge level={currentUser.accountLevel} />
          </div>
        </div>

        {/* Ações Section */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Ações</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-3 rounded-xl flex flex-col items-center shadow-sm hover:bg-white/30 hover:shadow-md transition-all duration-200 flex-1 min-h-[80px]"
              onClick={() => console.log('Fazer aporte clicado')}
            >
              <ArrowUp size={18} className="mb-1" />
              <span className="font-medium text-xs text-center leading-tight">Fazer Aporte</span>
            </button>
            <button 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-3 rounded-xl flex flex-col items-center shadow-sm hover:bg-white/30 hover:shadow-md transition-all duration-200 flex-1 min-h-[80px]"
              onClick={() => console.log('Receber Pix clicado')}
            >
              <ArrowDown size={18} className="mb-1" />
              <span className="font-medium text-xs text-center leading-tight">Receber Pix</span>
            </button>
            <button 
              className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white px-3 py-3 rounded-xl flex flex-col items-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex-1 min-h-[80px] backdrop-blur-sm"
              onClick={() => console.log('Enviar Pix clicado')}
            >
              <Send size={18} className="mb-1" />
              <span className="font-medium text-xs text-center leading-tight">Enviar Pix</span>
            </button>
            <button 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-3 rounded-xl flex flex-col items-center shadow-sm hover:bg-white/30 hover:shadow-md transition-all duration-200 flex-1 min-h-[80px]"
              onClick={() => console.log('QRCODE Pix clicado')}
            >
              <CreditCard size={18} className="mb-1" />
              <span className="font-medium text-xs text-center leading-tight">QR CODE Pix</span>
            </button>
          </div>
        </div>
      </HeaderSection>

      {/* Seção de Conteúdo - Fundo Branco */}
      <div className="bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 pt-8 pb-28">

          {/* Menu Lateral */}
          <SidebarMenu 
            isMenuOpen={isMenuOpen} 
            toggleMenu={() => setIsMenuOpen(false)} 
          />

          {/* Tabs */}
          <TabNavigation 
            tabs={tabs}
            activeTab={accountTab}
            onTabChange={handleTabChange}
          />

          {/* Tab Content */}
          <div>
            {/* Debts Tab */}
            {accountTab === 'debts' && (
              <div>
                {userDebts.length > 0 ? (
                  userDebts.map((debt) => (
                    <div 
                      key={debt.id} 
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg mb-4 cursor-pointer"
                      onClick={() => handleDebtDetailClick(debt)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{debt.description}</p>
                          <p className="text-gray-600 text-sm">{debt.fundName}</p>
                          <p className="text-gray-500 text-sm">Vencimento: {debt.dueDate}</p>
                        </div>
                        <p className="font-bold text-red-500">
                          {formatCurrency(debt.amount, hideValues)}
                        </p>
                      </div>
                      <button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-2xl w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDebtId(debt.id);
                          setIsDebtPaymentOpen(true);
                        }}
                      >
                        <CreditCard size={16} className="mr-2" />
                        Pagar dívida
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma dívida ativa</p>
                  </div>
                )}
              </div>
            )}

            {/* Movements Tab */}
            {accountTab === 'movements' && (
              <div>
                {userMovements.map((movement) => (
                  <div 
                    key={movement.id} 
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg mb-4 cursor-pointer"
                    onClick={() => handleMovementClick(movement)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{movement.description}</p>
                        <p className="text-gray-600 text-sm">{movement.fundName}</p>
                        <p className="text-gray-500 text-sm">{movement.date}</p>
                      </div>
                      <p className={`font-bold ${movement.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                        {movement.type === 'deposit' ? '+' : '-'}{formatCurrency(movement.value, hideValues)}
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
                    <div 
                      key={approval.id} 
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg mb-4 cursor-pointer"
                      onClick={() => handleApprovalClick(approval)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{approval.description}</p>
                          <p className="text-gray-600 text-sm">{approval.fundName}</p>
                          <p className="text-gray-500 text-sm">{approval.date}</p>
                        </div>
                        <div className="text-right">
                          {approval.value && (
                            <p className="font-bold text-gray-900 mb-1">
                              {formatCurrency(approval.value, hideValues)}
                            </p>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            approval.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            approval.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {approval.status === 'pending' ? 'Pendente' :
                             approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                        </div>
                      </div>
                      {approval.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center flex-1 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Check size={16} className="mr-1" />
                            Aprovar
                          </button>
                          <button 
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center flex-1 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <X size={16} className="mr-1" />
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma aprovação pendente</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Detail Sheets */}
        <MovementDetailSheet
          isOpen={isMovementDetailOpen}
          onClose={() => setIsMovementDetailOpen(false)}
          movement={selectedMovement}
        />

        <DebtDetailSheet
          isOpen={isDebtDetailOpen}
          onClose={() => setIsDebtDetailOpen(false)}
          debt={selectedDebtForDetail}
        />

        <ApprovalDetailSheet
          isOpen={isApprovalDetailOpen}
          onClose={() => setIsApprovalDetailOpen(false)}
          approval={selectedApproval}
        />
      </div>
    </div>
  );
};

export default AccountPage;