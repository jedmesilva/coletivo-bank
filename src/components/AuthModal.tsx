
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Check, AlertCircle, Mail, Calendar, ArrowLeft, CheckCircle, X, Loader2 } from 'lucide-react';

export default function AuthScreen() {
  const [step, setStep] = useState('cpf');
  const [cpf, setCpf] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    email: '',
    password: ''
  });

  // Sistema de validação inspirado no exemplo
  const [fieldValidations, setFieldValidations] = useState({
    cpf: { status: 'idle', message: '', showMessage: false },
    name: { status: 'idle', message: '', showMessage: false },
    birthDate: { status: 'idle', message: '', showMessage: false },
    email: { status: 'idle', message: '', showMessage: false },
    password: { status: 'idle', message: '', showMessage: false }
  });

  // Refs para timeouts de validação
  const validationTimeouts = useRef({});
  const inputRefs = useRef({});

  const existingUsers = useMemo(() => ({
    '12345678901': { name: 'João Silva', email: 'joao@email.com' },
    '98765432100': { name: 'Maria Santos', email: 'maria@email.com' }
  }), []);

  // Funções de formatação
  const formatCPF = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  // Funções de validação pura (sem side effects)
  const validateField = useCallback((fieldName, value) => {
    switch (fieldName) {
      case 'cpf':
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return { status: 'idle', message: '', showMessage: false };
        if (numbers.length < 11) return { status: 'incomplete', message: `CPF incompleto (${numbers.length}/11 dígitos)`, showMessage: true };
        if (/^(\d)\1{10}$/.test(numbers)) return { status: 'invalid', message: 'CPF inválido', showMessage: true };
        return { status: 'valid', message: 'CPF válido', showMessage: true };

      case 'name':
        if (!value.trim()) return { status: 'idle', message: '', showMessage: false };
        if (value.trim().length < 3) return { status: 'invalid', message: 'Nome muito curto (mínimo 3 caracteres)', showMessage: true };
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return { status: 'invalid', message: 'Nome deve conter apenas letras', showMessage: true };
        return { status: 'valid', message: 'Nome válido', showMessage: true };

      case 'birthDate':
        if (!value) return { status: 'idle', message: '', showMessage: false };
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) return { status: 'invalid', message: 'Você deve ter pelo menos 18 anos', showMessage: true };
        if (age > 120) return { status: 'invalid', message: 'Data inválida', showMessage: true };
        return { status: 'valid', message: 'Data válida', showMessage: true };

      case 'email':
        if (!value) return { status: 'idle', message: '', showMessage: false };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { status: 'invalid', message: 'Formato de email inválido', showMessage: true };
        return { status: 'valid', message: 'Email válido', showMessage: true };

      case 'password':
        if (!value) return { status: 'idle', message: '', showMessage: false };
        if (value.length < 6) return { status: 'invalid', message: 'Senha deve ter pelo menos 6 caracteres', showMessage: true };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return { status: 'invalid', message: 'Senha deve ter maiúscula, minúscula e número', showMessage: true };
        return { status: 'valid', message: 'Senha forte', showMessage: true };

      default:
        return { status: 'idle', message: '', showMessage: false };
    }
  }, []);

  // Função para atualizar validação de um campo
  const updateFieldValidation = useCallback((fieldName, value) => {
    const validation = validateField(fieldName, value);
    setFieldValidations(prev => ({
      ...prev,
      [fieldName]: validation
    }));
    return validation;
  }, [validateField]);

  // Função para validação com debounce
  const performValidationWithDebounce = useCallback((fieldName, value, delay = 500) => {
    // Limpar timeout anterior
    if (validationTimeouts.current[fieldName]) {
      clearTimeout(validationTimeouts.current[fieldName]);
    }
    
    // Agendar nova validação
    validationTimeouts.current[fieldName] = setTimeout(() => {
      updateFieldValidation(fieldName, value);
    }, delay);
  }, [updateFieldValidation]);

  // Simulação de verificação de CPF no servidor
  const checkCPF = useCallback(async (cpfNumbers) => {
    setFieldValidations(prev => ({
      ...prev,
      cpf: { status: 'checking', message: 'Verificando CPF...', showMessage: true }
    }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (existingUsers[cpfNumbers]) {
        setFieldValidations(prev => ({
          ...prev,
          cpf: { status: 'valid', message: 'CPF encontrado! Redirecionando para login...', showMessage: true }
        }));
        setTimeout(() => setStep('login'), 1500);
      } else {
        setFieldValidations(prev => ({
          ...prev,
          cpf: { status: 'valid', message: 'CPF válido! Prosseguindo com cadastro...', showMessage: true }
        }));
        setTimeout(() => setStep('signup-step1'), 1500);
      }
    } catch (err) {
      setFieldValidations(prev => ({
        ...prev,
        cpf: { status: 'invalid', message: 'Erro ao verificar CPF. Tente novamente.', showMessage: true }
      }));
      setError('Erro ao verificar CPF. Tente novamente.');
    }
  }, [existingUsers]);

  // Handler para CPF
  const handleCPFChange = useCallback((e) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {
      const formattedCPF = formatCPF(numbers);
      setCpf(formattedCPF);
      setError('');
      
      // Validação com debounce
      performValidationWithDebounce('cpf', formattedCPF);
    }
  }, [formatCPF, performValidationWithDebounce]);

  const handleCPFBlur = useCallback(() => {
    // Validação imediata no blur
    if (validationTimeouts.current.cpf) {
      clearTimeout(validationTimeouts.current.cpf);
    }
    const validation = updateFieldValidation('cpf', cpf);
    
    // Se CPF é válido, fazer verificação no servidor
    const numbers = cpf.replace(/\D/g, '');
    if (validation.status === 'valid' && numbers.length === 11) {
      checkCPF(numbers);
    }
  }, [cpf, updateFieldValidation, checkCPF]);

  // Handler genérico para outros campos
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    // Validação com debounce
    performValidationWithDebounce(name, value);
  }, [performValidationWithDebounce]);

  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    // Validação imediata no blur
    if (validationTimeouts.current[name]) {
      clearTimeout(validationTimeouts.current[name]);
    }
    updateFieldValidation(name, value);
  }, [updateFieldValidation]);

  // Funções de navegação
  const handleLogin = useCallback(async () => {
    const passwordValidation = updateFieldValidation('password', formData.password);
    if (passwordValidation.status !== 'valid') return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login:', { cpf, password: formData.password });
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  }, [cpf, formData.password, updateFieldValidation]);

  const handleSignupStep1 = useCallback(() => {
    const nameValidation = updateFieldValidation('name', formData.name);
    const birthDateValidation = updateFieldValidation('birthDate', formData.birthDate);

    if (nameValidation.status === 'valid' && birthDateValidation.status === 'valid') {
      setStep('signup-step2');
    }
  }, [formData.name, formData.birthDate, updateFieldValidation]);

  const handleSignupComplete = useCallback(async () => {
    const emailValidation = updateFieldValidation('email', formData.email);
    const passwordValidation = updateFieldValidation('password', formData.password);

    if (emailValidation.status !== 'valid' || passwordValidation.status !== 'valid') return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Cadastro completo:', { cpf, ...formData });
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [cpf, formData, updateFieldValidation]);

  const handleBack = useCallback(() => {
    const transitions = {
      'login': () => { setStep('cpf'); setCpf(''); },
      'signup-step1': () => { setStep('cpf'); setCpf(''); },
      'signup-step2': () => setStep('signup-step1')
    };

    transitions[step]?.();
    setFormData({ name: '', birthDate: '', email: '', password: '' });
    setError('');
    setFieldValidations({
      cpf: { status: 'idle', message: '', showMessage: false },
      name: { status: 'idle', message: '', showMessage: false },
      birthDate: { status: 'idle', message: '', showMessage: false },
      email: { status: 'idle', message: '', showMessage: false },
      password: { status: 'idle', message: '', showMessage: false }
    });

    // Limpar timeouts
    Object.values(validationTimeouts.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    validationTimeouts.current = {};
  }, [step]);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Componente ValidatedInput otimizado
  const ValidatedInput = React.memo(({ 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    onBlur, 
    icon: Icon, 
    disabled = false,
    showToggle = false,
    onToggle,
    showPassword: showPass = false,
    maxLength,
    inputMode,
    max
  }) => {
    const validation = fieldValidations[name] || { status: 'idle', message: '', showMessage: false };

    const getInputClasses = () => {
      const baseClasses = `w-full ${Icon ? 'pl-10' : 'pl-4'} ${showToggle ? 'pr-12' : 'pr-4'} py-3 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${name === 'cpf' ? 'text-center text-lg tracking-wider font-mono' : ''}`;
      
      switch (validation.status) {
        case 'invalid':
          return `${baseClasses} bg-red-900/20 border-2 border-red-500/50 focus:ring-red-400`;
        case 'valid':
          return `${baseClasses} bg-green-900/20 border-2 border-green-500/50 focus:ring-green-400`;
        case 'checking':
          return `${baseClasses} bg-blue-900/20 border-2 border-blue-500/50 focus:ring-blue-400`;
        case 'incomplete':
          return `${baseClasses} bg-orange-900/20 border-2 border-orange-500/50 focus:ring-orange-400`;
        default:
          return `${baseClasses} bg-white/10 border border-white/20 focus:ring-blue-400`;
      }
    };

    const getStatusIcon = () => {
      switch (validation.status) {
        case 'valid':
          return <CheckCircle className="w-5 h-5 text-green-400" />;
        case 'invalid':
          return <AlertCircle className="w-5 h-5 text-red-400" />;
        case 'checking':
          return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
        case 'incomplete':
          return <AlertCircle className="w-5 h-5 text-orange-400" />;
        default:
          return null;
      }
    };

    const getMessageClasses = () => {
      const baseClasses = "flex items-center space-x-2 text-sm p-2 rounded-lg transition-all duration-300";
      
      switch (validation.status) {
        case 'valid':
          return `${baseClasses} text-green-300 bg-green-900/20 border border-green-500/20`;
        case 'invalid':
          return `${baseClasses} text-red-300 bg-red-900/20 border border-red-500/20`;
        case 'checking':
          return `${baseClasses} text-blue-300 bg-blue-900/20 border border-blue-500/20`;
        case 'incomplete':
          return `${baseClasses} text-orange-300 bg-orange-900/20 border border-orange-500/20`;
        default:
          return `${baseClasses} text-gray-300 bg-gray-900/20 border border-gray-500/20`;
      }
    };

    const iconClassName = `h-5 w-5 transition-colors ${
      validation.status === 'invalid' ? 'text-red-400' : 
      validation.status === 'valid' ? 'text-green-400' :
      validation.status === 'checking' ? 'text-blue-400' :
      validation.status === 'incomplete' ? 'text-orange-400' :
      'text-blue-300'
    }`;

    return (
      <div className="space-y-2">
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={iconClassName} />
            </div>
          )}
          
          <input
            ref={(el) => { if (el) inputRefs.current[name] = el; }}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            inputMode={inputMode}
            max={max}
            className={getInputClasses()}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showToggle ? (
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <button
                  type="button"
                  onClick={onToggle}
                  className="text-blue-300 hover:text-blue-200 transition-colors"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            ) : (
              getStatusIcon()
            )}
          </div>
        </div>

        {validation.showMessage && validation.message && (
          <div className={getMessageClasses()}>
            {getStatusIcon()}
            <span>{validation.message}</span>
          </div>
        )}
      </div>
    );
  });

  const stepConfig = useMemo(() => ({
    cpf: {
      title: 'Acessar',
      subtitle: 'Digite seu CPF para começar',
      icon: User,
      progress: 0
    },
    login: {
      title: 'Digite sua senha',
      subtitle: `Olá, ${existingUsers[cpf.replace(/\D/g, '')]?.name || 'usuário'}!`,
      icon: Lock,
      progress: 100
    },
    'signup-step1': {
      title: 'Vamos te conhecer',
      subtitle: 'Precisamos de algumas informações',
      icon: User,
      progress: 50
    },
    'signup-step2': {
      title: 'Finalize seu cadastro',
      subtitle: 'Últimos dados para sua conta',
      icon: Check,
      progress: 100
    }
  }), [cpf, existingUsers]);

  const currentStep = stepConfig[step];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentStep.title}
              </h1>
              <p className="text-blue-200">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${currentStep.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <div className="space-y-6">
              {step === 'cpf' && (
                <>
                  <ValidatedInput
                    name="cpf"
                    type="tel"
                    inputMode="numeric"
                    value={cpf}
                    onChange={handleCPFChange}
                    onBlur={handleCPFBlur}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    disabled={isLoading || fieldValidations.cpf.status === 'checking'}
                  />

                  <button
                    onClick={() => {
                      const validation = updateFieldValidation('cpf', cpf);
                      const numbers = cpf.replace(/\D/g, '');
                      if (validation.status === 'valid' && numbers.length === 11) {
                        checkCPF(numbers);
                      }
                    }}
                    disabled={isLoading || fieldValidations.cpf.status !== 'valid'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {fieldValidations.cpf.status === 'checking' ? 'Verificando...' : 'Continuar'}
                    {fieldValidations.cpf.status !== 'checking' && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </>
              )}

              {step === 'login' && (
                <>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-blue-200 text-sm">CPF</p>
                    <p className="text-white font-mono">{cpf}</p>
                  </div>

                  <ValidatedInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Digite sua senha"
                    icon={Lock}
                    disabled={isLoading}
                    showToggle={true}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />

                  <div className="text-right">
                    <button className="text-blue-300 hover:text-blue-200 text-sm transition-colors">
                      Esqueceu a senha?
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </button>
                    <button
                      onClick={handleLogin}
                      disabled={isLoading || fieldValidations.password.status !== 'valid'}
                      className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </>
              )}

              {step === 'signup-step1' && (
                <>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-blue-200 text-sm">CPF</p>
                    <p className="text-white font-mono">{cpf}</p>
                  </div>

                  <ValidatedInput
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Nome completo"
                    icon={User}
                    disabled={isLoading}
                  />

                  <div className="relative">
                    <ValidatedInput
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                      icon={Calendar}
                      disabled={isLoading}
                    />
                    <label className="absolute left-12 -top-2 text-xs text-blue-200 bg-slate-800 px-2 rounded">
                      Data de nascimento
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </button>
                    <button
                      onClick={handleSignupStep1}
                      disabled={isLoading || fieldValidations.name.status !== 'valid' || fieldValidations.birthDate.status !== 'valid'}
                      className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              )}

              {step === 'signup-step2' && (
                <>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-blue-200 text-sm">Dados pessoais</p>
                    <p className="text-white">{formData.name}</p>
                    <p className="text-blue-200 text-sm mt-1">{cpf}</p>
                  </div>

                  <ValidatedInput
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="seu@email.com"
                    icon={Mail}
                    disabled={isLoading}
                  />

                  <ValidatedInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Crie uma senha forte"
                    icon={Lock}
                    disabled={isLoading}
                    showToggle={true}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm disabled:opacity-50 flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </button>
                    <button
                      onClick={handleSignupComplete}
                      disabled={isLoading || fieldValidations.email.status !== 'valid' || fieldValidations.password.status !== 'valid'}
                      className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Criando conta...' : 'Criar Conta'}
                      {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </>
              )}

              {/* Global Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-300 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20 animate-pulse">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-blue-300 text-xs">
                Ao continuar, você concorda com nossos{' '}
                <button className="text-blue-200 hover:text-white transition-colors underline">
                  Termos de Uso
                </button>{' '}
                e{' '}
                <button className="text-blue-200 hover:text-white transition-colors underline">
                  Política de Privacidade
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
