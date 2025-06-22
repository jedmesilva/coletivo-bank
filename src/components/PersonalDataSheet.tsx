import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard, Save, Edit, Plus } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface PersonalDataSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    address?: string;
    profileImage?: string;
  };
}

export default function PersonalDataSheet({ isOpen, onClose, user }: PersonalDataSheetProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // User data states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCpf, setUserCpf] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userImage, setUserImage] = useState('');

  

  useEffect(() => {
    if (isOpen && user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
      setUserPhone(user.phone || '');
      setUserCpf(user.cpf || '');
      setUserAddress(user.address || '');
      setUserImage(user.profileImage || '');
      setHasChanges(false);
      setIsEditing(false);
    }
  }, [isOpen, user]);

  const trackChanges = () => {
    setHasChanges(true);
  };

  

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aqui faria a chamada para API para salvar os dados
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula chamada API
      
      toast({
        title: "Dados atualizados",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
      
      setHasChanges(false);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="personal-data-description"
      >
        <div className={`flex-1 overflow-y-auto overscroll-contain ${
          isEditing ? 'pb-20' : 'pb-4'
        }`} style={{ height: '100dvh' }}>
          {/* Header com gradiente seguindo o padrão do app */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-6 flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 mr-3 text-white hover:bg-white/10" 
                  onClick={handleClose}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <SheetTitle className="text-xl text-white font-semibold">
                    Dados Pessoais
                  </SheetTitle>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 px-3 py-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
            
            <div className="px-6">
              <SheetDescription className="text-white/70">
                Gerencie suas informações pessoais e dados de contato
              </SheetDescription>
            </div>
          </header>

          <div className="px-6 py-6 space-y-6">
            {/* Profile Image Section */}
            <div className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="space-y-4">
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
                            setUserImage(imageUrl);
                            trackChanges();
                          }
                        }}
                      />
                      <div className="flex flex-col items-center">
                        <Plus size={32} className="text-gray-400 mb-3" />
                        <span className="text-base font-medium text-gray-700 mb-2">Fazer upload da sua foto</span>
                        <span className="text-sm text-gray-500">JPG, PNG até 5MB</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-name">Nome completo</Label>
                  <Input
                    id="user-name"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      trackChanges();
                    }}
                    placeholder="Digite seu nome completo"
                    className="mt-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="user-cpf">CPF</Label>
                  <Input
                    id="user-cpf"
                    value={userCpf}
                    onChange={(e) => {
                      const formatted = formatCpf(e.target.value);
                      if (formatted.replace(/\D/g, '').length <= 11) {
                        setUserCpf(formatted);
                        trackChanges();
                      }
                    }}
                    placeholder="000.000.000-00"
                    className="mt-2"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Informações de Contato
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      trackChanges();
                    }}
                    placeholder="seu@email.com"
                    className="mt-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="user-phone">Telefone</Label>
                  <Input
                    id="user-phone"
                    value={userPhone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      if (formatted.replace(/\D/g, '').length <= 11) {
                        setUserPhone(formatted);
                        trackChanges();
                      }
                    }}
                    placeholder="(00) 00000-0000"
                    className="mt-2"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </h3>
              
              <div>
                <Label htmlFor="user-address">Endereço completo</Label>
                <Input
                  id="user-address"
                  value={userAddress}
                  onChange={(e) => {
                    setUserAddress(e.target.value);
                    trackChanges();
                  }}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="mt-2"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botões - sempre visível no modo de edição */}
        {isEditing && (
          <div className="bg-white border-t p-4 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Reset values
                setUserName(user.name || '');
                setUserEmail(user.email || '');
                setUserPhone(user.phone || '');
                setUserCpf(user.cpf || '');
                setUserAddress(user.address || '');
                setUserImage(user.profileImage || '');
                setHasChanges(false);
                setIsEditing(false);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}