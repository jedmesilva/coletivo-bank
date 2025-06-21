import React, { useState } from 'react';
import { X, Settings, Users, DollarSign, Shield, Trash2, UserPlus, Link, Eye, EyeOff } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatCurrency';

interface FundMember {
  id: string;
  name: string;
  email?: string;
  profileImage?: string;
  role: 'Admin' | 'Member';
  joined: string;
}

interface FundSettingsData {
  id: string;
  name: string;
  description: string;
  image: string;
  members: FundMember[];
  contributionRate: number;
  interestRate: number;
  approvalType: 'admin' | 'quorum' | 'unanimous';
  minimumQuorum: number;
}

interface FundSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  fund: FundSettingsData;
}

const FundSettingsSheet: React.FC<FundSettingsSheetProps> = ({ 
  isOpen, 
  onClose, 
  fund 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [ratesTab, setRatesTab] = useState('contribution');
  const [membersTab, setMembersTab] = useState('management');

  // Estados para as configurações
  const [fundName, setFundName] = useState(fund.name);
  const [fundDescription, setFundDescription] = useState(fund.description);
  const [contributionRate, setContributionRate] = useState(fund.contributionRate.toString());
  const [interestRate, setInterestRate] = useState(fund.interestRate.toString());
  const [approvalType, setApprovalType] = useState(fund.approvalType);
  const [minimumQuorum, setMinimumQuorum] = useState(fund.minimumQuorum.toString());
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteLink, setShowInviteLink] = useState(false);

  const inviteLink = `https://app.example.com/funds/join/${fund.id}`;

  const handleSave = () => {
    // Aqui você implementaria a lógica de salvamento
    toast({
      title: "Configurações salvas",
      description: "As configurações do fundo foram atualizadas com sucesso."
    });
    onClose();
  };

  const handleDeleteFund = () => {
    // Aqui você implementaria a lógica de exclusão
    toast({
      title: "Fundo excluído",
      description: "O fundo foi excluído permanentemente.",
      variant: "destructive"
    });
    onClose();
  };

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast({
        title: "Email obrigatório",
        description: "Digite o email do membro para enviar o convite.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Convite enviado",
      description: `Convite enviado para ${inviteEmail}`
    });
    setInviteEmail('');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copiado",
      description: "Link de convite copiado para a área de transferência."
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="fund-settings-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <SheetTitle className="text-xl text-white font-semibold">
                  Configurações do Fundo
                </SheetTitle>
                <div className="flex items-center mt-1">
                  <span className="text-white/70 text-sm">{fund.name}</span>
                </div>
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                Gerencie as configurações e membros do seu fundo
              </SheetDescription>
            </div>
          </header>

          <div className="p-4 pb-60">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 rounded-xl p-1">
                <TabsTrigger 
                  value="general" 
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="rates" 
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Taxas
                </TabsTrigger>
                <TabsTrigger 
                  value="approvals" 
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Aprovações
                </TabsTrigger>
                <TabsTrigger 
                  value="members" 
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Membros
                TabsTrigger>
                <TabsTrigger 
                  value="danger" 
                  className="text-xs data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Perigo
                TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              
                <TabsContent value="general" className="space-y-6">
                  
                    
                      Nome do Fundo
                    
                    
                      Digite o nome do fundo
                      
                    
                    
                      Descrição
                      
                    
                      Descreva o propósito do fundo
                      
                    
                    
                      
                        
                          
                            
                            
                          
                          
                            Imagem atual
                            Clique para alterar
                          
                        
                      
                    
                  
                

                
                  
                    
                      
                    

                    
                      
                        Taxa de Contribuição
                      
                        Taxa de Juros
                      
                    

                    
                      
                        
                          Taxa de Contribuição Mensal (R$)
                          
                          100
                          
                            Valor que cada membro deve contribuir mensalmente
                          
                        
                      

                      
                        
                          Taxa de Juros Anual (%)
                          
                          
                          5.0
                          
                            Taxa de juros aplicada em empréstimos do fundo
                          
                        
                      
                    
                  
                

                
                  
                    
                      
                    

                    
                      
                        
                          Tipo de Aprovação
                          
                            
                              Apenas Administradores
                              Somente admins podem aprovar solicitações
                            
                          
                          
                            
                              Quórum de Membros
                              Requer aprovação de uma porcentagem dos membros
                            
                          
                          
                            
                              Unanimidade
                              Todos os membros devem aprovar
                            
                          
                        
                      

                      {approvalType === 'quorum' && (
                        
                          
                            Quórum Mínimo (%)
                            
                            1
                            100
                            
                            50
                            
                              Porcentagem mínima de membros que devem aprovar
                            
                          
                        
                      )}
                    
                  
                

                
                  
                    
                      
                    

                    
                      
                        Gestão de Membros
                        Convites
                      
                    

                    
                      
                        
                          {fund.members.map((member) => (
                            
                              
                                
                                  
                                    
                                    
                                  
                                  
                                    {member.name}
                                    Membro desde {member.joined}
                                  
                                
                                
                                  
                                    {member.role}
                                  
                                  
                                
                              
                            
                          ))}
                        

                        
                          
                            
                              Convidar por Email
                              
                                
                                
                                  email@exemplo.com
                                  
                                  
                                    
                                    Enviar
                                  
                                
                              
                            

                            

                            
                              
                                Link de Convite
                                
                                  
                                  
                                
                              
                              
                                Compartilhe este link para que outros possam se juntar ao fundo
                              
                              
                                
                                  
                                  
                                  
                                    Copiar
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                

                
                  
                    
                      
                    

                    
                      
                        
                          Excluir Fundo
                          
                            Esta ação é irreversível. Todos os dados do fundo, incluindo histórico de transações e membros, serão permanentemente excluídos.
                          
                          
                            
                              
                              Excluir Fundo Permanentemente
                            
                          
                        
                      
                    
                  
                
              
            
          
        
        
          
            
              
                
                  Salvar Configurações
                
                
                  Cancelar
                
              
            
          
        
      
    
  );
};

export default FundSettingsSheet;