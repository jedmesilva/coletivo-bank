import React, { useState } from 'react';
import { X, Users, Plus, UserPlus, Link, ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

type FundCreationStep = 'name' | 'purpose' | 'image' | 'members';

const FundCreationModal: React.FC = () => {
  const { isFundCreationOpen, setIsFundCreationOpen, createFund, currentUser } = useApp();
  const [step, setStep] = useState<FundCreationStep>('name');
  const [fundData, setFundData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200&h=200'
  });
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const images = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200&h=200'
  ];

  const stepTitles = {
    name: 'Nome do fundo',
    purpose: 'Propósito do fundo',
    image: 'Imagem do fundo',
    members: 'Adicionar membros'
  };

  const stepDescriptions = {
    name: 'Escolha um nome para identificar seu fundo',
    purpose: 'Descreva o objetivo e finalidade do fundo',
    image: 'Selecione uma imagem para representar o fundo',
    members: 'Convide pessoas para participar do fundo'
  };

  const handleClose = () => {
    setIsFundCreationOpen(false);
    setStep('name');
    setFundData({
      name: '',
      description: '',
      image: images[0]
    });
    setMembers([]);
    setMemberInput('');
    setInviteLink('');
  };

  const handleNextStep = () => {
    if (step === 'name') {
      if (!fundData.name.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, insira um nome para o fundo.",
          variant: "destructive"
        });
        return;
      }
      setStep('purpose');
    } else if (step === 'purpose') {
      if (!fundData.description.trim()) {
        toast({
          title: "Propósito obrigatório",
          description: "Por favor, descreva o propósito do fundo.",
          variant: "destructive"
        });
        return;
      }
      setStep('image');
    } else if (step === 'image') {
      setStep('members');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'purpose') {
      setStep('name');
    } else if (step === 'image') {
      setStep('purpose');
    } else if (step === 'members') {
      setStep('image');
    }
  };

  const handleAddMember = () => {
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter(m => m !== member));
  };

  const generateInviteLink = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    const link = `https://app.fundos.com/invite/${randomId}`;
    setInviteLink(link);
    
    // Copiar para a área de transferência
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link de convite foi copiado para a área de transferência."
      });
    });
  };

  const handleCreateFund = () => {
    createFund({
      ...fundData,
      members: members
    });

    toast({
      title: "Fundo criado com sucesso!",
      description: `O fundo "${fundData.name}" foi criado.`
    });

    handleClose();
  };

  const selectImage = (image: string) => {
    setFundData({...fundData, image});
  };

  

  return (
    <Sheet open={isFundCreationOpen} onOpenChange={setIsFundCreationOpen}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="fund-creation-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header com gradiente seguindo o padrão do app */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              {step !== 'name' && (
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
                    width: `${(['name', 'purpose', 'image', 'members'].indexOf(step) + 1) * 25}%` 
                  }}
                />
              </div>
            </div>
          </header>

          <div className="p-4 pb-60">
            {step === 'name' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900" htmlFor="fund-name">
                    Nome do fundo
                  </label>
                  <Input 
                    id="fund-name"
                    placeholder="Ex: Amigos do futebol" 
                    value={fundData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 20) {
                        setFundData({...fundData, name: value});
                      }
                    }}
                    maxLength={20}
                    className="rounded-xl border-gray-200 focus:border-primary text-lg h-12"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Máximo 20 caracteres ({fundData.name.length}/20)
                  </p>
                </div>
              </div>
            )}

            {step === 'purpose' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900" htmlFor="fund-purpose">
                    Propósito do fundo
                  </label>
                  <Textarea 
                    id="fund-purpose"
                    placeholder="Ex: Para custear aluguel de quadra, equipamentos esportivos e eventos do grupo"
                    value={fundData.description}
                    onChange={(e) => setFundData({...fundData, description: e.target.value})}
                    className="rounded-xl border-gray-200 focus:border-primary min-h-[120px] resize-none"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Explique claramente para que será usado o dinheiro do fundo
                  </p>
                </div>
              </div>
            )}

            {step === 'image' && (
              <div className="space-y-6">
                <div className="space-y-4">
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
                            setFundData({...fundData, image: imageUrl});
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

                  <div className="grid grid-cols-3 gap-3">
                    {images.map((image, index) => (
                      <div 
                        key={index}
                        className={`cursor-pointer rounded-xl overflow-hidden h-24 border-2 transition-all ${
                          fundData.image === image ? 'border-primary shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
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
            )}

            {step === 'members' && (
              <div className="space-y-6">
                {/* Info sobre administrador */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-sm text-blue-600 font-medium">Administrador do fundo</p>
                    </div>
                  </div>
                </div>

                {/* Adicionar membros */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Adicionar membros (opcional)</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="@username ou nome do membro"
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMember();
                        }
                      }}
                      className="rounded-xl border-gray-200 focus:border-primary"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddMember}
                      className="rounded-xl h-10 w-10 p-0"
                      disabled={!memberInput.trim()}
                    >
                      <UserPlus size={18} />
                    </Button>
                  </div>

                  {members.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Membros adicionados ({members.length})</p>
                      <div className="border rounded-xl divide-y border-gray-200">
                        {members.map((member, index) => (
                          <div key={index} className="flex justify-between items-center p-3">
                            <span className="font-medium">{member}</span>
                            <button 
                              onClick={() => handleRemoveMember(member)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm">Nenhum membro adicionado ainda</p>
                    </div>
                  )}

                  {/* Link de convite */}
                  <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <Link className="mr-2" size={16} />
                        Link de convite
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-lg border-primary/30 text-primary hover:bg-primary/5"
                        onClick={generateInviteLink}
                      >
                        {inviteLink ? 'Copiar novamente' : 'Gerar link'}
                      </Button>
                    </div>
                    {inviteLink && (
                      <div className="mt-2 p-2 bg-white rounded-lg border text-xs font-mono text-gray-600 break-all">
                        {inviteLink}
                      </div>
                    )}
                    <p className="text-xs mt-2 text-gray-500">
                      Compartilhe este link para convidar pessoas para o fundo
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer fixo */}
        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {step !== 'members' ? (
              <div className="space-y-3">
                <Button
                  onClick={handleNextStep}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={
                    (step === 'name' && !fundData.name.trim()) ||
                    (step === 'purpose' && !fundData.description.trim())
                  }
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
                  onClick={handleCreateFund}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Criar fundo
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

export default FundCreationModal;