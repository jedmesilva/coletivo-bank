import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Percent, Vote, FileText, Users, Share2, Trash2, Settings, CreditCard, AlertTriangle, Plus } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

type FundSettingsTab = 'general' | 'rates' | 'approval' | 'members' | 'danger';
type RatesSubTab = 'contribution' | 'interest';
type MembersSubTab = 'management' | 'invites';

interface FundSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fund: {
    id: string;
    name: string;
    description: string;
    image: string;
    members: Array<{
      id: string;
      name: string;
      role: string;
      joined: string;
      profileImage?: string;
    }>;
    contributionRate?: number;
    interestRate?: number;
    approvalType?: 'quorum' | 'unanimous' | 'administrators';
    minimumQuorum?: number;
  };
}

export default function FundSettingsSheet({ isOpen, onClose, fund }: FundSettingsSheetProps) {
  const [activeTab, setActiveTab] = useState<FundSettingsTab>('general');
  const [activeRatesTab, setActiveRatesTab] = useState<RatesSubTab>('contribution');
  const [activeMembersTab, setActiveMembersTab] = useState<MembersSubTab>('management');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fund data states
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [fundImage, setFundImage] = useState('');

  const images = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200&h=200'
  ];

  // Settings states
  const [contributionRate, setContributionRate] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [approvalType, setApprovalType] = useState<string>('');
  const [minimumQuorum, setMinimumQuorum] = useState<string>('');

  useEffect(() => {
    if (isOpen && fund) {
      setActiveTab('general');
      setActiveRatesTab('contribution');
      setActiveMembersTab('management');
      setFundName(fund.name);
      setFundDescription(fund.description || '');
      setFundImage(fund.image || '');
      setContributionRate((fund.contributionRate || 100).toString());
      setInterestRate((fund.interestRate || 0).toString());
      setApprovalType(fund.approvalType || 'quorum');
      setMinimumQuorum((fund.minimumQuorum || 50).toString());
      setHasChanges(false);
    }
  }, [isOpen, fund]);

  // Track changes
  const trackChanges = () => {
    setHasChanges(true);
  };

  const selectImage = (imageUrl: string) => {
    setFundImage(imageUrl);
    trackChanges();
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('Você tem alterações não salvas. Deseja realmente fechar?');
      if (!confirmClose) return;
    }
    onClose();
    setActiveTab('general');
    setHasChanges(false);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: "Nenhuma alteração",
        description: "Não há alterações para salvar."
      });
      return;
    }

    setIsLoading(true);

    try {
      // Validate data before saving
      if (fundName.trim().length < 3) {
        throw new Error('O nome do fundo deve ter pelo menos 3 caracteres');
      }

      const contribRate = parseFloat(contributionRate);
      if (isNaN(contribRate) || contribRate < 0 || contribRate > 1000) {
        throw new Error('A taxa de contribuição deve estar entre 0% e 1.000%');
      }

      const intRate = parseFloat(interestRate);
      if (isNaN(intRate) || intRate < 0 || intRate > 12) {
        throw new Error('A taxa de juros deve estar entre 0% e 12% ao ano');
      }

      if (!['quorum', 'unanimous', 'administrators'].includes(approvalType)) {
        throw new Error('Tipo de aprovação inválido');
      }

      if (approvalType === 'quorum') {
        const quorum = parseInt(minimumQuorum);
        if (isNaN(quorum) || quorum < 1 || quorum > 100) {
          throw new Error('O quórum mínimo deve estar entre 1% e 100%');
        }
      }

      const response = await fetch(`/api/funds/${fund.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fundName.trim(),
          description: fundDescription.trim(),
          contributionRate: contribRate,
          interestRate: intRate,
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

      setHasChanges(false);
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getContributionExample = () => {
    const rate = parseFloat(contributionRate) || 0;
    const requestAmount = 1000;
    const requiredContribution = (requestAmount * rate) / 100;
    return { requestAmount, requiredContribution };
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
          {/* Header with Back Button */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                onClick={handleClose}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <SheetTitle className="text-xl text-white font-semibold">
                Configurações do Fundo
              </SheetTitle>
            </div>
            <div className="px-4">
              <SheetDescription 
                id="fund-settings-description"
                className="text-white/70"
              >
                {fund.name}
              </SheetDescription>
            </div>
          </header>

          {/* Main Tabs Navigation */}
          <div className="py-4 flex-1 overflow-hidden flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FundSettingsTab)} className="flex-1 flex flex-col min-h-0">
              <div className="overflow-x-auto scrollbar-hide px-4 flex-shrink-0">
                <TabsList className="flex h-auto p-1 bg-gray-100 rounded-2xl w-fit">
                  <div className="flex gap-1">
                    <TabsTrigger value="general" className="flex flex-col gap-1 py-3 px-4 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex-shrink-0">
                      <Settings className="w-4 h-4" />
                      <span>Geral</span>
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="flex flex-col gap-1 py-3 px-4 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex-shrink-0">
                      <Calculator className="w-4 h-4" />
                      <span>Taxas</span>
                    </TabsTrigger>
                    <TabsTrigger value="approval" className="flex flex-col gap-1 py-3 px-4 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex-shrink-0">
                      <Vote className="w-4 h-4" />
                      <span>Aprovações</span>
                    </TabsTrigger>
                    <TabsTrigger value="members" className="flex flex-col gap-1 py-3 px-4 text-xs rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex-shrink-0">
                      <Users className="w-4 h-4" />
                      <span>Membros</span>
                    </TabsTrigger>
                    <TabsTrigger value="danger" className="flex flex-col gap-1 py-3 px-4 text-xs text-red-600 rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex-shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Perigo</span>
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="mt-6 flex-1 overflow-y-auto px-6 min-h-0">
                {/* General Tab */}
                <TabsContent value="general" className="space-y-6 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 data-[state=active]:overflow-y-auto px-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Informações Gerais
                    </h3>

                    <div>
                      <Label htmlFor="fund-name">Nome do Fundo</Label>
                      <Input
                        id="fund-name"
                        value={fundName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 20) {
                            setFundName(value);
                            trackChanges();
                          }
                        }}
                        maxLength={20}
                        placeholder="Digite o nome do fundo"
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Máximo 20 caracteres ({fundName.length}/20)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="fund-description">Propósito do fundo</Label>
                      <Textarea
                        id="fund-description"
                        value={fundDescription}
                        onChange={(e) => {
                          setFundDescription(e.target.value);
                          trackChanges();
                        }}
                        placeholder="Ex: Para custear aluguel de quadra, equipamentos esportivos e eventos do grupo"
                        rows={3}
                        className="mt-2 mb-4"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Imagem do fundo</Label>

                      {/* Upload de imagem */}
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setFundImage(imageUrl);
                                trackChanges();
                              }
                            }}
                          />
                          <div className="flex flex-col items-center">
                            <Plus size={32} className="text-gray-400 mb-3" />
                            <span className="text-base font-medium text-gray-600 mb-1">Fazer upload de imagem</span>
                            <span className="text-sm text-gray-500">JPG, PNG ou GIF até 5MB</span>
                          </div>
                        </label>
                      </div>

                      <div className="text-center">
                        <span className="text-sm text-gray-500">ou escolha uma das opções abaixo</span>
                      </div>

                      {/* Grade de imagens predefinidas */}
                      <div className="grid grid-cols-3 gap-3">
                        {images.map((image, index) => (
                          <div 
                            key={index}
                            className={`cursor-pointer rounded-xl overflow-hidden h-24 border-2 transition-all ${
                              fundImage === image ? 'border-primary shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => selectImage(image)}
                          >
                            <img 
                              src={image} 
                              alt={`Opção ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Rates Tab with Sub-tabs */}
                <TabsContent value="rates" className="space-y-6 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 data-[state=active]:overflow-y-auto px-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Configuração de Taxas
                    </h3>

                    <Tabs value={activeRatesTab} onValueChange={(value) => setActiveRatesTab(value as RatesSubTab)} className="flex-1 flex flex-col">
                      <TabsList className="flex h-auto p-1 bg-gray-100 rounded-2xl w-fit">
                        <div className="flex gap-1">
                          <TabsTrigger value="contribution" className="flex items-center gap-2 py-2 px-3 text-sm rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Percent className="w-4 h-4" />
                            <span>Contribuição</span>
                          </TabsTrigger>
                          <TabsTrigger value="interest" className="flex items-center gap-2 py-2 px-3 text-sm rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Percent className="w-4 h-4" />
                            <span>Juros</span>
                          </TabsTrigger>
                        </div>
                      </TabsList>

                      <div className="mt-4">
                        {/* Contribution Sub-tab */}
                        <TabsContent value="contribution" className="space-y-4">
                          <div>
                            <Label htmlFor="contribution-rate">Taxa de Contribuição (%)</Label>
                            <Input
                              id="contribution-rate"
                              type="number"
                              min="0"
                              max="1000"
                              step="1"
                              value={contributionRate}
                              onChange={(e) => {
                                setContributionRate(e.target.value);
                                trackChanges();
                              }}
                              placeholder="Ex: 100"
                              className="mt-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Percentual que o membro deve ter contribuído em relação ao valor solicitado (0% - 1000%)
                            </p>
                          </div>

                          {contributionRate && (
                            <div className="p-4 bg-blue-50 rounded-xl">
                              <h4 className="font-medium text-gray-900 mb-2">Exemplo:</h4>
                              <p className="text-sm text-gray-600">
                                Para solicitar {formatCurrency(getContributionExample().requestAmount)}, 
                                o membro precisa ter contribuído pelo menos {formatCurrency(getContributionExample().requiredContribution)}.
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                contributionRate === '0'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setContributionRate('0');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${contributionRate === '0' ? 'text-white' : 'text-gray-900'}`}>0%</div>
                              <div className={`text-xs ${contributionRate === '0' ? 'opacity-90' : 'text-gray-600'}`}>Livre</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                contributionRate === '50'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setContributionRate('50');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${contributionRate === '50' ? 'text-white' : 'text-gray-900'}`}>50%</div>
                              <div className={`text-xs ${contributionRate === '50' ? 'opacity-90' : 'text-gray-600'}`}>Moderado</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                contributionRate === '100'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setContributionRate('100');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${contributionRate === '100' ? 'text-white' : 'text-gray-900'}`}>100%</div>
                              <div className={`text-xs ${contributionRate === '100' ? 'opacity-90' : 'text-gray-600'}`}>Conservador</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                contributionRate === '200'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setContributionRate('200');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${contributionRate === '200' ? 'text-white' : 'text-gray-900'}`}>200%</div>
                              <div className={`text-xs ${contributionRate === '200' ? 'opacity-90' : 'text-gray-600'}`}>Restritivo</div>
                            </button>
                          </div>
                        </TabsContent>

                        {/* Interest Sub-tab */}
                        <TabsContent value="interest" className="space-y-4">
                          <div>
                            <Label htmlFor="interest-rate">Taxa de Juros Anual (%)</Label>
                            <Input
                              id="interest-rate"
                              type="number"
                              min="0"
                              max="12"
                              step="0.1"
                              value={interestRate}
                              onChange={(e) => {
                                setInterestRate(e.target.value);
                                trackChanges();
                              }}
                              placeholder="Ex: 6.0"
                              className="mt-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Juros cobrados sobre capital concedido (0% - 12% ao ano)
                            </p>
                          </div>

                          {interestRate && (
                            <div className="p-4 bg-green-50 rounded-xl">
                              <h4 className="font-medium text-gray-900 mb-2">Exemplo:</h4>
                              <p className="text-sm text-gray-600">
                                Empréstimo de {formatCurrency(getInterestExample().principal)} gera 
                                aproximadamente {formatCurrency(getInterestExample().monthlyInterest)} de juros por mês.
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-4 gap-2">
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                interestRate === '0'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setInterestRate('0');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${interestRate === '0' ? 'text-white' : 'text-gray-900'}`}>0%</div>
                              <div className={`text-xs ${interestRate === '0' ? 'opacity-90' : 'text-gray-600'}`}>Sem juros</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                interestRate === '3'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setInterestRate('3');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${interestRate === '3' ? 'text-white' : 'text-gray-900'}`}>3%</div>
                              <div className={`text-xs ${interestRate === '3' ? 'opacity-90' : 'text-gray-600'}`}>Baixo</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                interestRate === '6'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setInterestRate('6');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${interestRate === '6' ? 'text-white' : 'text-gray-900'}`}>6%</div>
                              <div className={`text-xs ${interestRate === '6' ? 'opacity-90' : 'text-gray-600'}`}>Moderado</div>
                            </button>
                            <button
                              type="button"
                              className={`text-center p-3 rounded-xl transition-all duration-200 ${
                                interestRate === '12'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700'
                                  : 'bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-md'
                              }`}
                              onClick={() => {
                                setInterestRate('12');
                                trackChanges();
                              }}
                            >
                              <div className={`font-medium ${interestRate === '12' ? 'text-white' : 'text-gray-900'}`}>12%</div>
                              <div className={`text-xs ${interestRate === '12' ? 'opacity-90' : 'text-gray-600'}`}>Alto</div>
                            </button>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </TabsContent>

                {/* Approval Tab */}
                <TabsContent value="approval" className="space-y-6 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 data-[state=active]:overflow-y-auto px-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Vote className="w-5 h-5" />
                      Sistema de Aprovações
                    </h3>

                    <div>
                      <Label>Tipo de Aprovação</Label>
                      <RadioGroup 
                        value={approvalType} 
                        onValueChange={(value) => {
                          setApprovalType(value);
                          trackChanges();
                        }}
                        className="mt-2"
                      >
                        <div 
                          className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setApprovalType('quorum');
                            trackChanges();
                          }}
                        >
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

                        <div 
                          className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setApprovalType('unanimous');
                            trackChanges();
                          }}
                        >
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

                        <div 
                          className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setApprovalType('administrators');
                            trackChanges();
                          }}
                        >
                          <RadioGroupItem value="administrators" id="administrators" />
                          <div className="flex-1">
                            <label htmlFor="administrators" className="font-medium text-gray-900 cursor-pointer">
                              Administradores
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                              Apenas administradores podem votar nas decisões
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {approvalType === 'quorum' && (
                      <div>
                        <Label htmlFor="minimum-quorum">Quórum Mínimo (%)</Label>
                        <Input
                          id="minimum-quorum"
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          value={minimumQuorum}
                          onChange={(e) => {
                            setMinimumQuorum(e.target.value);
                            trackChanges();
                          }}
                          placeholder="Ex: 50"
                          className="mt-2"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Percentual mínimo de membros que devem votar para validar uma decisão
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Members Tab with Sub-tabs */}
                <TabsContent value="members" className="space-y-6 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 data-[state=active]:overflow-y-auto px-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Gestão de Membros
                    </h3>

                    <Tabs value={activeMembersTab} onValueChange={(value) => setActiveMembersTab(value as MembersSubTab)} className="flex-1 flex flex-col">
                      <TabsList className="flex h-auto p-1 bg-gray-100 rounded-2xl w-fit">
                        <div className="flex gap-1">
                          <TabsTrigger value="management" className="flex items-center gap-2 py-2 px-3 text-sm rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Users className="w-4 h-4" />
                            <span>Membros</span>
                          </TabsTrigger>
                          <TabsTrigger value="invites" className="flex items-center gap-2 py-2 px-3 text-sm rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Share2 className="w-4 h-4" />
                            <span>Convites</span>
                          </TabsTrigger>
                        </div>
                      </TabsList>

                      <div className="mt-4">
                        {/* Members Management Sub-tab */}
                        <TabsContent value="management" className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Lista de Membros</h4>
                            <Badge variant="secondary">{fund.members?.length || 0} membros</Badge>
                          </div>

                          <div className="space-y-3">
                            {fund.members && fund.members.length > 0 ? (
                              fund.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 border rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={member.profileImage} alt={member.name} />
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-gray-900">{member.name}</p>
                                      <p className="text-sm text-gray-500">Membro desde {member.joined}</p>
                                    </div>
                                  </div>
                                  <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                                    {member.role}
                                  </Badge>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Nenhum membro encontrado</p>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        {/* Invites Sub-tab */}
                        <TabsContent value="invites" className="space-y-4">
                          <h4 className="font-medium">Link de Convite</h4>

                          <div className="p-4 border rounded-xl">
                            <div className="flex gap-2">
                              <Input
                                value={`https://app.fundos.com/invite/${fund.id}`}
                                readOnly
                                className="flex-1"
                              />
                              <Button 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://app.fundos.com/invite/${fund.id}`);
                                  toast({
                                    title: "Link copiado!",
                                    description: "O link de convite foi copiado para a área de transferência."
                                  });
                                }}
                              >
                                Copiar
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Compartilhe este link para convidar novos membros
                            </p>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger" className="space-y-6 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 data-[state=active]:overflow-y-auto px-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Zona de Perigo
                    </h3>

                    <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                      <h4 className="font-medium text-red-900 mb-2">Excluir Fundo</h4>
                      <p className="text-sm text-red-700 mb-4">
                        Esta ação não pode ser desfeita. Todos os dados do fundo, histórico de transações 
                        e configurações serão permanentemente removidos.
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          const confirm = window.confirm(
                            `Tem certeza que deseja excluir o fundo "${fund.name}"? Esta ação não pode ser desfeita.`
                          );
                          if (confirm) {
                            // Implementar exclusão do fundo
                            toast({
                              title: "Funcionalidade em desenvolvimento",
                              description: "A exclusão de fundos será implementada em breve.",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        Excluir Fundo Permanentemente
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 bg-white border-t flex-shrink-0">
          <Button 
            className={`w-full h-12 text-lg font-medium transition-all duration-200 ${
              hasChanges && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? 'Salvando...' : hasChanges ? 'Salvar Alterações' : 'Nenhuma Alteração'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}