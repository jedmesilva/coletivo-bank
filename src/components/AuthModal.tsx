import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Check, AlertCircle, Mail, Calendar, ArrowLeft, CheckCircle, X } from 'lucide-react';

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

  // Refs para debounce
  const validationTimeouts = useRef<{[key: string]: NodeJS.Timeout}>({});

  // Sistema de validação para cada campo
  const [fieldValidation, setFieldValidation] = useState({
    cpf: { isValid: null, message: '', touched: false },
    name: { isValid: null, message: '', touched: false },
    birthDate: { isValid: null, message: '', touched: false },
    email: { isValid: null, message: '', touched: false },
    password: { isValid: null, message: '', touched: false }
  });

  const existingUsers = useMemo(() => ({
    '12345678901': { name: 'João Silva', email: 'joao@email.com' },
    '98765432100': { name: 'Maria Santos', email: 'maria@email.com' }
  }), []);

  // Função para validar campo
  const validateField = useCallback((fieldName, value) => {
    let validation = { isValid: null, message: '' };

    switch (fieldName) {
      case 'cpf':
        const numbers = value.replace(/\D/g, '');
        if (!value) {
          validation = { isValid: null, message: '' };
        } else if (numbers.length < 11) {
          validation = { isValid: false, message: 'CPF incompleto' };
        } else if (/^(\d)\1{10}$/.test(numbers)) {
          validation = { isValid: false, message: 'CPF inválido' };
        } else {
          validation = { isValid: true, message: 'CPF válido' };
        }
        break;

      case 'name':
        if (!value) {
          validation = { isValid: false, message: 'Nome é obrigatório' };
        } else if (value.length < 2) {
          validation = { isValid: false, message: 'Nome muito curto' };
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
          validation = { isValid: false, message: 'Nome deve conter apenas letras' };
        } else {
          validation = { isValid: true, message: 'Nome válido' };
        }
        break;

      case 'birthDate':
        if (!value) {
          validation = { isValid: false, message: 'Data de nascimento é obrigatória' };
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            validation = { isValid: false, message: 'Você deve ser maior de 18 anos' };
          } else {
            validation = { isValid: true, message: 'Data válida' };
          }
        }
        break;

      case 'email':
        if (!value) {
          validation = { isValid: false, message: 'Email é obrigatório' };
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          validation = { isValid: false, message: 'Formato de email inválido' };
        } else {
          validation = { isValid: true, message: 'Email válido' };
        }
        break;

      case 'password':
        if (!value) {
          validation = { isValid: false, message: 'Senha é obrigatória' };
        } else if (value.length < 6) {
          validation = { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          validation = { isValid: false, message: 'Senha deve ter maiúscula, minúscula e número' };
        } else {
          validation = { isValid: true, message: 'Senha forte' };
        }
        break;
    }

    return validation;
  }, []);

  // Função para atualizar validação de campo com debounce
  const updateFieldValidation = useCallback((fieldName, value, touched = true, immediate = false) => {
    if (immediate) {
      const validation = validateField(fieldName, value);
      setFieldValidation(prev => ({
        ...prev,
        [fieldName]: { ...validation, touched }
      }));
      return validation;
    }

    // Clear previous timeout
    if (validationTimeouts.current[fieldName]) {
      clearTimeout(validationTimeouts.current[fieldName]);
    }

    // Set new timeout for validation
    validationTimeouts.current[fieldName] = setTimeout(() => {
      const validation = validateField(fieldName, value);
      setFieldValidation(prev => ({
        ...prev,
        [fieldName]: { ...validation, touched }
      }));
    }, 500);

    return null;
  }, [validateField]);

  // Função de validação de CPF simplificada
  const isValidCPF = useCallback((cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    return true; // Implementar validação completa em produção
  }, []);

  const formatCPF = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  const checkCPF = useCallback(async (cpfNumbers) => {
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (existingUsers[cpfNumbers]) {
        setStep('login');
      } else {
        setStep('signup-step1');
      }
    } catch (err) {
      setError('Erro ao verificar CPF. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [existingUsers]);

  const handleCPFChange = useCallback((e) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      const formattedCPF = formatCPF(numbers);
      setCpf(formattedCPF);
      setError('');
      
      // Validar com debounce apenas se tiver conteúdo
      if (formattedCPF.trim()) {
        updateFieldValidation('cpf', formattedCPF, false);
      }
      
      // Auto-verificar CPF completo
      if (numbers.length === 11 && isValidCPF(numbers)) {
        setTimeout(() => checkCPF(numbers), 800);
      }
    }
  }, [formatCPF, isValidCPF, updateFieldValidation, checkCPF]);

  const handleCPFBlur = useCallback((e) => {
    const value = e.target.value;
    if (value.trim()) {
      updateFieldValidation('cpf', value, true, true);
    }
  }, [updateFieldValidation]);

  const handleManualCPFCheck = useCallback(() => {
    const numbers = cpf.replace(/\D/g, '');
    const validation = updateFieldValidation('cpf', cpf, true, true);
    
    if (!validation || !validation.isValid) {
      return;
    }
    checkCPF(numbers);
  }, [cpf, updateFieldValidation, checkCPF]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    // Limpar timeout anterior se existir
    if (validationTimeouts.current[name]) {
      clearTimeout(validationTimeouts.current[name]);
    }
    
    // Validar com debounce apenas se tiver conteúdo
    if (value.trim()) {
      validationTimeouts.current[name] = setTimeout(() => {
        updateFieldValidation(name, value, false);
      }, 500); // 500ms de debounce
    } else {
      // Limpar validação se campo estiver vazio
      setFieldValidation(prev => ({
        ...prev,
        [name]: { isValid: null, message: '', touched: false }
      }));
    }
  }, [updateFieldValidation]);

  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (value.trim()) {
      updateFieldValidation(name, value, true, true);
    }
  }, [updateFieldValidation]);

  const handleLogin = useCallback(async () => {
    if (!formData.password) {
      updateFieldValidation('password', formData.password, true, true);
      return;
    }
    
    setIsLoading(true);
    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login:', { cpf, password: formData.password });
      // Aqui você redirecionaria para a aplicação
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  }, [cpf, formData.password, updateFieldValidation]);

  const handleSignupStep1 = useCallback(() => {
    // Validar todos os campos obrigatórios
    const nameValidation = updateFieldValidation('name', formData.name, true, true);
    const birthDateValidation = updateFieldValidation('birthDate', formData.birthDate, true, true);
    
    if (!nameValidation?.isValid || !birthDateValidation?.isValid) {
      return;
    }
    
    setStep('signup-step2');
  }, [formData.name, formData.birthDate, updateFieldValidation]);

  const handleSignupComplete = useCallback(async () => {
    // Validar todos os campos
    const emailValidation = updateFieldValidation('email', formData.email, true, true);
    const passwordValidation = updateFieldValidation('password', formData.password, true, true);
    
    if (!emailValidation?.isValid || !passwordValidation?.isValid) {
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Cadastro completo:', { cpf, ...formData });
      // Aqui você faria o cadastro e redirecionaria
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
    setFieldValidation({
      cpf: { isValid: null, message: '', touched: false },
      name: { isValid: null, message: '', touched: false },
      birthDate: { isValid: null, message: '', touched: false },
      email: { isValid: null, message: '', touched: false },
      password: { isValid: null, message: '', touched: false }
    });
  }, [step]);

  // Limpar timeouts ao desmontar o componente
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Reset validation when step changes
  useEffect(() => {
    setFieldValidation({
      cpf: { isValid: null, message: '', touched: false },
      name: { isValid: null, message: '', touched: false },
      birthDate: { isValid: null, message: '', touched: false },
      email: { isValid: null, message: '', touched: false },
      password: { isValid: null, message: '', touched: false }
    });
  }, [step]);

  // Componente para renderizar input com validação
  const ValidatedInput = ({ 
    name, 
    type = 'text', 
    placeholder = '', 
    value, 
    onChange, 
    onBlur, 
    icon: Icon, 
    disabled = false,
    showToggle = false,
    onToggle = () => {},
    showPassword: showPass = false,
    maxLength,
    inputMode,
    max
  }) => {
    const validation = fieldValidation[name] || { isValid: null, message: '', touched: false };
    const hasError = validation.touched && validation.isValid === false;
    const hasSuccess = validation.touched && validation.isValid === true;
    
    return (
      <div className="space-y-2">
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={`h-5 w-5 transition-colors ${
                hasError ? 'text-red-400' : 
                hasSuccess ? 'text-green-400' : 
                'text-blue-300'
              }`} />
            </div>
          )}
          <input
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
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${showToggle ? 'pr-12' : 'pr-4'} py-3 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
              hasError ? 
                'bg-red-900/20 border-2 border-red-500/50 focus:ring-red-400' :
              hasSuccess ?
                'bg-green-900/20 border-2 border-green-500/50 focus:ring-green-400' :
                'bg-white/10 border border-white/20 focus:ring-blue-400'
            } ${name === 'cpf' ? 'text-center text-lg tracking-wider' : ''}`}
          />
          
          {/* Ícone de status */}
          {validation.touched && validation.isValid !== null && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showToggle ? (
                <div className="flex items-center space-x-2">
                  {validation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <X className="h-4 w-4 text-red-400" />
                  )}
                  <button
                    type="button"
                    onClick={onToggle}
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              ) : (
                <>
                  {validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <X className="h-5 w-5 text-red-400" />
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Loading spinner para CPF */}
          {name === 'cpf' && isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Mensagem de validação */}
        {validation.touched && validation.message && (
          <div className={`flex items-center space-x-2 text-sm p-2 rounded-lg transition-all duration-300 ${
            validation.isValid ? 
              'text-green-300 bg-green-900/20 border border-green-500/20' :
              'text-red-300 bg-red-900/20 border border-red-500/20'
          }`}>
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{validation.message}</span>
          </div>
        )}
      </div>
    );
  };

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

  const currentConfig = stepConfig[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/10 rounded-full h-1 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentConfig.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <currentConfig.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{currentConfig.title}</h1>
            <p className="text-blue-200">{currentConfig.subtitle}</p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Step: CPF Input */}
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
                  disabled={isLoading}
                />

                <button
                  onClick={handleManualCPFCheck}
                  disabled={isLoading || !fieldValidation.cpf.isValid}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verificando...' : 'Continuar'}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
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
                    disabled={isLoading || !formData.password}
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
                    disabled={isLoading || !fieldValidation.name.isValid || !fieldValidation.birthDate.isValid}
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
                    disabled={isLoading || !fieldValidation.email.isValid || !fieldValidation.password.isValid}
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
  );
}