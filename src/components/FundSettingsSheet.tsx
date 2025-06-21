import React, { useState, useEffect } from 'react';
import { X, Calculator, Percent, Vote, FileText, Users, Share2, Trash2 } from 'lucide-react';
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

type FundSettingsTab = 'contribution' | 'interest' | 'approval' | 'fund-data' | 'members' | 'invites' | 'danger';

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
    approvalType?: 'quorum' | 'unanimous';
    minimumQuorum?: number;
  };
}

export default function FundSettingsSheet({ isOpen, onClose, fund }: FundSettingsSheetProps) {
  const [activeTab, setActiveTab] = useState<FundSettingsTab>('fund-data');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fund data states
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  
  // Settings states
  const [contributionRate, setContributionRate] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [approvalType, setApprovalType] = useState<string>('');
  const [minimumQuorum, setMinimumQuorum] = useState<string>('');

  useEffect(() => {
    if (isOpen && fund) {
      setActiveTab('fund-data');
      setFundName(fund.name);
      setFundDescription(fund.description || '');
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

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm('Você tem alterações não salvas. Deseja realmente fechar?');
      if (!confirmClose) return;
    }
    onClose();
    setActiveTab('fund-data');
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
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Header with Fund Info */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center justify-between mb-6">
              <div className="flex items-center flex-1">
                <img 
                  src={fund.image} 
                  alt={fund.name} 
                  className="w-12 h-12 rounded-xl object-cover mr-3 shadow-sm border-2 border-white/20"
                />
                <div className="flex-1">
                  <SheetTitle className="text-xl text-white font-semibold">
                    Configurações do Fundo
                  </SheetTitle>
                  <SheetDescription 
                    id="fund-settings-description"
                    className="text-white/70 text-sm mt-1"
                  >
                    {fund.name}
                  </SheetDescription>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/10" 
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Tabs Navigation */}
          <div className="px-4 py-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FundSettingsTab)}>
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100">
                <TabsTrigger value="fund-data" className="flex flex-col gap-1 py-2 px-2 text-xs">
                  <FileText className="w-4 h-4" />
                  <span>Dados</span>
                </TabsTrigger>
                <TabsTrigger value="contribution" className="flex flex-col gap-1 py-2 px-2 text-xs">
                  <Calculator className="w-4 h-4" />
                  <span>Contribuição</span>
                </TabsTrigger>
                <TabsTrigger value="interest" className="flex flex-col gap-1 py-2 px-2 text-xs">
                  <Percent className="w-4 h-4" />
                  <span>Juros</span>
                </TabsTrigger>
                <TabsTrigger value="approval" className="flex flex-col gap-1 py-2 px-2 text-xs">
                  <Vote className="w-4 h-4" />
                  <span>Aprovações</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100">
                  <TabsTrigger value="members" className="flex flex-col gap-1 py-2 px-2 text-xs">
                    <Users className="w-4 h-4" />
                    <span>Membros</span>
                  </TabsTrigger>
                  <TabsTrigger value="invites" className="flex flex-col gap-1 py-2 px-2 text-xs">
                    <Share2 className="w-4 h-4" />
                    <span>Convites</span>
                  </TabsTrigger>
                  <TabsTrigger value="danger" className="flex flex-col gap-1 py-2 px-2 text-xs text-red-600">
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="mt-6 space-y-6">
                {/* Fund Data Tab */}
                <TabsContent value="fund-data" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fund-name">Nome do Fundo</Label>
                      <Input
                        id="fund-name"
                        value={fundName}
                        onChange={(e) => {
                          setFundName(e.target.value);
                          trackChanges();
                        }}
                        placeholder="Digite o nome do fundo"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fund-description">Descrição</Label>
                      <Textarea
                        id="fund-description"
                        value={fundDescription}
                        onChange={(e) => {
                          setFundDescription(e.target.value);
                          trackChanges();
                        }}
                        placeholder="Descreva o objetivo do fundo"
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Contribution Tab */}
                <TabsContent value="contribution" className="space-y-6">
                  <div className="space-y-4">
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
                        Define o percentual máximo que membros podem solicitar (0% - 1000%)
                      </p>
                    </div>

                    {contributionRate && (
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2">Exemplo:</h4>
                        <p className="text-sm text-gray-600">
                          Se um membro contribuiu {formatCurrency(getContributionExample().contributed)}, 
                          ele pode solicitar até {formatCurrency(getContributionExample().maxRequest)} em capital.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          setContributionRate('50');
                          trackChanges();
                        }}
                      >
                        <div className="font-medium text-blue-700">50%</div>
                        <div className="text-xs text-blue-600">Conservador</div>
                      </button>
                      <button
                        type="button"
                        className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        onClick={() => {
                          setContributionRate('100');
                          trackChanges();
                        }}
                      >
                        <div className="font-medium text-green-700">100%</div>
                        <div className="text-xs text-green-600">Equilibrado</div>
                      </button>
                      <button
                        type="button"
                        className="text-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        onClick={() => {
                          setContributionRate('200');
                          trackChanges();
                        }}
                      >
                        <div className="font-medium text-orange-700">200%</div>
                        <div className="text-xs text-orange-600">Agressivo</div>
                      </button>
                    </div>
                  </div>
                </TabsContent>

                {/* Interest Tab */}
                <TabsContent value="interest" className="space-y-6">
                  <div className="space-y-4">
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
                      {[
                        { rate: '0', label: 'Sem juros', color: 'green' },
                        { rate: '3', label: 'Baixo', color: 'blue' },
                        { rate: '6', label: 'Moderado', color: 'yellow' },
                        { rate: '12', label: 'Alto', color: 'red' }
                      ].map(({ rate, label, color }) => (
                        <button
                          key={rate}
                          type="button"
                          className={`text-center p-3 bg-${color}-50 rounded-lg hover:bg-${color}-100 transition-colors`}
                          onClick={() => {
                            setInterestRate(rate);
                            trackChanges();
                          }}
                        >
                          <div className={`font-medium text-${color}-700`}>{rate}%</div>
                          <div className={`text-xs text-${color}-600`}>{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Approval Tab */}
                <TabsContent value="approval" className="space-y-6">
                  <div className="space-y-4">
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

                {/* Members Tab */}
                <TabsContent value="members" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Membros do Fundo</h3>
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
                  </div>
                </TabsContent>

                {/* Invites Tab */}
                <TabsContent value="invites" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Convites e Links</h3>
                    
                    <div className="p-4 border rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-2">Link de Convite</h4>
                      <div className="flex gap-2">
                        <Input
                          value={`https://app.fundos.com/invite/${fund.id}`}
                          readOnly
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
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
                  </div>
                </TabsContent>

                {/* Danger Tab */}
                <TabsContent value="danger" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-red-600">Zona de Perigo</h3>
                    
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
        <div className="p-4 bg-white border-t">
          <Button 
            className="w-full h-12 text-lg font-medium"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            variant={hasChanges ? "default" : "secondary"}
          >
            {isLoading ? 'Salvando...' : hasChanges ? 'Salvar Alterações' : 'Nenhuma Alteração'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}