import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronRight, Copy, QrCode, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';

type DepositStep = 'select-fund' | 'amount' | 'payment-method' | 'description';

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
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'balance' | null>(null);
  const [description, setDescription] = useState<string>('');
  const [pixCode, setPixCode] = useState<string>('');
  const [showPixCode, setShowPixCode] = useState<boolean>(false);

  const stepTitles = {
    'select-fund': 'Escolha um fundo',
    'amount': 'Valor do aporte',
    'payment-method': 'Forma de pagamento',
    'description': 'Finalizar aporte'
  };

  const stepDescriptions = {
    'select-fund': 'Selecione o fundo para realizar o aporte',
    'amount': 'Informe o valor que deseja aportar',
    'payment-method': 'Escolha como deseja realizar o aporte',
    'description': 'Adicione uma descrição e confirme o aporte'
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
    setPaymentMethod(null);
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
      
      setStep('payment-method');
    } else if (step === 'payment-method') {
      if (!paymentMethod) {
        toast({
          title: "Forma de pagamento não selecionada",
          description: "Por favor, escolha como deseja realizar o aporte.",
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
    } else if (step === 'payment-method') {
      setStep('amount');
    } else if (step === 'description') {
      setStep('payment-method');
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
    if (!selectedFund || !paymentMethod) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    const paymentMethodText = paymentMethod === 'pix' ? 'PIX' : 'saldo livre';
    const finalDescription = description.trim() || `Aporte via ${paymentMethodText}`;

    depositToFund(selectedFund, amountValue, finalDescription);

    const toastMessage = paymentMethod === 'balance' 
      ? 'O valor foi debitado do seu saldo e creditado no fundo instantaneamente.'
      : 'Após a confirmação do PIX, o valor será creditado no fundo.';

    toast({
      title: "Aporte registrado!",
      description: toastMessage
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
    const steps = ['select-fund', 'amount', 'payment-method', 'description'];
    return steps.indexOf(step) + 1;
  };

  return (
    <Sheet open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
      <SheetContent 
        side="bottom"
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="deposit-modal-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
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
                  <span className="text-white/70 text-sm">Etapa {getStepNumber()} de 4</span>
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
                {['select-fund', 'amount', 'payment-method', 'description'].map((stepName, index) => (
                  <div 
                    key={stepName}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      ['select-fund', 'amount', 'payment-method', 'description'].indexOf(step) >= index 
                        ? 'bg-white' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </header>

          <div className="p-4 pb-60">
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

            {step === 'payment-method' && (
              <div className="space-y-6">
                {selectedFundData && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">Fundo selecionado</p>
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
                    <label className="text-sm font-semibold text-gray-900 block mb-4">
                      Como você quer realizar o aporte?
                    </label>
                    
                    <div className="space-y-3">
                      {/* Opção PIX */}
                      <div 
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          paymentMethod === 'pix' 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        onClick={() => setPaymentMethod('pix')}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            paymentMethod === 'pix' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <QrCode className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Gerar código PIX</h3>
                            <p className="text-sm text-gray-600">
                              Transfira direto do seu banco usando PIX
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            paymentMethod === 'pix' 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'pix' && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Opção Saldo Livre */}
                      <div 
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          paymentMethod === 'balance' 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        onClick={() => setPaymentMethod('balance')}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            paymentMethod === 'balance' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Wallet className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Usar saldo livre</h3>
                            <p className="text-sm text-gray-600">
                              Use o saldo disponível da sua conta
                            </p>
                            <p className="text-xs text-green-600 font-medium mt-1">
                              Saldo disponível: R$ 1.250,00
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            paymentMethod === 'balance' 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === 'balance' && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'balance' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Informações importantes:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• O valor será debitado instantaneamente do seu saldo</li>
                        <li>• Não há taxas para aportes usando saldo livre</li>
                        <li>• O aporte será creditado imediatamente no fundo</li>
                      </ul>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-medium text-green-800 mb-2">Próximos passos:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Iremos gerar um código PIX para você</li>
                        <li>• Use o código no seu app de banco</li>
                        <li>• O aporte será creditado após confirmação do pagamento</li>
                      </ul>
                    </div>
                  )}
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



                  {paymentMethod === 'pix' && showPixCode && (
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
            ) : step === 'payment-method' ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleNextStep}
                  disabled={!paymentMethod}
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
            ) : step === 'description' ? (
              <div className="space-y-3">
                {paymentMethod === 'balance' ? (
                  <Button
                    onClick={confirmPayment}
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Wallet className="mr-3 h-5 w-5" />
                    Confirmar aporte com saldo
                  </Button>
                ) : paymentMethod === 'pix' && !showPixCode ? (
                  <Button
                    onClick={generatePixCode}
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <QrCode className="mr-3 h-5 w-5" />
                    Gerar código PIX
                  </Button>
                ) : paymentMethod === 'pix' && showPixCode ? (
                  <Button
                    onClick={confirmPayment}
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Confirmar pagamento
                  </Button>
                ) : null}
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