
import React, { useState } from 'react';
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
    payFundDebt
  } = useApp();
  const { toast } = useToast();
  const [selectedDebts, setSelectedDebts] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto'>('pix');
  const [isCopied, setIsCopied] = useState(false);

  // Filter debts by selected fund if available
  const filteredDebts = selectedFundIdForDebtPayment 
    ? userDebts.filter(debt => debt.fundId === selectedFundIdForDebtPayment)
    : userDebts;

  const totalAmount = filteredDebts
    .filter(debt => selectedDebts.includes(debt.id))
    .reduce((sum, debt) => sum + debt.amount, 0);

  const handleToggleDebt = (debtId: string) => {
    if (selectedDebts.includes(debtId)) {
      setSelectedDebts(selectedDebts.filter(id => id !== debtId));
    } else {
      setSelectedDebts([...selectedDebts, debtId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDebts.length === filteredDebts.length) {
      setSelectedDebts([]);
    } else {
      setSelectedDebts(filteredDebts.map(debt => debt.id));
    }
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleCancel = () => {
    setIsDebtPaymentOpen(false);
    setSelectedFundIdForDebtPayment(null);
    setSelectedDebts([]);
    setStep('select');
    setPaymentMethod('pix');
  };

  const handlePaymentComplete = () => {
    // Process payment for selected debts
    selectedDebts.forEach(debtId => {
      const debt = userDebts.find(d => d.id === debtId);
      if (debt) {
        payFundDebt(debt.fundId, debt.id, debt.amount);
      }
    });

    toast({
      title: "Pagamento realizado",
      description: `${selectedDebts.length} dívida(s) pagas com sucesso.`,
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
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Pagar Dívidas</SheetTitle>
            <SheetDescription>
              {step === 'select' 
                ? "Selecione as dívidas que deseja pagar" 
                : "Escolha um método de pagamento"}
            </SheetDescription>
          </SheetHeader>

          {step === 'select' && (
            <div className="space-y-6">
              {/* Select/Deselect all button */}
              {filteredDebts.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedDebts.length === filteredDebts.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </Button>
                </div>
              )}

              {/* Debts list */}
              <div className="space-y-3">
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt) => (
                    <div 
                      key={debt.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedDebts.includes(debt.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleToggleDebt(debt.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{debt.description}</p>
                          <p className="text-sm text-gray-500">{debt.fundName}</p>
                          <p className="text-sm text-gray-500">Vencimento: {debt.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(debt.amount)}</p>
                          <div className="h-5 w-5 rounded-full border mt-1 flex items-center justify-center ml-auto">
                            {selectedDebts.includes(debt.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma dívida encontrada.
                  </div>
                )}
              </div>

              {/* Summary and actions */}
              {filteredDebts.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-gray-500">Total selecionado:</p>
                      <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Dívidas selecionadas:</p>
                      <p className="text-xl font-bold">{selectedDebts.length}/{filteredDebts.length}</p>
                    </div>
                  </div>
                
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={selectedDebts.length === 0}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Total a pagar:</p>
                  <p className="font-bold">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-500">Dívidas:</p>
                  <p>{selectedDebts.length} selecionadas</p>
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

              {/* Demo action - in a real app this would verify payment */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Para fins de demonstração, clique abaixo para simular o pagamento
                </p>
                <Button onClick={handlePaymentComplete}>
                  Finalizar pagamento
                </Button>
              </div>
              
              <div className="flex justify-center pt-2">
                <Button 
                  variant="link" 
                  onClick={() => setStep('select')}
                >
                  Voltar para seleção
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DebtPaymentSheet;
