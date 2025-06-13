import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Check, AlertCircle, Mail, Calendar, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

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

  // Estados de validação individuais (exatamente como no exemplo funcional)
  const [cpfValidation, setCpfValidation] = useState({
    status: 'idle',
    message: '',
    showMessage: false
  });
  
  const [nameValidation, setNameValidation] = useState({
    status: 'idle',
    message: '',
    showMessage: false
  });
  
  const [birthDateValidation, setBirthDateValidation] = useState({
    status: 'idle',
    message: '',
    showMessage: false
  });
  
  const [emailValidation, setEmailValidation] = useState({
    status: 'idle',
    message: '',
    showMessage: false
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    status: 'idle',
    message: '',
    showMessage: false
  });

  // Refs para timeouts individuais (seguindo o padrão do exemplo)
  const cpfTimeoutRef = useRef(null);
  const nameTimeoutRef = useRef(null);
  const birthDateTimeoutRef = useRef(null);
  const emailTimeoutRef = useRef(null);
  const passwordTimeoutRef = useRef(null);
  
  // Refs para inputs
  const cpfInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const birthDateInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const existingUsers = useMemo(() => ({
    '12345678901': { name: 'João Silva', email: 'joao@email.com' },
    '98765432100': { name: 'Maria Santos', email: 'maria@email.com' }
  }), []);

  // Função para formatar CPF
  const formatCPF = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  // Funções de validação pura
  const validateCPF = useCallback((cpfNumbers) => {
    if (cpfNumbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;
    return true;
  }, []);

  // Simulação de verificação de CPF no servidor
  const checkCPFExists = useCallback(async (cpfNumbers) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return existingUsers[cpfNumbers] ? existingUsers[cpfNumbers] : null;
  }, [existingUsers]);

  // Função principal de validação de CPF com debounce (igual ao exemplo)
  const performCPFValidation = useCallback(async (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) {
      setCpfValidation({
        status: 'idle',
        message: '',
        showMessage: false
      });
      return;
    }

    if (numbers.length < 11) {
      setCpfValidation({
        status: 'incomplete',
        message: `CPF incompleto (${numbers.length}/11 dígitos)`,
        showMessage: true
      });
      return;
    }

    if (!validateCPF(numbers)) {
      setCpfValidation({
        status: 'invalid',
        message: 'CPF inválido',
        showMessage: true
      });
      return;
    }

    setCpfValidation({
      status: 'checking',
      message: 'Verificando CPF...',
      showMessage: true
    });

    try {
      const userData = await checkCPFExists(numbers);
      
      if (userData) {
        setCpfValidation({
          status: 'valid',
          message: 'CPF encontrado! Redirecionando para login...',
          showMessage: true
        });
        setTimeout(() => setStep('login'), 1500);
      } else {
        setCpfValidation({
          status: 'valid',
          message: 'CPF válido! Prosseguindo com cadastro...',
          showMessage: true
        });
        setTimeout(() => setStep('signup-step1'), 1500);
      }
    } catch (error) {
      setCpfValidation({
        status: 'invalid',
        message: 'Erro ao verificar CPF. Tente novamente.',
        showMessage: true
      });
    }
  }, [validateCPF, checkCPFExists]);

  // Validações para outros campos
  const performNameValidation = useCallback((value) => {
    if (!value.trim()) {
      setNameValidation({
        status: 'idle',
        message: '',
        showMessage: false
      });
      return;
    }

    if (value.trim().length < 3) {
      setNameValidation({
        status: 'invalid',
        message: 'Nome muito curto (mínimo 3 caracteres)',
        showMessage: true
      });
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
      setNameValidation({
        status: 'invalid',
        message: 'Nome deve conter apenas letras',
        showMessage: true
      });
      return;
    }

    setNameValidation({
      status: 'valid',
      message: 'Nome válido',
      showMessage: true
    });
  }, []);

  const performBirthDateValidation = useCallback((value) => {
    if (!value) {
      setBirthDateValidation({
        status: 'idle',
        message: '',
        showMessage: false
      });
      return;
    }

    const birth = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    
    if (age < 18) {
      setBirthDateValidation({
        status: 'invalid',
        message: 'Você deve ter pelo menos 18 anos',
        showMessage: true
      });
      return;
    }

    if (age > 120) {
      setBirthDateValidation({
        status: 'invalid',
        message: 'Data inválida',
        showMessage: true
      });
      return;
    }

    setBirthDateValidation({
      status: 'valid',
      message: 'Data válida',
      showMessage: true
    });
  }, []);

  const performEmailValidation = useCallback((value) => {
    if (!value) {
      setEmailValidation({
        status: 'idle',
        message: '',
        showMessage: false
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailValidation({
        status: 'invalid',
        message: 'Formato de email inválido',
        showMessage: true
      });
      return;
    }

    setEmailValidation({
      status: 'valid',
      message: 'Email válido',
      showMessage: true
    });
  }, []);

  const performPasswordValidation = useCallback((value) => {
    if (!value) {
      setPasswordValidation({
        status: 'idle',
        message: '',
        showMessage: false
      });
      return;
    }

    if (value.length < 6) {
      setPasswordValidation({
        status: 'invalid',
        message: 'Senha deve ter pelo menos 6 caracteres',
        showMessage: true
      });
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      setPasswordValidation({
        status: 'invalid',
        message: 'Senha deve ter maiúscula, minúscula e número',
        showMessage: true
      });
      return;
    }

    setPasswordValidation({
      status: 'valid',
      message: 'Senha forte',
      showMessage: true
    });
  }, []);

  // Handler do CPF com debounce (igual ao exemplo)
  const handleCPFChange = useCallback((e) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      const formattedValue = formatCPF(numbers);
      setCpf(formattedValue);
      setError('');
      
      // Limpar timeout anterior
      if (cpfTimeoutRef.current) {
        clearTimeout(cpfTimeoutRef.current);
      }
      
      // Agendar nova validação
      cpfTimeoutRef.current = setTimeout(() => {
        performCPFValidation(formattedValue);
      }, 500);
    }
  }, [formatCPF, performCPFValidation]);

  // Handler para quando o CPF perde o foco
  const handleCPFBlur = useCallback(() => {
    if (cpf.trim()) {
      if (cpfTimeoutRef.current) {
        clearTimeout(cpfTimeoutRef.current);
      }
      performCPFValidation(cpf);
    }
  }, [cpf, performCPFValidation]);

  // Handler para nome
  const handleNameChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    setError('');
    
    if (nameTimeoutRef.current) {
      clearTimeout(nameTimeoutRef.current);
    }
    
    nameTimeoutRef.current = setTimeout(() => {
      performNameValidation(value);
    }, 500);
  }, [performNameValidation]);

  const handleNameBlur = useCallback(() => {
    if (nameTimeoutRef.current) {
      clearTimeout(nameTimeoutRef.current);
    }
    performNameValidation(formData.name);
  }, [formData.name, performNameValidation]);

  // Handler para data de nascimento
  const handleBirthDateChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, birthDate: value }));
    setError('');
    
    if (birthDateTimeoutRef.current) {
      clearTimeout(birthDateTimeoutRef.current);
    }
    
    birthDateTimeoutRef.current = setTimeout(() => {
      performBirthDateValidation(value);
    }, 500);
  }, [performBirthDateValidation]);

  const handleBirthDateBlur = useCallback(() => {
    if (birthDateTimeoutRef.current) {
      clearTimeout(birthDateTimeoutRef.current);
    }
    performBirthDateValidation(formData.birthDate);
  }, [formData.birthDate, performBirthDateValidation]);

  // Handler para email
  const handleEmailChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    setError('');
    
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    
    emailTimeoutRef.current = setTimeout(() => {
      performEmailValidation(value);
    }, 500);
  }, [performEmailValidation]);

  const handleEmailBlur = useCallback(() => {
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    performEmailValidation(formData.email);
  }, [formData.email, performEmailValidation]);

  // Handler para senha
  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    setError('');
    
    if (passwordTimeoutRef.current) {
      clearTimeout(passwordTimeoutRef.current);
    }
    
    passwordTimeoutRef.current = setTimeout(() => {
      performPasswordValidation(value);
    }, 500);
  }, [performPasswordValidation]);

  const handlePasswordBlur = useCallback(() => {
    if (passwordTimeoutRef.current) {
      clearTimeout(passwordTimeoutRef.current);
    }
    performPasswordValidation(formData.password);
  }, [formData.password, performPasswordValidation]);

  // Funções de navegação
  const handleLogin = useCallback(async () => {
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
  }, [cpf, formData.password, passwordValidation.status]);

  const handleSignupStep1 = useCallback(() => {
    if (nameValidation.status === 'valid' && birthDateValidation.status === 'valid') {
      setStep('signup-step2');
    }
  }, [nameValidation.status, birthDateValidation.status]);

  const handleSignupComplete = useCallback(async () => {
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
  }, [cpf, formData, emailValidation.status, passwordValidation.status]);

  const handleBack = useCallback(() => {
    const transitions = {
      'login': () => { setStep('cpf'); setCpf(''); },
      'signup-step1': () => { setStep('cpf'); setCpf(''); },
      'signup-step2': () => setStep('signup-step1')
    };

    transitions[step]?.();
    setFormData({ name: '', birthDate: '', email: '', password: '' });
    setError('');
    
    // Reset validations
    setCpfValidation({ status: 'idle', message: '', showMessage: false });
    setNameValidation({ status: 'idle', message: '', showMessage: false });
    setBirthDateValidation({ status: 'idle', message: '', showMessage: false });
    setEmailValidation({ status: 'idle', message: '', showMessage: false });
    setPasswordValidation({ status: 'idle', message: '', showMessage: false });

    // Limpar timeouts
    [cpfTimeoutRef, nameTimeoutRef, birthDateTimeoutRef, emailTimeoutRef, passwordTimeoutRef].forEach(ref => {
      if (ref.current) clearTimeout(ref.current);
    });
  }, [step]);

  // Cleanup
  useEffect(() => {
    return () => {
      [cpfTimeoutRef, nameTimeoutRef, birthDateTimeoutRef, emailTimeoutRef, passwordTimeoutRef].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
    };
  }, []);

  // Funções auxiliares para determinar classes CSS (igual ao exemplo)
  const getInputClasses = useCallback((validationState, isSpecial = false) => {
    const baseClasses = `w-full pl-12 pr-12 py-4 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${isSpecial ? 'text-center text-lg tracking-wider font-mono' : ''}`;
    
    switch (validationState.status) {
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
  }, []);

  const getStatusIcon = useCallback((validationState) => {
    switch (validationState.status) {
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
  }, []);

  const getMessageClasses = useCallback((validationState) => {
    const baseClasses = "flex items-center space-x-2 text-sm p-3 rounded-lg transition-all duration-300 mt-3";
    
    switch (validationState.status) {
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
  }, []);

  const getIconClassName = useCallback((validationState) => {
    return `h-5 w-5 transition-colors ${
      validationState.status === 'invalid' ? 'text-red-400' : 
      validationState.status === 'valid' ? 'text-green-400' :
      validationState.status === 'checking' ? 'text-blue-400' :
      validationState.status === 'incomplete' ? 'text-orange-400' :
      'text-blue-300'
    }`;
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background Effects */}

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-left mb-8">
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
          <div className="space-y-4">
            {step === 'cpf' && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={getIconClassName(cpfValidation)} />
                  </div>

                  <input
                    ref={cpfInputRef}
                    type="tel"
                    inputMode="numeric"
                    value={cpf}
                    onChange={handleCPFChange}
                    onBlur={handleCPFBlur}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={getInputClasses(cpfValidation, true)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isLoading || cpfValidation.status === 'checking'}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {getStatusIcon(cpfValidation)}
                  </div>
                </div>

                {cpfValidation.showMessage && cpfValidation.message && (
                  <div className={getMessageClasses(cpfValidation)}>
                    {getStatusIcon(cpfValidation)}
                    <span>{cpfValidation.message}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    const numbers = cpf.replace(/\D/g, '');
                    if (cpfValidation.status === 'valid' && numbers.length === 11) {
                      performCPFValidation(cpf);
                    }
                  }}
                  disabled={isLoading || cpfValidation.status !== 'valid'}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {cpfValidation.status === 'checking' ? 'Verificando...' : 'Continuar'}
                  {cpfValidation.status !== 'checking' && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </>
            )}

            {step === 'login' && (
              <>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-blue-200 text-sm">CPF</p>
                  <p className="text-white font-mono">{cpf}</p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={getIconClassName(passwordValidation)} />
                  </div>

                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    placeholder="Digite sua senha"
                    className={getInputClasses(passwordValidation)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isLoading}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                    {getStatusIcon(passwordValidation)}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {passwordValidation.showMessage && passwordValidation.message && (
                  <div className={getMessageClasses(passwordValidation)}>
                    {getStatusIcon(passwordValidation)}
                    <span>{passwordValidation.message}</span>
                  </div>
                )}

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
                    disabled={isLoading || passwordValidation.status !== 'valid'}
                    className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
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

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={getIconClassName(nameValidation)} />
                  </div>

                  <input
                    ref={nameInputRef}
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    placeholder="Nome completo"
                    className={getInputClasses(nameValidation)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isLoading}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {getStatusIcon(nameValidation)}
                  </div>
                </div>

                {nameValidation.showMessage && nameValidation.message && (
                  <div className={getMessageClasses(nameValidation)}>
                    {getStatusIcon(nameValidation)}
                    <span>{nameValidation.message}</span>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className={getIconClassName(birthDateValidation)} />
                  </div>

                  <input
                    ref={birthDateInputRef}
                    type="date"
                    value={formData.birthDate}
                    onChange={handleBirthDateChange}
                    onBlur={handleBirthDateBlur}
                    max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                    className={getInputClasses(birthDateValidation)}
                    disabled={isLoading}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {getStatusIcon(birthDateValidation)}
                  </div>

                  <label className="absolute left-12 -top-2 text-xs text-blue-200 bg-slate-800 px-2 rounded">
                    Data de nascimento
                  </label>
                </div>

                {birthDateValidation.showMessage && birthDateValidation.message && (
                  <div className={getMessageClasses(birthDateValidation)}>
                    {getStatusIcon(birthDateValidation)}
                    <span>{birthDateValidation.message}</span>
                  </div>
                )}

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
                    disabled={isLoading || nameValidation.status !== 'valid' || birthDateValidation.status !== 'valid'}
                    className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
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

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={getIconClassName(emailValidation)} />
                  </div>

                  <input
                    ref={emailInputRef}
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="seu@email.com"
                    className={getInputClasses(emailValidation)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isLoading}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {getStatusIcon(emailValidation)}
                  </div>
                </div>

                {emailValidation.showMessage && emailValidation.message && (
                  <div className={getMessageClasses(emailValidation)}>
                    {getStatusIcon(emailValidation)}
                    <span>{emailValidation.message}</span>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={getIconClassName(passwordValidation)} />
                  </div>

                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    placeholder="Crie uma senha forte"
                    className={getInputClasses(passwordValidation)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isLoading}
                  />

                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                    {getStatusIcon(passwordValidation)}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {passwordValidation.showMessage && passwordValidation.message && (
                  <div className={getMessageClasses(passwordValidation)}>
                    {getStatusIcon(passwordValidation)}
                    <span>{passwordValidation.message}</span>
                  </div>
                )}

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
                    disabled={isLoading || emailValidation.status !== 'valid' || passwordValidation.status !== 'valid'}
                    className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
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

            {/* Instructions */}
            <div className="text-center">
              <p className="text-blue-300 text-sm">
                {step === 'cpf' ? 'Digite apenas os números do seu CPF' : 'Preencha todos os campos obrigatórios'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-blue-300 text-xs">
              Ao continuar, você concorda com nossos{' '}
              <button className="text-blue-200 hover:text-white transition-colors underline">
                Termos de Uso
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}