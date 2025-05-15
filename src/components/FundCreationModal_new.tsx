import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
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
    <Dialog open={isFundCreationOpen} onOpenChange={setIsFundCreationOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 'details' ? 'Criar novo fundo' : 'Adicionar membros'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fund-name">Nome do fundo</label>
              <Input 
                id="fund-name"
                placeholder="Ex: Amigos do futebol" 
                value={fundData.name}
                onChange={(e) => setFundData({...fundData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fund-description">Descrição</label>
              <Input 
                id="fund-description"
                placeholder="Ex: Para custos de aluguel de quadra" 
                value={fundData.description}
                onChange={(e) => setFundData({...fundData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem</label>
              <div className="grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                      fundData.image === image ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => selectImage(image)}
                  >
                    <img src={image} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adicionar membros</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nome do membro"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <Button onClick={handleAddMember}>Adicionar</Button>
              </div>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Membros adicionados</label>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span>{member}</span>
                      <Button variant="ghost" onClick={() => handleRemoveMember(member)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 'details' ? (
            <div className="flex w-full justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleNextStep}>Próximo</Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => setStep('details')}>
                Voltar
              </Button>
              <Button onClick={handleCreateFund}>
                Criar fundo
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FundCreationModal;