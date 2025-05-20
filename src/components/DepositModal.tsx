
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type DepositStep = 'select-fund' | 'deposit-details';

const DepositModal: React.FC = () => {
  const { 
    isDepositModalOpen, 
    setIsDepositModalOpen, 
    funds, 
    depositToFund, 
    selectedFundIdForDeposit 
  } = useApp();

  const [step, setStep] = useState<DepositStep>('select-fund');
  const [selectedFund, setSelectedFund] = useState<string | null>(selectedFundIdForDeposit);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (selectedFundIdForDeposit) {
      setSelectedFund(selectedFundIdForDeposit);
      setStep('deposit-details');
    } else {
      setStep('select-fund');
      setSelectedFund(null);
    }
  }, [selectedFundIdForDeposit, isDepositModalOpen]);

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setAmount('');
    setDescription('');
  };

  const handleSelectFund = (fundId: string) => {
    setSelectedFund(fundId);
    setStep('deposit-details');
  };

  const handleDeposit = () => {
    if (!selectedFund) {
      toast({
        title: "Erro",
        description: "Selecione um fundo para fazer o aporte.",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount.replace(',', '.'));

    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para o aporte.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, insira uma descrição para o aporte.",
        variant: "destructive"
      });
      return;
    }

    depositToFund(selectedFund, amountValue, description);

    toast({
      title: "Aporte realizado com sucesso!",
      description: `Valor de R$ ${amountValue.toLocaleString('pt-BR')} depositado.`
    });

    handleClose();
  };

  const handleBack = () => {
    setStep('select-fund');
  };

  // Get selected fund name for display
  const selectedFundName = selectedFund 
    ? funds.find(f => f.id === selectedFund)?.name 
    : '';

  return (
    <Sheet open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
      <SheetContent 
        side="bottom"
        className="p-0 h-[100dvh] overflow-hidden flex flex-col"
        aria-describedby="deposit-modal-description"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                {step === 'deposit-details' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-xl font-semibold">
                  {step === 'select-fund' ? 'Escolha um fundo' : 'Aportar capital'}
                </h2>
              </div>
            </div>

            <div className="px-4 py-4">
              {step === 'select-fund' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-2">Selecione um fundo para realizar o aporte:</p>
                  
                  <div className="space-y-3">
                    {funds.map((fund) => (
                      <div
                        key={fund.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer 
                                hover:border-primary/30 hover:bg-primary/5 transition-all"
                        onClick={() => handleSelectFund(fund.id)}
                      >
                        <div className="flex-shrink-0 mr-3">
                          <img 
                            src={fund.image} 
                            alt={fund.name} 
                            className="w-12 h-12 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{fund.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{fund.description}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{fund.members.length} membros</span>
                            <span className="mx-2">•</span>
                            <span>Desde {fund.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">Fundo selecionado</p>
                    <div className="flex items-center">
                      <p className="font-bold text-primary text-lg truncate">{selectedFundName}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center" htmlFor="deposit-amount">
                      Valor do aporte
                      <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R$</span>
                      <Input 
                        id="deposit-amount"
                        className="pl-8 text-lg font-semibold" 
                        placeholder="0,00" 
                        type="number"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d,]/g, '');
                          const commaCount = (value.match(/,/g) || []).length;
                          if (commaCount <= 1) {
                            setAmount(value);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Insira o valor que deseja depositar no fundo</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center" htmlFor="deposit-description">
                      Descrição
                      <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                    </label>
                    <Input 
                      id="deposit-description"
                      className="bg-white" 
                      placeholder="Ex: Aporte mensal" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Identifique o propósito deste aporte</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t py-4 px-4 bg-white w-full fixed bottom-0 left-0 right-0">
            {step === 'select-fund' ? (
              <Button 
                variant="outline" 
                className="w-full h-11 font-medium" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={handleDeposit} 
                  className="w-full h-12 text-base font-medium"
                >
                  Concluir aporte
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-11" 
                  onClick={handleClose}
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

export default DepositModal;
