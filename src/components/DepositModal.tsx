
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
        className="h-[100dvh] max-h-[100dvh] p-0 safe-area-pb"
        aria-describedby="deposit-modal-description"
      >
        <div id="deposit-modal-description" className="sr-only">
          Modal para realizar aportes em fundos coletivos
        </div>
        {/* Single scrollable container */}
        <div className="h-full overflow-y-auto">
          {/* Header - agora rola junto com o conteúdo */}
          <div className="p-6 border-b bg-white safe-area-pt">
            <div className="flex items-center">
              {step === 'deposit-details' && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2 -ml-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl">
                {step === 'select-fund' ? 'Escolha um fundo' : 'Aportar capital'}
              </SheetTitle>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-5">
            {step === 'select-fund' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">Selecione um fundo para realizar o aporte:</p>
                {funds.map((fund) => (
                  <div
                    key={fund.id}
                    className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer 
                              hover:border-primary/30 hover:bg-primary/5 transition-all"
                    onClick={() => handleSelectFund(fund.id)}
                  >
                    <div className="relative mr-3">
                      <img 
                        src={fund.image} 
                        alt={fund.name} 
                        className="w-14 h-14 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{fund.name}</p>
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
            ) : (
              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                  <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">Fundo selecionado</p>
                  <div className="flex items-center">
                    <p className="font-bold text-primary text-lg">{selectedFundName}</p>
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
                        // Allow only numbers and one comma
                        const value = e.target.value.replace(/[^\d,]/g, '');
                        // Ensure only one comma
                        const commaCount = (value.match(/,/g) || []).length;
                        if (commaCount <= 1) {
                          setAmount(value);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Insira o valor que deseja depositar no fundo</p>
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
                  <p className="text-xs text-gray-500 mt-1">Identifique o propósito deste aporte</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer - fixo */}
          <div className="border-t bg-white p-6 sticky bottom-0">
            {step === 'select-fund' ? (
              <Button 
                variant="outline" 
                className="w-full font-medium hover:bg-gray-100" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handleDeposit} 
                  className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Concluir aporte
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
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
