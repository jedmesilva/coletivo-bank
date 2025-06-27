import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Calculator, CheckCircle, Calendar, Plus, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

type CapitalRequestStep = 'amount' | 'payment-terms' | 'purpose' | 'summary';

interface PaymentOption {
  id: string;
  label: string;
  installments: number;
  period: string;
  interestRate: number;
}

interface CustomPayment {
  id: string;
  amount: string;
  date: string;
}

const CapitalRequestSheet = () => {
  const { 
    isCapitalRequestOpen, 
    setIsCapitalRequestOpen, 
    selectedFundIdForCapitalRequest, 
    setSelectedFundIdForCapitalRequest,
    funds,
    requestCapitalFromFund,
  } = useApp();

  const [step, setStep] = useState<CapitalRequestStep>('amount');
  const [amount, setAmount] = useState<string>('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [isCustomSchedule, setIsCustomSchedule] = useState<boolean>(false);
  const [customPayments, setCustomPayments] = useState<CustomPayment[]>([]);
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>('');
  const [newPaymentDate, setNewPaymentDate] = useState<string>('');

  const stepTitles = {
    'amount': 'Valor solicitado',
    'payment-terms': 'Prazo de pagamento',
    'purpose': 'Objetivo do capital',
    'summary': 'Confirmar solicitação'
  };

  const stepDescriptions = {
    'amount': 'Informe quanto você precisa solicitar',
    'payment-terms': 'Escolha como pretende pagar de volta',
    'purpose': 'Explique para que precisa do capital',
    'summary': 'Revise todos os detalhes antes de enviar'
  };

  const selectedFund = funds.find(f => f.id === selectedFundIdForCapitalRequest);

  // Opções de pagamento com diferentes juros
  const paymentOptions: PaymentOption[] = [
    { id: '1x-30', label: '1x em 30 dias', installments: 1, period: '30 dias', interestRate: 2 },
    { id: '2x-60', label: '2x em 60 dias', installments: 2, period: '30 dias cada', interestRate: 3 },
    { id: '3x-90', label: '3x em 90 dias', installments: 3, period: '30 dias cada', interestRate: 4 },
    { id: '6x-180', label: '6x em 180 dias', installments: 6, period: '30 dias cada', interestRate: 6 },
    { id: '12x-360', label: '12x em 1 ano', installments: 12, period: '30 dias cada', interestRate: 8 }
  ];

  useEffect(() => {
    if (selectedFundIdForCapitalRequest) {
      setStep('amount');
    }
  }, [selectedFundIdForCapitalRequest, isCapitalRequestOpen]);

  const handleClose = () => {
    setIsCapitalRequestOpen(false);
    setSelectedFundIdForCapitalRequest(null);
    setStep('amount');
    setAmount('');
    setSelectedPaymentOption('');
    setPurpose('');
    setIsCustomSchedule(false);
    setCustomPayments([]);
    setNewPaymentAmount('');
    setNewPaymentDate('');
  };

  const handleNextStep = () => {
    if (step === 'amount') {
      const amountValue = parseFloat(amount.replace(',', '.'));
      if (isNaN(amountValue) || amountValue <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido.",
          variant: "destructive"
        });
        return;
      }
      setStep('payment-terms');
    } else if (step === 'payment-terms') {
      if (!selectedPaymentOption && !isCustomSchedule) {
        toast({
          title: "Selecione uma opção",
          description: "Escolha uma forma de pagamento.",
          variant: "destructive"
        });
        return;
      }
      if (isCustomSchedule && customPayments.length === 0) {
        toast({
          title: "Cronograma vazio",
          description: "Adicione pelo menos um pagamento ao cronograma.",
          variant: "destructive"
        });
        return;
      }
      if (isCustomSchedule) {
        const totalCustomPayments = customPayments.reduce((sum, payment) => 
          sum + parseFloat(payment.amount.replace(',', '.')), 0
        );
        const amountValue = parseFloat(amount.replace(',', '.'));
        if (totalCustomPayments < amountValue * 1.02) { // Mínimo 2% de juros
          toast({
            title: "Valor insuficiente",
            description: "O total dos pagamentos deve ser pelo menos 2% maior que o valor solicitado.",
            variant: "destructive"
          });
          return;
        }
      }
      setStep('purpose');
    } else if (step === 'purpose') {
      if (!purpose.trim()) {
        toast({
          title: "Objetivo obrigatório",
          description: "Explique para que precisa do capital.",
          variant: "destructive"
        });
        return;
      }
      setStep('summary');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment-terms') {
      setStep('amount');
    } else if (step === 'purpose') {
      setStep('payment-terms');
    } else if (step === 'summary') {
      setStep('purpose');
    }
  };

  const calculateTotal = () => {
    const amountValue = parseFloat(amount.replace(',', '.'));
    
    if (isCustomSchedule) {
      const total = customPayments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount.replace(',', '.')), 0
      );
      const interest = total - amountValue;
      return { total, interest, installmentValue: 0 };
    }
    
    const option = paymentOptions.find(o => o.id === selectedPaymentOption);
    if (!option || isNaN(amountValue)) return { total: 0, interest: 0, installmentValue: 0 };

    const interest = (amountValue * option.interestRate) / 100;
    const total = amountValue + interest;
    const installmentValue = total / option.installments;

    return { total, interest, installmentValue };
  };

  const handleSubmit = () => {
    if (!selectedFund) return;

    const amountValue = parseFloat(amount.replace(',', '.'));
    const { total } = calculateTotal();
    
    let paymentDescription = '';
    let repaymentDate = new Date();
    
    if (isCustomSchedule) {
      const sortedPayments = customPayments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const lastPaymentDate = new Date(sortedPayments[sortedPayments.length - 1].date);
      repaymentDate = lastPaymentDate;
      
      paymentDescription = `${purpose} | Cronograma personalizado (${customPayments.length} pagamentos) | Total com juros: ${formatCurrency(total)}`;
    } else {
      const option = paymentOptions.find(o => o.id === selectedPaymentOption);
      if (!option) return;
      
      repaymentDate.setDate(repaymentDate.getDate() + (option.installments * 30));
      paymentDescription = `${purpose} | Pagamento: ${option.label} | Total com juros: ${formatCurrency(total)}`;
    }

    requestCapitalFromFund(
      selectedFund.id,
      amountValue,
      paymentDescription,
      repaymentDate
    );

    toast({
      title: "Solicitação enviada!",
      description: "Sua solicitação foi enviada para aprovação dos administradores."
    });

    handleClose();
  };

  const formatCurrencyInput = (value: string) => {
    const numericValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numericValue)) return 'R$ 0,00';
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const addCustomPayment = () => {
    if (!newPaymentAmount || !newPaymentDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o valor e a data do pagamento.",
        variant: "destructive"
      });
      return;
    }

    const newPayment: CustomPayment = {
      id: Date.now().toString(),
      amount: newPaymentAmount,
      date: newPaymentDate
    };

    setCustomPayments([...customPayments, newPayment]);
    setNewPaymentAmount('');
    setNewPaymentDate('');
  };

  const removeCustomPayment = (id: string) => {
    setCustomPayments(customPayments.filter(payment => payment.id !== id));
  };

  const handleCustomScheduleToggle = () => {
    setIsCustomSchedule(!isCustomSchedule);
    if (!isCustomSchedule) {
      setSelectedPaymentOption('');
    } else {
      setCustomPayments([]);
    }
  };

  const getStepNumber = () => {
    const steps = ['amount', 'payment-terms', 'purpose', 'summary'];
    return steps.indexOf(step) + 1;
  };

  const selectedPaymentOptionData = paymentOptions.find(o => o.id === selectedPaymentOption);
  const calculations = calculateTotal();

  if (!selectedFund) {
    return null;
  }

  return (
    <Sheet open={isCapitalRequestOpen} onOpenChange={setIsCapitalRequestOpen}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="capital-request-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step !== 'amount' && (
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
              <div className="w-full bg-white/30 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(['amount', 'payment-terms', 'purpose', 'summary'].indexOf(step) + 1) * 25}%` 
                  }}
                />
              </div>
            </div>
          </header>

          <div className="p-4 pb-60">
            {step === 'amount' && (
              <div className="space-y-6">
                {/* Fundo selecionado */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-2">Fundo selecionado</p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedFund.image} 
                      alt={selectedFund.name} 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <p className="font-bold text-primary text-lg">{selectedFund.name}</p>
                      <p className="text-sm text-gray-600">Saldo: {formatCurrency(selectedFund.balance)}</p>
                    </div>
                  </div>
                </div>

                {/* Campo de valor */}
                <div className="space-y-4">
                  <div className="text-center">
                    <label className="text-sm font-medium text-gray-600 block mb-4">
                      Quanto você precisa solicitar?
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
                        {formatCurrencyInput(amount)}
                      </p>
                    )}
                  </div>

                  {/* Valores sugeridos */}
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {['500', '1000', '2000', '5000', '10000', '20000'].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        className="h-12 rounded-xl border-gray-200 hover:border-primary hover:bg-primary/5"
                        onClick={() => setAmount(value)}
                      >
                        R$ {parseInt(value).toLocaleString('pt-BR')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'payment-terms' && (
              <div className="space-y-6">
                {/* Resumo do valor */}
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Valor solicitado</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrencyInput(amount)}</span>
                  </div>
                </div>

                {/* Opções de pagamento */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Escolha a forma de pagamento</h3>
                  
                  {!isCustomSchedule && (
                    <RadioGroup value={selectedPaymentOption} onValueChange={setSelectedPaymentOption}>
                      {paymentOptions.map((option) => {
                        const amountValue = parseFloat(amount.replace(',', '.'));
                        const interest = (amountValue * option.interestRate) / 100;
                        const total = amountValue + interest;
                        const installmentValue = total / option.installments;

                        return (
                          <div key={option.id} className="space-y-0">
                            <label 
                              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                                selectedPaymentOption === option.id 
                                  ? 'border-primary bg-primary/5 shadow-md' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={option.id} />
                                <div>
                                  <div className="font-semibold text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">
                                    {option.installments > 1 
                                      ? `${option.installments} parcelas de ${formatCurrency(installmentValue)}`
                                      : `Pagamento único`
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                  {formatCurrency(total)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Juros: {option.interestRate}% ({formatCurrency(interest)})
                                </div>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {/* Opção de cronograma personalizado */}
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className={`w-full h-16 rounded-xl border-2 border-dashed transition-all ${
                        isCustomSchedule 
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                      }`}
                      onClick={handleCustomScheduleToggle}
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">Criar cronograma personalizado</div>
                          <div className="text-sm opacity-70">Defina suas próprias datas e valores</div>
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Interface do cronograma personalizado */}
                  {isCustomSchedule && (
                    <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-xl border">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Pagamento Personalizado</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCustomScheduleToggle}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Voltar às opções rápidas
                        </Button>
                      </div>

                      {/* Adicionar novo pagamento */}
                      <div className="space-y-3 bg-white p-4 rounded-lg border">
                        <div className="flex items-center space-x-2 text-primary">
                          <Plus className="h-4 w-4" />
                          <span className="font-medium">Adicionar Pagamento</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Valor do pagamento
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0,00"
                                value={newPaymentAmount}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^\d,]/g, '');
                                  const commaCount = (value.match(/,/g) || []).length;
                                  if (commaCount <= 1) {
                                    setNewPaymentAmount(value);
                                  }
                                }}
                                className="pl-10 rounded-lg border-gray-300 focus:border-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Data do pagamento
                            </label>
                            <Input
                              type="date"
                              value={newPaymentDate}
                              onChange={(e) => setNewPaymentDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="rounded-lg border-gray-300 focus:border-primary"
                            />
                          </div>

                          <Button
                            onClick={addCustomPayment}
                            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Adicionar Pagamento
                          </Button>
                        </div>
                      </div>

                      {/* Lista de pagamentos adicionados */}
                      {customPayments.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-900">Cronograma de Pagamentos</h5>
                          <div className="space-y-2">
                            {customPayments
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {formatCurrencyInput(payment.amount)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {new Date(payment.date).toLocaleDateString('pt-BR')}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCustomPayment(payment.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-green-800">Total a pagar</span>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(customPayments.reduce((sum, payment) => 
                                  sum + parseFloat(payment.amount.replace(',', '.')), 0
                                ))}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm text-green-700">Juros aplicados</span>
                              <span className="text-sm font-medium text-green-600">
                                {formatCurrency(customPayments.reduce((sum, payment) => 
                                  sum + parseFloat(payment.amount.replace(',', '.')), 0
                                ) - parseFloat(amount.replace(',', '.')))}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedPaymentOptionData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">Cálculo detalhado</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>Valor solicitado: {formatCurrencyInput(amount)}</div>
                          <div>Juros ({selectedPaymentOptionData.interestRate}%): {formatCurrency(calculations.interest)}</div>
                          <div className="font-semibold">Total a pagar: {formatCurrency(calculations.total)}</div>
                          {selectedPaymentOptionData.installments > 1 && (
                            <div>Valor por parcela: {formatCurrency(calculations.installmentValue)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'purpose' && (
              <div className="space-y-6">
                {/* Resumo da solicitação */}
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Valor</span>
                      <div className="font-bold text-lg">{formatCurrencyInput(amount)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Pagamento</span>
                      <div className="font-medium">{selectedPaymentOptionData?.label}</div>
                    </div>
                  </div>
                </div>

                {/* Campo de objetivo */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-2">
                      Para que você precisa deste capital?
                    </label>
                    <Textarea 
                      placeholder="Explique detalhadamente o propósito da solicitação. Ex: Investimento em equipamentos, capital de giro, emergência pessoal, etc."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-primary min-h-[120px] resize-none"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Seja claro e específico sobre como utilizará o recurso. Isso ajuda os administradores a avaliar sua solicitação.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 'summary' && (
              <div className="space-y-6">
                {/* Resumo completo */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Resumo da solicitação</h3>
                  
                  {/* Fundo */}
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={selectedFund.image} 
                        alt={selectedFund.name} 
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fundo</p>
                        <p className="font-bold text-primary">{selectedFund.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes financeiros */}
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor solicitado</span>
                      <span className="text-xl font-bold">{formatCurrencyInput(amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Forma de pagamento</span>
                      <span className="font-medium">
                        {isCustomSchedule ? 'Cronograma personalizado' : selectedPaymentOptionData?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {isCustomSchedule ? 'Juros (personalizado)' : `Juros (${selectedPaymentOptionData?.interestRate}%)`}
                      </span>
                      <span className="font-medium text-orange-600">{formatCurrency(calculations.interest)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total a pagar</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(calculations.total)}</span>
                      </div>
                      {selectedPaymentOptionData && selectedPaymentOptionData.installments > 1 && !isCustomSchedule && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">
                            {selectedPaymentOptionData.installments} parcelas de
                          </span>
                          <span className="text-lg font-semibold">{formatCurrency(calculations.installmentValue)}</span>
                        </div>
                      )}
                      {isCustomSchedule && customPayments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-gray-600 font-medium">Cronograma:</div>
                          {customPayments
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((payment, index) => (
                              <div key={payment.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">
                                  {index + 1}º pagamento - {new Date(payment.date).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="font-medium">{formatCurrencyInput(payment.amount)}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Objetivo */}
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="font-medium text-gray-900 mb-2">Objetivo</h4>
                    <p className="text-gray-700 leading-relaxed">{purpose}</p>
                  </div>

                  {/* Aviso */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Importante</h4>
                        <p className="text-sm text-yellow-700">
                          Sua solicitação será enviada para aprovação dos administradores do fundo. 
                          Você receberá uma notificação quando houver uma resposta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {step !== 'summary' ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleNextStep}
                  disabled={
                    (step === 'amount' && (!amount || parseFloat(amount.replace(',', '.')) <= 0)) ||
                    (step === 'payment-terms' && !selectedPaymentOption && !isCustomSchedule) ||
                    (step === 'payment-terms' && isCustomSchedule && customPayments.length === 0) ||
                    (step === 'purpose' && !purpose.trim())
                  }
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <span>Próxima etapa</span>
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
              <div className="space-y-3">
                <Button 
                  onClick={handleSubmit}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Enviar solicitação
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

export default CapitalRequestSheet;