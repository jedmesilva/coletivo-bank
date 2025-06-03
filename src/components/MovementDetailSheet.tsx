import React from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Calendar, FileText, Building2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MovementDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  movement: any;
}

const MovementDetailSheet: React.FC<MovementDetailSheetProps> = ({
  isOpen,
  onClose,
  movement
}) => {
  const { hideValues } = useApp();

  if (!movement) return null;

  const getMovementIcon = () => {
    switch (movement.type) {
      case 'deposit':
        return <ArrowUp className="h-6 w-6 text-green-500" />;
      case 'withdrawal':
        return <ArrowDown className="h-6 w-6 text-red-500" />;
      case 'debt-payment':
        return <ArrowDown className="h-6 w-6 text-blue-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const getMovementTypeLabel = () => {
    switch (movement.type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Saque';
      case 'debt-payment':
        return 'Pagamento de Dívida';
      default:
        return 'Movimentação';
    }
  };

  const getMovementColor = () => {
    switch (movement.type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-red-500';
      case 'debt-payment':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="movement-detail-description"
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
                  Detalhes da movimentação
                </SheetTitle>
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                Informações completas sobre esta transação
              </SheetDescription>
            </div>
          </header>

          <div className="p-4 pb-60">
            {/* Ícone e valor principal */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                {getMovementIcon()}
              </div>
              <p className={`text-4xl font-bold ${getMovementColor()} mb-2`}>
                {movement.type === 'deposit' ? '+' : '-'}{formatCurrency(movement.value, hideValues)}
              </p>
              <p className="text-lg text-gray-600 font-medium">
                {getMovementTypeLabel()}
              </p>
            </div>

            {/* Informações detalhadas */}
            <div className="space-y-4">
              {/* Descrição */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Descrição</p>
                    <p className="text-gray-900 font-medium">{movement.description}</p>
                  </div>
                </div>
              </div>

              {/* Fundo */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Fundo</p>
                    <p className="text-gray-900 font-medium">{movement.fundName}</p>
                  </div>
                </div>
              </div>

              {/* Data */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Data da transação</p>
                    <p className="text-gray-900 font-medium">{movement.date}</p>
                  </div>
                </div>
              </div>

              {/* ID da transação */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">ID da transação</p>
                    <p className="text-gray-600 font-mono text-sm">{movement.id}</p>
                  </div>
                </div>
              </div>

              {/* Status da transação */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <p className="text-gray-900 font-medium">Concluída</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            <Button 
              variant="outline" 
              className="w-full h-12 font-medium rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
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

export default MovementDetailSheet;