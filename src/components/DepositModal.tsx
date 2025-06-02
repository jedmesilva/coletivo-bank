import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronRight, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';

type DepositStep = 'select-fund' | 'amount' | 'description';

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
  const [pixCode, setPixCode] = useState<string>('');
  const [showPixCode, setShowPixCode] = useState<boolean>(false);

  const stepTitles = {
    'select-fund': 'Escolha um fundo',
    'amount': 'Valor do aporte',
    'description': 'Finalizar aporte'
  };

  const stepDescriptions = {
    'select-fund': 'Selecione o fundo para realizar o aporte',
    'amount': 'Informe o valor que deseja aportar',
    'description': 'Adicione uma descrição e gere o código PIX'
  };

  useEffect(() => {
    if (selectedFundIdForDeposit) {
      setSelectedFund(selectedFundIdForDeposit);
      setStep('amount');
    } else {
      setStep('select-fund');
      setSelectedFund(null);
    }
  }, [selectedFundIdForDeposit, isDepositModalOpen]);

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setStep('select-fund');
    setSelectedFund(null);
    setAmount('');
    setDescription('');
    setPixCode('');
    setShowPixCode(false);
  };

  const handleSelectFund = (fundId: string) => {
    setSelectedFund(fundId);
    setStep('amount');
  };

  const handleNextStep = () => {
    if (step === 'amount') {
      const amountValue = parseFloat(amount.replace(',', '.'));
      
      if (isNaN(amountValue) || amountValue <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido para o aporte.",
          variant: "destructive"
        });
        return;
      }
      
      setStep('description');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'amount') {
      setStep('select-fund');
    } else if (step === 'description') {
      setStep('amount');
    }
  };

  const generatePixCode = () => {
    if (!selectedFund || !amount) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    const selectedFundData = funds.find(f => f.id === selectedFund);
    
    // Gerar código PIX simulado (em produção, isso viria de uma API de pagamento)
    const pixKey = "aporte@fundos.com.br";
    const merchantName = "FUNDOS APP";
    const merchantCity = "SAO PAULO";
    const txId = Math.random().toString(36).substring(2, 15).toUpperCase();
    
    // Código PIX simplificado para demonstração
    const pixPayload = `00020101021226580014BR.GOV.BCB.PIX0136${pixKey}5204000053039865802BR5913${merchantName}6009${merchantCity}62070503***630${txId.substring(0, 4)}`;
    
    setPixCode(pixPayload);
    setShowPixCode(true);

    toast({
      title: "Código PIX gerado!",
      description: "Use o código abaixo para realizar o pagamento."
    });
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência."
      });
    });
  };

  const confirmPayment = () => {
    if (!selectedFund) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    const finalDescription = description.trim() || 'Aporte via PIX';

    depositToFund(selectedFund, amountValue, finalDescription);

    toast({
      title: "Aporte registrado!",
      description: `Após a confirmação do PIX, o valor será creditado no fundo.`
    });

    handleClose();
  };

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numericValue)) return 'R$ 0,00';
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const selectedFundData = selectedFund ? funds.find(f => f.id === selectedFund) : null;

  const getStepNumber = () => {
    const steps = ['select-fund', 'amount', 'description'];
    return steps.indexOf(step) + 1;
  };

  return (
    <Sheet open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
      <SheetContent 
        side="bottom"
        className="p-0 h-[100dvh] overflow-hidden flex flex-col max-w-full"
        aria-describedby="deposit-modal-description"
      >
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step !== 'select-fund' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                  onClick={handlePreviousStep}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex-1">
                <SheetTitle className="text-xl text-white font-semibold">
                  {stepTitles[step]}
                </SheetTitle>
                <div className="flex items-center mt-1">
                  <span className="text-white/70 text-sm">Etapa {getStepNumber()} de 3</span>
                </div>
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                {stepDescriptions[step]}
              </SheetDescription>
            </div>
            
            {/* Indicador de progresso */}
            <div className="px-4 mt-4">
              <div className="flex space-x-1">
                {['select-fund', 'amount', 'description'].map((stepName, index) => (
                  <div 
                    key={stepName}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      ['select-fund', 'amount', 'description'].indexOf(step) >= index 
                        ? 'bg-white' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </header>

          <div className="p-4">
            {step === 'select-fund' && (
              <div className="space-y-4">
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
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            {step === 'amount' && (
              <div className="space-y-8">
                {selectedFundData && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-2">Fundo selecionado</p>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={selectedFundData.image} 
                        alt={selectedFundData.name} 
                        className="w-10 h-10 rounded-lg object-cover" 
                      />
                      <p className="font-bold text-primary text-lg">{selectedFundData.name}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-4">
                      Quanto você quer aportar?
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl font-semibold">R$</span>
                      <Input 
                        className="text-center text-4xl font-bold h-20 border-2 rounded-2xl border-gray-200 focus:border-primary pl-16 pr-6" 
                        placeholder="0,00" 
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d,]/g, '');
                          const commaCount = (value.match(/,/g) || []).length;
                          if (commaCount <= 1) {
                            setAmount(value);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    {amount && (
                      <p className="text-lg text-gray-600 mt-4 font-medium">
                        {formatCurrency(amount)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {['50', '100', '200', '500', '1000', '2000'].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        className="h-12 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5"
                        onClick={() => setAmount(value)}
                      >
                        R$ {value}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'description' && (
              <div className="space-y-6">
                {selectedFundData && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Resumo do aporte</p>
                        <p className="font-bold text-primary text-lg">{selectedFundData.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Valor</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(amount)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-2">
                      Descrição (opcional)
                    </label>
                    <Textarea 
                      placeholder="Ex: Aporte mensal, contribuição para equipamentos, etc."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-primary min-h-[100px] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Adicione uma descrição para identificar este aporte (opcional)
                    </p>
                  </div>

                  {!showPixCode ? (
                    <div className="text-center py-6">
                      <Button
                        onClick={generatePixCode}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <QrCode className="mr-3 h-6 w-6" />
                        Gerar código PIX
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-green-800">Código PIX gerado</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyPixCode}
                            className="text-green-700 border-green-300 hover:bg-green-100"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-xs font-mono break-all text-gray-700">
                          {pixCode}
                        </div>
                        <p className="text-xs text-green-700 mt-2">
                          Use este código no seu app de banco para fazer o PIX
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Como proceder:</h4>
                        <ol className="text-sm text-blue-700 space-y-1">
                          <li>1. Copie o código PIX acima</li>
                          <li>2. Abra seu app de banco</li>
                          <li>3. Escolha a opção PIX Copia e Cola</li>
                          <li>4. Cole o código e confirme o pagamento</li>
                          <li>5. Clique em "Confirmar pagamento" abaixo após realizar o PIX</li>
                        </ol>
                      </div>

                      <Button
                        onClick={confirmPayment}
                        className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Confirmar pagamento
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
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
            ) : step === 'amount' ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleNextStep}
                  disabled={!amount || parseFloat(amount.replace(',', '.')) <= 0}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <span>Continuar</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200" 
                onClick={handleClose}
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

export default DepositModal;