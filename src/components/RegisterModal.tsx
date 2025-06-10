import React, { useState } from 'react';
import { ArrowLeft, FileText, User, Mail, Eye, EyeOff } from 'lucide-react';
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

type RegisterStep = 'cpf' | 'personal-info' | 'password';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState<RegisterStep>('cpf');
  const [formData, setFormData] = useState({
    cpf: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    cpf?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCPF(value);
    if (formatted.length <= 14) {
      setFormData({ ...formData, cpf: formatted });
      setErrors({ ...errors, cpf: '' });
    }
  };

  const handleCPFStep = () => {
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    
    if (!validateCPF(cleanCPF)) {
      setErrors({ cpf: 'CPF inválido' });
      return;
    }
    
    setStep('personal-info');
  };

  const handlePersonalInfoStep = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStep('password');
  };

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      console.log('Cadastro realizado:', formData);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('cpf');
    setFormData({
      cpf: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleBack = () => {
    if (step === 'personal-info') {
      setStep('cpf');
    } else if (step === 'password') {
      setStep('personal-info');
    }
  };

  const stepTitles = {
    cpf: 'Criar conta',
    'personal-info': 'Seus dados',
    password: 'Criar senha'
  };

  const stepDescriptions = {
    cpf: 'Digite seu CPF para começar',
    'personal-info': 'Complete suas informações pessoais',
    password: 'Crie uma senha segura para sua conta'
  };

  const isStepValid = () => {
    switch (step) {
      case 'cpf':
        return formData.cpf.trim().length > 0;
      case 'personal-info':
        return formData.name.trim().length > 0 && formData.email.trim().length > 0;
      case 'password':
        return formData.password.length > 0 && formData.confirmPassword.length > 0;
      default:
        return false;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full p-0 flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex-1 flex flex-col">
          <SheetHeader className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {step !== 'cpf' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-8 w-8 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1 text-center">
                <SheetTitle className="text-xl font-semibold text-white">
                  {stepTitles[step]}
                </SheetTitle>
                <SheetDescription className="mt-1 text-blue-200/80">
                  {stepDescriptions[step]}
                </SheetDescription>
              </div>
              {step === 'cpf' && <div className="h-8 w-8" />}
            </div>
          </SheetHeader>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-sm mx-auto w-full">
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-2xl">
                {step === 'cpf' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-white">CPF</Label>
                      <div className="relative">
                        <Input
                          id="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleCPFChange}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 ${errors.cpf ? 'border-red-400' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <FileText className="h-4 w-4 text-white/50" />
                        </div>
                      </div>
                      {errors.cpf && (
                        <p className="text-sm text-red-300">{errors.cpf}</p>
                      )}
                    </div>
                  </div>
                )}

                {step === 'personal-info' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Nome completo</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            setErrors({ ...errors, name: '' });
                          }}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 ${errors.name ? 'border-red-400' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <User className="h-4 w-4 text-white/50" />
                        </div>
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-300">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            setErrors({ ...errors, email: '' });
                          }}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 ${errors.email ? 'border-red-400' : ''}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Mail className="h-4 w-4 text-white/50" />
                        </div>
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-300">{errors.email}</p>
                      )}
                    </div>
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
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            setErrors({ ...errors, password: '' });
                          }}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 ${errors.password ? 'border-red-400' : ''}`}
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Digite a senha novamente"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            setErrors({ ...errors, confirmPassword: '' });
                          }}
                          className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-300">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="text-xs text-blue-200/80 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${validatePassword(formData.password) ? 'bg-green-400' : 'bg-white/30'}`} />
                        <span>Mínimo 8 caracteres</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center pt-6 border-t border-white/10 mt-6">
                  <p className="text-sm text-blue-200/80">
                    Já tem uma conta?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-blue-200 hover:text-white"
                      onClick={onSwitchToLogin}
                    >
                      Entrar
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões fixos na parte inferior */}
          <div className="p-6 mt-auto">
            <div className="max-w-sm mx-auto w-full">
              {step === 'cpf' && (
                <Button 
                  onClick={handleCPFStep}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-medium"
                  disabled={!isStepValid()}
                >
                  Continuar
                </Button>
              )}

              {step === 'personal-info' && (
                <Button 
                  onClick={handlePersonalInfoStep}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-medium"
                  disabled={!isStepValid()}
                >
                  Continuar
                </Button>
              )}

              {step === 'password' && (
                <Button 
                  onClick={handleRegister}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-medium"
                  disabled={!isStepValid() || isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RegisterModal;