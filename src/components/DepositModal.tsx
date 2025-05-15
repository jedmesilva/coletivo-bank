
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
      <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center">
              {step === 'deposit-details' && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl">
                {step === 'select-fund' ? 'Escolha um fundo' : 'Aportar capital'}
              </SheetTitle>
            </div>
          </SheetHeader>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {step === 'select-fund' ? (
              <div className="space-y-3">
                {funds.map((fund) => (
                  <div
                    key={fund.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectFund(fund.id)}
                  >
                    <img 
                      src={fund.image} 
                      alt={fund.name} 
                      className="w-12 h-12 rounded-lg object-cover mr-3" 
                    />
                    <div>
                      <p className="font-medium">{fund.name}</p>
                      <p className="text-sm text-gray-600">{fund.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Fundo selecionado</p>
                  <p className="font-medium">{selectedFundName}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="deposit-amount">Valor do aporte</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <Input 
                      id="deposit-amount"
                      className="pl-8" 
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
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="deposit-description">Descrição</label>
                  <Input 
                    id="deposit-description"
                    placeholder="Ex: Aporte mensal" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t p-4">
            {step === 'select-fund' ? (
              <Button variant="outline" className="w-full" onClick={handleClose}>
                Cancelar
              </Button>
            ) : (
              <Button onClick={handleDeposit} className="w-full">
                Concluir aporte
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DepositModal;
