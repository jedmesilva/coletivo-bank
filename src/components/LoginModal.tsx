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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LoginStep = 'identifier' | 'password';
type IdentifierType = 'cpf' | 'email';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [step, setStep] = useState<LoginStep>('identifier');
  const [identifierType, setIdentifierType] = useState<IdentifierType>('cpf');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ cpf?: string; email?: string; password?: string }>({});

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

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCPF(value);
    if (formatted.length <= 14) {
      setCpf(formatted);
      setErrors({ ...errors, cpf: '' });
    }
  };

  const handleNextStep = () => {
    if (identifierType === 'cpf') {
      const cleanCPF = cpf.replace(/\D/g, '');
      if (!validateCPF(cleanCPF)) {
        setErrors({ cpf: 'CPF inválido' });
        return;
      }
    } else {
      if (!validateEmail(email)) {
        setErrors({ email: 'Email inválido' });
        return;
      }
    }
    
    setStep('password');
  };

  const handleLogin = async () => {
    if (!password) {
      setErrors({ password: 'Digite sua senha' });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const identifier = identifierType === 'cpf' ? cpf : email;
      console.log('Login realizado:', { identifier, password, type: identifierType });
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep('identifier');
    setIdentifierType('cpf');
    setCpf('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setErrors({});
    onClose();
  };

  const getCurrentIdentifier = () => {
    return identifierType === 'cpf' ? cpf : email;
  };

  const isIdentifierValid = () => {
    if (identifierType === 'cpf') {
      return cpf.trim().length > 0;
    }
    return email.trim().length > 0;
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full h-full p-0 flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex-1 flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {step === 'password' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep('identifier')}
                  className="h-8 w-8 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1 text-center">
                <SheetTitle className="text-xl font-semibold text-white">
                  {step === 'identifier' ? 'Entrar na conta' : 'Digite sua senha'}
                </SheetTitle>
                <SheetDescription className="mt-1 text-blue-200/80">
                  {step === 'identifier' 
                    ? 'Escolha como deseja entrar'
                    : `Confirme sua identidade para ${identifierType === 'cpf' ? 'CPF' : 'Email'}: ${getCurrentIdentifier()}`
                  }
                </SheetDescription>
              </div>
              {step === 'identifier' && <div className="h-8 w-8" />}
            </div>
          </SheetHeader>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-sm mx-auto w-full">
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-2xl">
                {step === 'identifier' && (
                  <div className="space-y-6">
                    <Tabs value={identifierType} onValueChange={(value) => setIdentifierType(value as IdentifierType)}>
                      <TabsList className="grid w-full grid-cols-2 bg-white/10">
                        <TabsTrigger value="cpf" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
                          CPF
                        </TabsTrigger>
                        <TabsTrigger value="email" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
                          Email
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="cpf" className="mt-4 space-y-4 border-0">
                        <div className="space-y-2">
                          <Label htmlFor="cpf" className="text-white">CPF</Label>
                          <div className="relative">
                            <Input
                              id="cpf"
                              type="text"
                              placeholder="000.000.000-00"
                              value={cpf}
                              onChange={handleCPFChange}
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${errors.cpf ? 'border-red-400' : ''}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <FileText className="h-4 w-4 text-white/50" />
                            </div>
                          </div>
                          {errors.cpf && (
                            <p className="text-sm text-red-300">{errors.cpf}</p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="email" className="mt-4 space-y-4 border-0">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">Email</Label>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: '' });
                              }}
                              className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${errors.email ? 'border-red-400' : ''}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Mail className="h-4 w-4 text-white/50" />
                            </div>
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-300">{errors.email}</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {step === 'password' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Senha</Label>
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
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${errors.password ? 'border-red-400' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
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
                        <p className="text-sm text-red-300">{errors.password}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <Button variant="link" className="p-0 h-auto text-sm text-blue-200 hover:text-white">
                        Esqueci minha senha
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center pt-6 border-t border-white/10 mt-6">
                  <p className="text-sm text-blue-200/80">
                    {step === 'identifier' ? 'Não tem uma conta?' : 'Não tem uma conta?'}{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-200 hover:text-white"
                      onClick={onSwitchToRegister}
                    >
                      Criar conta
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões fixos na parte inferior */}
          <div className="p-6 mt-auto">
            <div className="max-w-sm mx-auto w-full">
              {step === 'identifier' && (
                <Button 
                  onClick={handleNextStep}
                  className="w-full h-12 bg-white text-slate-900 hover:bg-white/90 font-medium rounded-xl shadow-lg transition-all duration-200"
                  disabled={!isIdentifierValid()}
                >
                  Continuar
                </Button>
              )}

              {step === 'password' && (
                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 bg-white text-slate-900 hover:bg-white/90 font-medium rounded-xl shadow-lg transition-all duration-200"
                  disabled={!password || isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;