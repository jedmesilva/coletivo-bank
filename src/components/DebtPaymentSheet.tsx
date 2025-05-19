import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Copy } from 'lucide-react';
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

  // Filter debts by selected fund if available
  const filteredDebts = selectedFundIdForDebtPayment 
    ? userDebts.filter(debt => debt.fundId === selectedFundIdForDebtPayment)
    : userDebts;

  const selectedDebt = userDebts.find(debt => debt.id === selectedDebtId);

  useEffect(() => {
    // If a specific debt is selected, move to payment step
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
      <SheetContent side="bottom" className="h-[100dvh] max-h-[100dvh] overflow-y-auto p-0 safe-area-pb">
        <div className="p-6">
          <SheetHeader className="mb-6">
            <div className="flex items-center">
              {step === 'payment' && (
                <Button variant="ghost" size="icon" onClick={() => {
                  setStep('select');
                  setSelectedDebtId(null);
                }} className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <SheetTitle className="text-2xl">Pagar Dívidas</SheetTitle>
                <SheetDescription>
                  {step === 'select' 
                    ? "Selecione a dívida que deseja pagar" 
                    : "Escolha um método de pagamento"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {step === 'select' && (
            <div className="space-y-6">
              {/* Debts list */}
              <div className="space-y-3">
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt) => (
                    <div 
                      key={debt.id}
                      className="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => handleDebtSelect(debt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{debt.description}</p>
                          <p className="text-sm text-gray-500">{debt.fundName}</p>
                          <p className="text-sm text-gray-500">Vencimento: {debt.dueDate}</p>
                        </div>
                        <p className="font-bold text-lg">{formatCurrency(debt.amount)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma dívida encontrada.
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'payment' && selectedDebt && (
            <div className="space-y-6">
              {/* Payment summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Total a pagar:</p>
                  <p className="font-bold">{formatCurrency(selectedDebt.amount)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Dívida:</p>
                  <p>{selectedDebt.description}</p>
                </div>
              </div>

              {/* Payment method tabs */}
              <Tabs defaultValue="pix" onValueChange={(value) => setPaymentMethod(value as 'pix' | 'boleto')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pix">PIX</TabsTrigger>
                  <TabsTrigger value="boleto">Boleto</TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="mt-4 space-y-4">
                  <div className="border rounded-lg p-6 text-center space-y-4">
                    <div className="bg-gray-100 mx-auto w-48 h-48 flex items-center justify-center mb-2">
                      {/* Mock QR Code */}
                      <div className="border border-gray-400 w-36 h-36 grid grid-cols-5 grid-rows-5">
                        {Array(25).fill(0).map((_, i) => (
                          <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Código PIX</p>
                      <div className="relative">
                        <div className="bg-gray-100 rounded-md p-2 text-xs break-all">
                          {mockPixCode}
                        </div>
                        <button 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
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

                  <p className="text-sm text-gray-500 text-center">
                    Escaneie o QR code ou copie o código acima para pagar pelo seu aplicativo de banco
                  </p>
                </TabsContent>

                <TabsContent value="boleto" className="mt-4 space-y-4">
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center p-4 bg-gray-100 rounded-md">
                      <CreditCard className="h-6 w-6 mr-3 text-gray-500" />
                      <div className="flex-1">
                        <p className="font-medium">Boleto Bancário</p>
                        <p className="text-sm text-gray-500">Vencimento em 3 dias úteis</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Código do boleto</p>
                      <div className="relative">
                        <div className="bg-gray-100 rounded-md p-2 text-xs break-all">
                          {mockBoletoCode}
                        </div>
                        <button 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
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

                    <Button className="w-full">
                      Baixar boleto em PDF
                    </Button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Você também pode copiar o código e pagar pelo internet banking
                  </p>
                </TabsContent>
              </Tabs>

              {/* Form actions */}
              <div className="sticky bottom-0 bg-white border-t p-4 mt-auto">
                <div className="flex flex-col space-y-3">
                  {step === 'select' ? (
                    <>
                      <Button 
                        onClick={handleCancel}
                        className="h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handlePaymentComplete}
                        className="h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Finalizar pagamento
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DebtPaymentSheet;