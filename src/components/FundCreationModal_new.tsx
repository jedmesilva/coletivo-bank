
import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type FundCreationStep = 'details' | 'members';

const FundCreationModal: React.FC = () => {
  const { isFundCreationOpen, setIsFundCreationOpen, createFund } = useApp();
  
  const [step, setStep] = useState<FundCreationStep>('details');
  const [fundName, setFundName] = useState('');
  const [fundDescription, setFundDescription] = useState('');
  const [fundImage, setFundImage] = useState('https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=200&h=200');
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');

  const handleClose = () => {
    setIsFundCreationOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStep('details');
    setFundName('');
    setFundDescription('');
    setFundImage('https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=200&h=200');
    setMembers([]);
    setNewMember('');
  };

  const handleNextStep = () => {
    if (!fundName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o fundo.",
        variant: "destructive"
      });
      return;
    }

    if (!fundDescription.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Por favor, insira uma descrição para o fundo.",
        variant: "destructive"
      });
      return;
    }

    setStep('members');
  };

  const handlePreviousStep = () => {
    setStep('details');
  };

  const handleAddMember = () => {
    if (!newMember.trim()) return;
    
    if (members.includes(newMember)) {
      toast({
        title: "Membro já adicionado",
        description: "Este membro já foi adicionado à lista.",
        variant: "destructive"
      });
      return;
    }
    
    setMembers([...members, newMember]);
    setNewMember('');
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateFund = () => {
    createFund({
      name: fundName,
      description: fundDescription,
      image: fundImage,
      members
    });
    
    toast({
      title: "Fundo criado com sucesso!",
      description: `O fundo "${fundName}" foi criado.`
    });
    
    handleClose();
  };

  return (
    <Sheet open={isFundCreationOpen} onOpenChange={setIsFundCreationOpen}>
      <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center">
              {step === 'members' && (
                <Button variant="ghost" size="icon" onClick={handlePreviousStep} className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <SheetTitle className="text-xl">
                {step === 'details' ? 'Criar novo fundo' : 'Adicionar membros'}
              </SheetTitle>
            </div>
          </SheetHeader>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {step === 'details' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Imagem do fundo</label>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={fundImage} 
                      alt="Fund preview"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Insira a URL de uma imagem</p>
                      <Input
                        placeholder="URL da imagem"
                        value={fundImage}
                        onChange={(e) => setFundImage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do fundo</label>
                  <Input
                    placeholder="Ex: Fundo família Silva"
                    value={fundName}
                    onChange={(e) => setFundName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Para emergências e objetivos familiares"
                    value={fundDescription}
                    onChange={(e) => setFundDescription(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-1">{fundName}</h3>
                  <p className="text-sm text-gray-600">{fundDescription}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adicionar membros</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nome do membro"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddMember();
                      }}
                    />
                    <Button onClick={handleAddMember} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {members.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Membros adicionados</label>
                    <div className="space-y-2">
                      {members.map((member, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                          <span>{member}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveMember(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhum membro adicionado. Você também poderá adicionar membros depois.
                  </p>
                )}
                
                <p className="text-sm text-gray-500">
                  Você será automaticamente adicionado como administrador do fundo.
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t p-4">
            {step === 'details' ? (
              <div className="flex space-x-2">
                <Button variant="outline" className="w-1/2" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button className="w-1/2" onClick={handleNextStep}>
                  Próximo
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={handleCreateFund}>
                Criar fundo
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FundCreationModal;
