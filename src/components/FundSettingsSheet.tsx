import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Settings, Users, Percent, Calculator, Vote } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface FundSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fund: {
    id: string;
    name: string;
    description: string;
    contributionRate?: number; // Percentual de 0 a 1000
    interestRate?: number; // Percentual anual de 0 a 12
    approvalType?: 'quorum' | 'unanimous';
    minimumQuorum?: number; // Percentual mínimo de votantes para quorum
  };
}

export default function FundSettingsSheet({ isOpen, onClose, fund }: FundSettingsSheetProps) {
  const [contributionRate, setContributionRate] = useState(fund.contributionRate || 100);
  const [interestRate, setInterestRate] = useState(fund.interestRate || 0);
  const [approvalType, setApprovalType] = useState<'quorum' | 'unanimous'>(fund.approvalType || 'quorum');
  const [minimumQuorum, setMinimumQuorum] = useState(fund.minimumQuorum || 50);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Validações
    if (contributionRate < 0 || contributionRate > 1000) {
      toast.error('A taxa de contribuição deve estar entre 0% e 1.000%');
      setIsLoading(false);
      return;
    }
    
    if (interestRate < 0 || interestRate > 12) {
      toast.error('A taxa de juros deve estar entre 0% e 12% ao ano');
      setIsLoading(false);
      return;
    }
    
    if (approvalType === 'quorum' && (minimumQuorum < 1 || minimumQuorum > 100)) {
      toast.error('O quórum mínimo deve estar entre 1% e 100%');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/funds/${fund.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributionRate,
          interestRate,
          approvalType,
          minimumQuorum
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar configurações');
      }
      
      toast.success('Configurações do fundo atualizadas com sucesso!');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configurações. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getContributionExample = (rate: number) => {
    const contributed = 1000;
    const maxRequest = (contributed * rate) / 100;
    return { contributed, maxRequest };
  };

  const getInterestExample = (rate: number) => {
    const principal = 1000;
    const monthlyInterest = (principal * (rate / 100)) / 12;
    return { principal, monthlyInterest };
  };

  const contributionExample = getContributionExample(contributionRate);
  const interestExample = getInterestExample(interestRate);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Definições do Fundo
          </SheetTitle>
          <SheetDescription>
            Configure as regras e políticas do fundo "{fund.name}"
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Taxa de Contribuição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5" />
                Taxa de Contribuição
              </CardTitle>
              <CardDescription>
                Define o percentual máximo que os membros podem solicitar em relação ao que contribuíram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contribution-rate">Taxa de Contribuição (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="contribution-rate"
                    type="number"
                    min="0"
                    max="1000"
                    step="1"
                    value={contributionRate}
                    onChange={(e) => setContributionRate(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Badge variant="secondary">{contributionRate}%</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Intervalo: 0% a 1.000%
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Exemplo:</strong> Se um membro contribuiu R$ {contributionExample.contributed.toLocaleString('pt-BR')}, 
                  ele pode solicitar até R$ {contributionExample.maxRequest.toLocaleString('pt-BR')} em capital.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium">50%</div>
                  <div className="text-xs text-muted-foreground">Conservador</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium">100%</div>
                  <div className="text-xs text-muted-foreground">Equilibrado</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-medium">200%</div>
                  <div className="text-xs text-muted-foreground">Agressivo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taxa de Juros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Percent className="w-5 h-5" />
                Taxa de Juros
              </CardTitle>
              <CardDescription>
                Define os juros cobrados sobre o capital concedido aos membros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Taxa de Juros Anual (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="interest-rate"
                    type="number"
                    min="0"
                    max="12"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Badge variant="secondary">{interestRate}% a.a.</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Intervalo: 0% a 12% ao ano
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Exemplo:</strong> Empréstimo de R$ {interestExample.principal.toLocaleString('pt-BR')} 
                  gera aproximadamente R$ {interestExample.monthlyInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} 
                  de juros por mês.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-medium">0%</div>
                  <div className="text-xs text-muted-foreground">Sem juros</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-medium">3%</div>
                  <div className="text-xs text-muted-foreground">Baixo</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-medium">6%</div>
                  <div className="text-xs text-muted-foreground">Moderado</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="font-medium">12%</div>
                  <div className="text-xs text-muted-foreground">Alto</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Aprovação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Vote className="w-5 h-5" />
                Sistema de Aprovações
              </CardTitle>
              <CardDescription>
                Define como as decisões são tomadas no fundo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Tipo de Aprovação</Label>
                <Select value={approvalType} onValueChange={(value: 'quorum' | 'unanimous') => setApprovalType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quorum">Quórum Mínimo de Votantes</SelectItem>
                    <SelectItem value="unanimous">Aprovação Unânime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {approvalType === 'quorum' && (
                <div className="space-y-2">
                  <Label htmlFor="minimum-quorum">Quórum Mínimo (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="minimum-quorum"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={minimumQuorum}
                      onChange={(e) => setMinimumQuorum(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{minimumQuorum}%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Percentual mínimo de membros que devem votar para validar uma decisão
                  </div>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {approvalType === 'quorum' ? (
                    <>
                      <strong>Quórum Mínimo:</strong> Decisões são aprovadas quando pelo menos {minimumQuorum}% 
                      dos membros votam e a maioria aprova.
                    </>
                  ) : (
                    <>
                      <strong>Aprovação Unânime:</strong> Todas as decisões precisam ser aprovadas por 
                      100% dos membros votantes.
                    </>
                  )}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Aplicável para:</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Solicitações de capital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Alterações no nome do fundo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Adição e remoção de membros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Mudanças nas configurações do fundo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}