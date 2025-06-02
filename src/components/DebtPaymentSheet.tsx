
import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Copy, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const DebtPaymentSheet = () => {
  const { 
    isDebtPaymentOpen, 
    setIsDebtPaymentOpen, 
    userDebts,
    selectedFundIdForDebtPayment,
    setSelectedFundIdForDebtPayment,
    selectedDebtId,
    setSelectedDebtId,
    payFundDebt
  } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto'>('pix');
  const [isCopied, setIsCopied] = useState(false);

  const filteredDebts = selectedFundIdForDebtPayment 
    ? userDebts.filter(debt => debt.fundId === selectedFundIdForDebtPayment)
    : userDebts;

  const selectedDebt = userDebts.find(debt => debt.id === selectedDebtId);

  useEffect(() => {
    if (selectedDebtId) {
      setStep('payment');
    } else {
      setStep('select');
    }
  }, [selectedDebtId, isDebtPaymentOpen]);

  const handleDebtSelect = (debtId: string) => {
    setSelectedDebtId(debtId);
    setStep('payment');
  };

  const handleCancel = () => {
    setIsDebtPaymentOpen(false);
    setSelectedFundIdForDebtPayment(null);
    setSelectedDebtId(null);
    setStep('select');
    setPaymentMethod('pix');
  };

  const handlePaymentComplete = () => {
    if (!selectedDebt) return;

    payFundDebt(selectedDebt.fundId, selectedDebt.id, selectedDebt.amount);

    toast({
      title: "Pagamento realizado",
      description: "Dívida paga com sucesso.",
    });

    handleCancel();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PXGJ28S7DSA89DSAJD8ASJ98DJSA89DJSA8D9JSAD89JSAD98JSAD");
    setIsCopied(true);
    toast({
      description: "Código copiado para a área de transferência!"
    });

    setTimeout(() => setIsCopied(false), 3000);
  };

  const mockPixCode = "PXGJ28S7DSA89DSAJD8ASJ98DJSA89DJSA8D9JSAD89JSAD98JSAD";
  const mockBoletoCode = "23793.38128 60007.827136 95000.063305 9 91000000029500";

  return (
    <Sheet open={isDebtPaymentOpen} onOpenChange={setIsDebtPaymentOpen}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="debt-payment-description"
      >
        {/* Scrollable Content with Header included */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Header com gradiente seguindo o padrão do app */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step === 'payment' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                  onClick={() => {
                    setStep('select');
                    setSelectedDebtId(null);
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl text-white font-semibold">
                {step === 'select' ? 'Pagar dívidas' : 'Escolha o método'}
              </SheetTitle>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                {step === 'select' 
                  ? "Selecione a dívida que deseja pagar" 
                  : "Escolha um método de pagamento"}
              </SheetDescription>
            </div>
          </header>

          {/* Main Content - Com espaçamento consistente */}
          <div className="p-4 pb-48">
            {step === 'select' ? (
              <div className="space-y-4">
                {filteredDebts.length > 0 ? (
                  <div className="space-y-3">
                    {filteredDebts.map((debt) => (
                      <div 
                        key={debt.id}
                        className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer 
                                hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                        onClick={() => handleDebtSelect(debt.id)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{debt.description}</p>
                          <p className="text-sm text-gray-600">{debt.fundName}</p>
                          <p className="text-sm text-gray-500">Vencimento: {debt.dueDate}</p>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                          <p className="font-bold text-lg text-primary">{formatCurrency(debt.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma dívida encontrada.</p>
                  </div>
                )}
              </div>
            ) : (
              selectedDebt && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">Resumo do pagamento</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Total a pagar:</p>
                        <p className="font-bold text-lg text-primary">{formatCurrency(selectedDebt.amount)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Dívida:</p>
                        <p className="font-medium text-gray-900">{selectedDebt.description}</p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="pix" onValueChange={(value) => setPaymentMethod(value as 'pix' | 'boleto')}>
                    <TabsList className="grid w-full grid-cols-2 rounded-xl">
                      <TabsTrigger value="pix" className="rounded-lg">PIX</TabsTrigger>
                      <TabsTrigger value="boleto" className="rounded-lg">Boleto</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pix" className="mt-4 space-y-4">
                      <div className="border border-gray-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
                        <div className="bg-gray-100 mx-auto w-48 h-48 flex items-center justify-center mb-2 rounded-xl">
                          <div className="border border-gray-400 w-36 h-36 grid grid-cols-5 grid-rows-5 rounded-lg overflow-hidden">
                            {Array(25).fill(0).map((_, i) => (
                              <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-900">Código PIX</p>
                          <div className="relative">
                            <div className="bg-gray-100 rounded-xl p-3 text-xs break-all font-mono border border-gray-200">
                              {mockPixCode}
                            </div>
                            <button 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/80 rounded-md transition-colors"
                              onClick={handleCopyCode}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-800">
                        <p className="text-sm leading-relaxed text-center">
                          Escaneie o QR code ou copie o código acima para pagar pelo seu aplicativo de banco
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="boleto" className="mt-4 space-y-4">
                      <div className="border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <CreditCard className="h-6 w-6 mr-3 text-gray-500" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Boleto Bancário</p>
                            <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-900">Código do boleto</p>
                          <div className="relative">
                            <div className="bg-gray-100 rounded-xl p-3 text-xs break-all font-mono border border-gray-200">
                              {mockBoletoCode}
                            </div>
                            <button 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/80 rounded-md transition-colors"
                              onClick={handleCopyCode}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                          Baixar boleto em PDF
                        </Button>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-800">
                        <p className="text-sm leading-relaxed text-center">
                          Você também pode copiar o código e pagar pelo internet banking
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer - fixed - Com espaçamento consistente com o cabeçalho */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {step === 'select' ? (
              <Button 
                variant="outline" 
                className="w-full h-12 font-medium rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handlePaymentComplete}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Finalizar pagamento
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DebtPaymentSheet;
