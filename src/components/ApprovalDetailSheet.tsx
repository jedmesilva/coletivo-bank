import React from 'react';
import { ArrowLeft, FileCheck, Calendar, FileText, Building2, User, DollarSign, Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ApprovalDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  approval: any;
}

const ApprovalDetailSheet: React.FC<ApprovalDetailSheetProps> = ({
  isOpen,
  onClose,
  approval
}) => {
  const { hideValues } = useApp();

  if (!approval) return null;

  const getStatusInfo = () => {
    switch (approval.status) {
      case 'pending':
        return {
          label: 'Aguardando aprovação',
          color: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: <FileCheck className="h-6 w-6 text-yellow-500" />
        };
      case 'approved':
        return {
          label: 'Aprovado',
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: <Check className="h-6 w-6 text-green-500" />
        };
      case 'rejected':
        return {
          label: 'Rejeitado',
          color: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <X className="h-6 w-6 text-red-500" />
        };
      default:
        return {
          label: 'Pendente',
          color: 'bg-gray-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: <FileCheck className="h-6 w-6 text-gray-500" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleApprove = () => {
    // Implementar lógica de aprovação
    console.log('Aprovando solicitação:', approval.id);
  };

  const handleReject = () => {
    // Implementar lógica de rejeição
    console.log('Rejeitando solicitação:', approval.id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="approval-detail-description"
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
                  Detalhes da solicitação
                </SheetTitle>
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                Informações completas sobre esta solicitação
              </SheetDescription>
            </div>
          </header>

          <div className="p-4 pb-60">
            {/* Ícone e valor principal */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 ${statusInfo.bgColor} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                {statusInfo.icon}
              </div>
              {approval.value && (
                <p className={`text-4xl font-bold ${statusInfo.textColor} mb-2`}>
                  {formatCurrency(approval.value, hideValues)}
                </p>
              )}
              <p className="text-lg text-gray-600 font-medium">
                Solicitação de capital
              </p>
            </div>

            {/* Status da solicitação */}
            <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-xl p-4 mb-6`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${statusInfo.color} rounded-full`}></div>
                <div>
                  <p className={`font-semibold ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </p>
                  <p className={`text-sm ${statusInfo.textColor}`}>
                    {approval.status === 'pending' 
                      ? 'Esta solicitação está aguardando análise dos administradores'
                      : approval.status === 'approved'
                      ? 'Esta solicitação foi aprovada pelos administradores'
                      : 'Esta solicitação foi rejeitada pelos administradores'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Informações detalhadas */}
            <div className="space-y-4">
              {/* Descrição */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Descrição</p>
                    <p className="text-gray-900 font-medium">{approval.description}</p>
                  </div>
                </div>
              </div>

              {/* Fundo */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Fundo</p>
                    <p className="text-gray-900 font-medium">{approval.fundName}</p>
                  </div>
                </div>
              </div>

              {/* Data da solicitação */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Data da solicitação</p>
                    <p className="text-gray-900 font-medium">{approval.date}</p>
                  </div>
                </div>
              </div>

              {/* Valor solicitado */}
              {approval.value && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Valor solicitado</p>
                      <p className="text-gray-900 font-semibold text-lg">{formatCurrency(approval.value, hideValues)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Solicitante */}
              {approval.requesterId && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Solicitante</p>
                      <p className="text-gray-900 font-medium">ID: {approval.requesterId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ID da solicitação */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">ID da solicitação</p>
                    <p className="text-gray-600 font-mono text-sm">{approval.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {approval.status === 'pending' ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button 
                    onClick={handleApprove}
                    className="flex-1 h-12 text-base font-medium bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Aprovar
                  </Button>
                  <Button 
                    onClick={handleReject}
                    className="flex-1 h-12 text-base font-medium bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Rejeitar
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  onClick={onClose}
                >
                  Fechar
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-12 font-medium rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
                onClick={onClose}
              >
                Fechar
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApprovalDetailSheet;