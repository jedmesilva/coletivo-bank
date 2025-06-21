import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Settings, Calculator, Percent, Vote, CheckCircle } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

type FundSettingsStep = 'contribution' | 'interest' | 'approval' | 'summary';

interface FundSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fund: {
    id: string;
    name: string;
    description: string;
    contributionRate?: number;
    interestRate?: number;
    approvalType?: 'quorum' | 'unanimous';
    minimumQuorum?: number;
  };
}

export default function FundSettingsSheet({ isOpen, onClose, fund }: FundSettingsSheetProps) {
  const [step, setStep] = useState<FundSettingsStep>('contribution');
  const [contributionRate, setContributionRate] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [approvalType, setApprovalType] = useState<string>('');
  const [minimumQuorum, setMinimumQuorum] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const stepTitles = {
    'contribution': 'Taxa de Contribuição',
    'interest': 'Taxa de Juros',
    'approval': 'Sistema de Aprovações',
    'summary': 'Confirmar Alterações'
  };

  const stepDescriptions = {
    'contribution': 'Defina o percentual máximo que membros podem solicitar',
    'interest': 'Configure os juros sobre capital concedido',
    'approval': 'Escolha como as decisões serão tomadas',
    'summary': 'Revise todas as configurações antes de salvar'
  };

  useEffect(() => {
    if (isOpen && fund) {
      setStep('contribution');
      setContributionRate((fund.contributionRate || 100).toString());
      setInterestRate((fund.interestRate || 0).toString());
      setApprovalType(fund.approvalType || 'quorum');
      setMinimumQuorum((fund.minimumQuorum || 50).toString());
    }
  }, [isOpen, fund]);

  const handleClose = () => {
    onClose();
    setStep('contribution');
    setContributionRate('');
    setInterestRate('');
    setApprovalType('');
    setMinimumQuorum('');
  };

  const handleNextStep = () => {
    if (step === 'contribution') {
      const rate = parseFloat(contributionRate);
      if (isNaN(rate) || rate < 0 || rate > 1000) {
        toast({
          title: "Valor inválido",
          description: "A taxa de contribuição deve estar entre 0% e 1.000%",
          variant: "destructive"
        });
        return;
      }
      setStep('interest');
    } else if (step === 'interest') {
      const rate = parseFloat(interestRate);
      if (isNaN(rate) || rate < 0 || rate > 12) {
        toast({
          title: "Valor inválido", 
          description: "A taxa de juros deve estar entre 0% e 12% ao ano",
          variant: "destructive"
        });
        return;
      }
      setStep('approval');
    } else if (step === 'approval') {
      if (!approvalType) {
        toast({
          title: "Seleção obrigatória",
          description: "Escolha um tipo de aprovação",
          variant: "destructive"
        });
        return;
      }
      if (approvalType === 'quorum') {
        const quorum = parseFloat(minimumQuorum);
        if (isNaN(quorum) || quorum < 1 || quorum > 100) {
          toast({
            title: "Valor inválido",
            description: "O quórum mínimo deve estar entre 1% e 100%",
            variant: "destructive"
          });
          return;
        }
      }
      setStep('summary');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'interest') setStep('contribution');
    else if (step === 'approval') setStep('interest');
    else if (step === 'summary') setStep('approval');
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/funds/${fund.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributionRate: parseFloat(contributionRate),
          interestRate: parseFloat(interestRate),
          approvalType,
          minimumQuorum: approvalType === 'quorum' ? parseInt(minimumQuorum) : 50
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar configurações');
      }
      
      toast({
        title: "Configurações salvas!",
        description: "As configurações do fundo foram atualizadas com sucesso."
      });
      
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepNumber = () => {
    const steps = ['contribution', 'interest', 'approval', 'summary'];
    return steps.indexOf(step) + 1;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getContributionExample = () => {
    const rate = parseFloat(contributionRate) || 0;
    const contributed = 1000;
    const maxRequest = (contributed * rate) / 100;
    return { contributed, maxRequest };
  };

  const getInterestExample = () => {
    const rate = parseFloat(interestRate) || 0;
    const principal = 1000;
    const monthlyInterest = (principal * (rate / 100)) / 12;
    return { principal, monthlyInterest };
  };

  if (!fund) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="fund-settings-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step !== 'contribution' && (
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
                <SheetDescription 
                  id="fund-settings-description"
                  className="text-white/70 text-sm mt-1"
                >
                  {stepDescriptions[step]}
                </SheetDescription>
              </div>
              <div className="text-white/60 text-sm">
                {getStepNumber()}/4
              </div>
            </div>

            {/* Progress indicator */}
            <div className="px-4">
              <div className="flex gap-2">
                {['contribution', 'interest', 'approval', 'summary'].map((stepName, index) => (
                  <div
                    key={stepName}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index < getStepNumber() ? 'bg-white' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="px-4 py-6 space-y-6">
            {step === 'contribution' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Taxa de Contribuição</h3>
                    <p className="text-sm text-gray-600">Define o limite de solicitação baseado na contribuição</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentual da taxa (0% - 1000%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      step="1"
                      value={contributionRate}
                      onChange={(e) => setContributionRate(e.target.value)}
                      placeholder="Ex: 100"
                      className="text-lg"
                    />
                  </div>

                  {contributionRate && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Exemplo prático:</h4>
                      <p className="text-sm text-gray-600">
                        Se um membro contribuiu {formatCurrency(getContributionExample().contributed)}, 
                        ele pode solicitar até {formatCurrency(getContributionExample().maxRequest)} em capital.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                         onClick={() => setContributionRate('50')}>
                      <div className="font-medium text-blue-700">50%</div>
                      <div className="text-xs text-blue-600">Conservador</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                         onClick={() => setContributionRate('100')}>
                      <div className="font-medium text-green-700">100%</div>
                      <div className="text-xs text-green-600">Equilibrado</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                         onClick={() => setContributionRate('200')}>
                      <div className="font-medium text-orange-700">200%</div>
                      <div className="text-xs text-orange-600">Agressivo</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'interest' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <Percent className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Taxa de Juros</h3>
                    <p className="text-sm text-gray-600">Juros cobrados sobre o capital concedido</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taxa de juros anual (0% - 12%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="Ex: 6.0"
                      className="text-lg"
                    />
                  </div>

                  {interestRate && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Exemplo prático:</h4>
                      <p className="text-sm text-gray-600">
                        Empréstimo de {formatCurrency(getInterestExample().principal)} gera 
                        aproximadamente {formatCurrency(getInterestExample().monthlyInterest)} de juros por mês.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                         onClick={() => setInterestRate('0')}>
                      <div className="font-medium text-green-700">0%</div>
                      <div className="text-xs text-green-600">Sem juros</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                         onClick={() => setInterestRate('3')}>
                      <div className="font-medium text-blue-700">3%</div>
                      <div className="text-xs text-blue-600">Baixo</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                         onClick={() => setInterestRate('6')}>
                      <div className="font-medium text-yellow-700">6%</div>
                      <div className="text-xs text-yellow-600">Moderado</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                         onClick={() => setInterestRate('12')}>
                      <div className="font-medium text-red-700">12%</div>
                      <div className="text-xs text-red-600">Alto</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'approval' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <Vote className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Sistema de Aprovações</h3>
                    <p className="text-sm text-gray-600">Como as decisões serão tomadas no fundo</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <RadioGroup value={approvalType} onValueChange={setApprovalType}>
                    <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="quorum" id="quorum" />
                      <div className="flex-1">
                        <label htmlFor="quorum" className="font-medium text-gray-900 cursor-pointer">
                          Quórum Mínimo de Votantes
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Decisões aprovadas quando a maioria vota e atinge o quórum mínimo
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="unanimous" id="unanimous" />
                      <div className="flex-1">
                        <label htmlFor="unanimous" className="font-medium text-gray-900 cursor-pointer">
                          Aprovação Unânime
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Todas as decisões precisam ser aprovadas por 100% dos votantes
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  {approvalType === 'quorum' && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Quórum mínimo (1% - 100%)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        value={minimumQuorum}
                        onChange={(e) => setMinimumQuorum(e.target.value)}
                        placeholder="Ex: 50"
                        className="text-lg"
                      />
                      <p className="text-sm text-gray-600">
                        Percentual mínimo de membros que devem votar para validar uma decisão
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Resumo das Configurações</h3>
                    <p className="text-sm text-gray-600">Revise antes de salvar as alterações</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Taxa de Contribuição</h4>
                    <p className="text-sm text-gray-600">
                      <strong>{contributionRate}%</strong> - Membros podem solicitar até {contributionRate}% do que contribuíram
                    </p>
                  </div>

                  <div className="p-4 border rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Taxa de Juros</h4>
                    <p className="text-sm text-gray-600">
                      <strong>{interestRate}% ao ano</strong> - Juros aplicados sobre capital concedido
                    </p>
                  </div>

                  <div className="p-4 border rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">Sistema de Aprovações</h4>
                    <p className="text-sm text-gray-600">
                      {approvalType === 'quorum' ? (
                        <>
                          <strong>Quórum de {minimumQuorum}%</strong> - Decisões aprovadas quando {minimumQuorum}% dos membros votam
                        </>
                      ) : (
                        <>
                          <strong>Aprovação Unânime</strong> - Todas as decisões precisam de 100% de aprovação
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 bg-white border-t">
          {step !== 'summary' ? (
            <Button 
              className="w-full h-12 text-lg font-medium"
              onClick={handleNextStep}
            >
              Continuar
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="w-full h-12 text-lg font-medium bg-green-600 hover:bg-green-700"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}