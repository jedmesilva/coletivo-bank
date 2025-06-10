import React from 'react';
import { ArrowLeft, CreditCard, Calendar, FileText, Building2, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface DebtDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  debt: any;
}

const DebtDetailSheet: React.FC<DebtDetailSheetProps> = ({
  isOpen,
  onClose,
  debt
}) => {
  const { hideValues, setSelectedDebtId, setIsDebtPaymentOpen } = useApp();

  if (!debt) return null;

  const handlePayDebt = () => {
    setSelectedDebtId(debt.id);
    setIsDebtPaymentOpen(true);
    onClose();
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(debt.dueDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

  const getStatusInfo = () => {
    if (isOverdue) {
      return {
        label: 'Em atraso',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    } else if (isDueSoon) {
      return {
        label: 'Vence em breve',
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        label: 'Em dia',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="debt-detail-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                onClick={onClose}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <SheetTitle className="text-xl text-white font-semibold">
                  Detalhes da dívida
                </SheetTitle>
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                Informações completas sobre esta dívida
              </SheetDescription>
            </div>
          </header>

          <div className="p-4 pb-60">
            {/* Ícone e valor principal */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-4xl font-bold text-red-500 mb-2">
                {formatCurrency(debt.amount, hideValues)}
              </p>
              <p className="text-lg text-gray-600 font-medium">
                Dívida em aberto
              </p>
            </div>

            {/* Alerta de status se necessário */}
            {(isOverdue || isDueSoon) && (
              <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-xl p-4 mb-6`}>
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`h-5 w-5 ${statusInfo.textColor}`} />
                  <div>
                    <p className={`font-semibold ${statusInfo.textColor}`}>
                      {isOverdue ? 'Dívida em atraso' : 'Vencimento próximo'}
                    </p>
                    <p className={`text-sm ${statusInfo.textColor}`}>
                      {isOverdue 
                        ? `Esta dívida está atrasada há ${Math.abs(daysUntilDue)} dias`
                        : `Esta dívida vence em ${daysUntilDue} dias`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações detalhadas */}
            <div className="space-y-4">
              {/* Descrição */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Descrição</p>
                    <p className="text-gray-900 font-medium">{debt.description}</p>
                  </div>
                </div>
              </div>

              {/* Fundo */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Fundo</p>
                    <p className="text-gray-900 font-medium">{debt.fundName}</p>
                  </div>
                </div>
              </div>

              {/* Data de vencimento */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Data de vencimento</p>
                    <p className="text-gray-900 font-medium">{debt.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Valor original */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Valor original</p>
                    <p className="text-gray-900 font-semibold text-lg">{formatCurrency(debt.amount, hideValues)}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <p className={`font-medium ${statusInfo.textColor}`}>{statusInfo.label}</p>
                  </div>
                  <div className={`w-3 h-3 ${statusInfo.color} rounded-full`}></div>
                </div>
              </div>

              {/* ID da dívida */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">ID da dívida</p>
                    <p className="text-gray-600 font-mono text-sm">{debt.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4 space-y-3">
            <Button 
              onClick={handlePayDebt}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Pagar dívida
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DebtDetailSheet;