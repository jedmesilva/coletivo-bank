
import React, { useState } from 'react';
import { X, Users, Plus, UserPlus, Link, ArrowLeft } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';

type FundCreationStep = 'details' | 'members';

const FundCreationModal: React.FC = () => {
  const { isFundCreationOpen, setIsFundCreationOpen, createFund } = useApp();
  const [step, setStep] = useState<FundCreationStep>('details');
  const [fundData, setFundData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200&h=200'
  });
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');

  const images = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200&h=200'
  ];

  const handleClose = () => {
    setIsFundCreationOpen(false);
    setStep('details');
    setFundData({
      name: '',
      description: '',
      image: images[0]
    });
    setMembers([]);
    setMemberInput('');
  };

  const handleNextStep = () => {
    if (!fundData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o fundo.",
        variant: "destructive"
      });
      return;
    }

    if (!fundData.description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, insira uma descrição para o fundo.",
        variant: "destructive"
      });
      return;
    }

    setStep('members');
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
        className="p-0 h-[100dvh] overflow-hidden flex flex-col max-w-full"
        aria-describedby="fund-creation-description"
      >
        <div className="flex-0 overflow-y-auto pb-0">
          <header className="border-b border-gray-200">
            <div className="h-10 px-4 flex items-center">
              {step === 'members' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-2" 
                  onClick={() => setStep('details')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl">
                {step === 'details' ? 'Criar novo fundo' : 'Adicionar membros'}
              </SheetTitle>
            </div>
            <div className="px-4 pb-3">
              <SheetDescription>
                {step === 'details' 
                  ? "Defina as informações básicas do fundo" 
                  : "Adicione os membros que farão parte do fundo"}
              </SheetDescription>
            </div>
          </header>

          <div className="pt-3 px-4">
            {step === 'details' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center" htmlFor="fund-name">
                    Nome do fundo
                    <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                  </label>
                  <Input 
                    id="fund-name"
                    placeholder="Ex: Amigos do futebol" 
                    value={fundData.name}
                    onChange={(e) => setFundData({...fundData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center" htmlFor="fund-description">
                    Descrição
                    <span className="text-xs text-gray-500 ml-1">(obrigatório)</span>
                  </label>
                  <Input 
                    id="fund-description"
                    placeholder="Ex: Para custos de aluguel de quadra" 
                    value={fundData.description}
                    onChange={(e) => setFundData({...fundData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Imagem</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors">
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
                          <Plus size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Fazer upload de imagem</span>
                        </div>
                      </label>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">Ou escolha uma das opções abaixo:</p>

                    <div className="grid grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div 
                          key={index}
                          className={`cursor-pointer rounded-lg overflow-hidden h-20 border-2 ${
                            fundData.image === image ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => selectImage(image)}
                        >
                          <img 
                            src={image} 
                            alt={`Option ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
                  />
                  <Button type="button" onClick={handleAddMember}>
                    <UserPlus size={18} />
                  </Button>
                </div>

                {members.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    <p className="text-sm font-medium">Membros ({members.length})</p>
                    <div className="border rounded-lg divide-y">
                      {members.map((member, index) => (
                        <div key={index} className="flex justify-between items-center p-3">
                          <span>{member}</span>
                          <button 
                            onClick={() => handleRemoveMember(member)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto mb-2 h-10 w-10" />
                    <p>Adicione membros ao seu fundo</p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Link className="mr-2" size={16} />
                      Link de convite
                    </div>
                    <Button variant="outline" size="sm">
                      Copiar link
                    </Button>
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    Compartilhe este link para convidar pessoas para o fundo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
          <div className="px-4">
            {step === 'details' ? (
              <div className="space-y-3">
                <Button
                  onClick={handleNextStep}
                  className="w-full h-12 text-base font-medium"
                >
                  Próximo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12" 
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handleCreateFund}
                  className="w-full h-12 text-base font-medium"
                >
                  Criar fundo
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12"
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
