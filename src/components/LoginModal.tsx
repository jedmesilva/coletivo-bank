import React, { useState } from 'react';
import { ArrowLeft, Mail, FileText, Eye, EyeOff } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginStep = 'identifier' | 'password';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [step, setStep] = useState<LoginStep>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrors({ ...errors, identifier: '' });
    
    // Se contém apenas números, formatar como CPF
    if (/^\d/.test(value.replace(/\D/g, ''))) {
      const formatted = formatCPF(value);
      if (formatted.length <= 14) {
        setIdentifier(formatted);
      }
    } else {
      setIdentifier(value);
    }
  };

  const handleNextStep = () => {
    const cleanIdentifier = identifier.replace(/\D/g, '');
    
    // Verificar se é CPF ou email válido
    const isCPF = /^\d+$/.test(cleanIdentifier);
    const isEmail = !isCPF && validateEmail(identifier);
    
    if (isCPF && !validateCPF(cleanIdentifier)) {
      setErrors({ identifier: 'CPF inválido' });
      return;
    }
    
    if (!isCPF && !isEmail) {
      setErrors({ identifier: 'Digite um CPF ou email válido' });
      return;
    }
    
    setStep('password');
  };

  const handleLogin = async () => {
    if (!password) {
      setErrors({ password: 'Digite sua senha' });
      return;
    }

    setIsLoading(true);
    
    // Aqui será implementada a lógica de login no backend
    setTimeout(() => {
      setIsLoading(false);
      // Simulação de login bem-sucedido
      console.log('Login realizado:', { identifier, password });
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep('identifier');
    setIdentifier('');
    setPassword('');
    setShowPassword(false);
    setErrors({});
    onClose();
  };

  const getIdentifierType = () => {
    const cleanIdentifier = identifier.replace(/\D/g, '');
    return /^\d+$/.test(cleanIdentifier) ? 'CPF' : 'Email';
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full p-0 flex flex-col">
        <div className="flex-1 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              {step === 'password' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep('identifier')}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1 text-center">
                <SheetTitle className="text-xl font-semibold">
                  {step === 'identifier' ? 'Entrar na conta' : 'Digite sua senha'}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  {step === 'identifier' 
                    ? 'Digite seu CPF ou email para continuar'
                    : `Confirme sua identidade para ${getIdentifierType()}: ${identifier}`
                  }
                </SheetDescription>
              </div>
              {step === 'identifier' && <div className="h-8 w-8" />}
            </div>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-6">
            {step === 'identifier' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">CPF ou Email</Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="000.000.000-00 ou email@exemplo.com"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      className={errors.identifier ? 'border-red-500' : ''}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getIdentifierType() === 'CPF' ? (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {errors.identifier && (
                    <p className="text-sm text-red-500">{errors.identifier}</p>
                  )}
                </div>

                <Button 
                  onClick={handleNextStep}
                  className="w-full"
                  disabled={!identifier.trim()}
                >
                  Continuar
                </Button>
              </div>
            )}

            {step === 'password' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
                      }}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="text-right">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Esqueci minha senha
                  </Button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full"
                  disabled={!password || isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            )}

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                  onClick={onSwitchToRegister}
                >
                  Criar conta
                </Button>
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;