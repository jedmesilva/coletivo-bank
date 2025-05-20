import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Copy, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
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
      <SheetContent side="bottom">
        <div>
            <div>
              <div>
                {step === 'payment' && (
                  <Button variant="ghost" size="icon" onClick={() => {
                    setStep('select');
                    setSelectedDebtId(null);
                  }}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div className="text-left">
                  <SheetTitle className="text-xl">Pagar Dívidas</SheetTitle>
                  <SheetDescription>
                    {step === 'select' 
                      ? "Selecione a dívida que deseja pagar" 
                      : "Escolha um método de pagamento"}
                  </SheetDescription>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
            {step === 'select' && (
              <div>
                <div>
                  {filteredDebts.length > 0 ? (
                    filteredDebts.map((debt) => (
                      <div 
                        key={debt.id}
                        onClick={() => handleDebtSelect(debt.id)}
                      >
                        <div>
                          <div>
                            <p>{debt.description}</p>
                            <p>{debt.fundName}</p>
                            <p>Vencimento: {debt.dueDate}</p>
                          </div>
                          <p>{formatCurrency(debt.amount)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      Nenhuma dívida encontrada.
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'payment' && selectedDebt && (
              <div>
                <div>
                  <div>
                    <p>Total a pagar:</p>
                    <p>{formatCurrency(selectedDebt.amount)}</p>
                  </div>
                  <div>
                    <p>Dívida:</p>
                    <p>{selectedDebt.description}</p>
                  </div>
                </div>

                <Tabs defaultValue="pix" onValueChange={(value) => setPaymentMethod(value as 'pix' | 'boleto')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pix">PIX</TabsTrigger>
                    <TabsTrigger value="boleto">Boleto</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pix">
                    <div>
                      <div>
                        <div>
                          {Array(25).fill(0).map((_, i) => (
                            <div key={i} ></div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p>Código PIX</p>
                        <div className="relative">
                          <div>
                            {mockPixCode}
                          </div>
                          <button 
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

                    <p>
                      Escaneie o QR code ou copie o código acima para pagar pelo seu aplicativo de banco
                    </p>
                  </TabsContent>

                  <TabsContent value="boleto">
                    <div>
                      <div>
                        <CreditCard className="h-6 w-6 mr-3 text-gray-500" />
                        <div>
                          <p>Boleto Bancário</p>
                          <p>Vencimento em 3 dias úteis</p>
                        </div>
                      </div>

                      <div>
                        <p>Código do boleto</p>
                        <div className="relative">
                          <div>
                            {mockBoletoCode}
                          </div>
                          <button 
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

                      <Button>
                        Baixar boleto em PDF
                      </Button>
                    </div>

                    <p>
                      Você também pode copiar o código e pagar pelo internet banking
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Footer with actions - fixo */}
          <div>
            <div>
              {step === 'payment' && (
                <Button 
                  onClick={handlePaymentComplete}
                >
                  Finalizar pagamento
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DebtPaymentSheet;