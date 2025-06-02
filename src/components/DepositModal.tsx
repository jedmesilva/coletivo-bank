import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';

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
        className="p-0 h-[100dvh] overflow-hidden flex flex-col max-w-full"
        aria-describedby="deposit-modal-description"
      >
        {/* Scrollable Content with Header included */}
        <div className="flex-0 overflow-y-auto pb-0">
          {/* Header com gradiente seguindo o padrão do app */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step === 'deposit-details' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl text-white font-semibold">
                {step === 'select-fund' ? 'Escolha um fundo' : 'Aportar capital'}
              </SheetTitle>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                {step === 'select-fund' 
                  ? "Selecione o fundo para realizar o aporte" 
                  : "Defina o valor e a descrição do aporte"}
              </SheetDescription>
            </div>
          </header>

          {/* Main Content - Com espaçamento consistente */}
          <div className="p-4">
            {step === 'select-fund' ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {funds.map((fund) => (
                    <div
                      key={fund.id}
                      className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer 
                              hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                      onClick={() => handleSelectFund(fund.id)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <img 
                          src={fund.image} 
                          alt={fund.name} 
                          className="w-14 h-14 rounded-xl object-cover shadow-sm ring-1 ring-gray-200" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{fund.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{fund.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{fund.members.length} membros</span>
                            <span className="mx-2">•</span>
                            <span>Desde {fund.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">Fundo selecionado</p>
                  <div className="flex items-center">
                    <p className="font-bold text-primary text-lg truncate">{selectedFundName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 flex items-center" htmlFor="deposit-amount">
                    Valor do aporte
                    <span className="text-xs text-gray-500 ml-1.5 font-normal">(obrigatório)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <Input 
                      id="deposit-amount"
                      className="pl-8 text-lg font-semibold rounded-xl border-gray-200 focus:border-primary" 
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
                  <p className="text-xs text-gray-500">Insira o valor que deseja depositar no fundo</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 flex items-center" htmlFor="deposit-description">
                    Descrição
                    <span className="text-xs text-gray-500 ml-1.5 font-normal">(obrigatório)</span>
                  </label>
                  <Input 
                    id="deposit-description"
                    className="bg-white rounded-xl border-gray-200 focus:border-primary" 
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

        {/* Footer - fixed - Com espaçamento consistente com o cabeçalho */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {step === 'select-fund' ? (
              <Button 
                variant="outline" 
                className="w-full h-12 font-medium rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handleDeposit} 
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Concluir aporte
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
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