# Coletivo Bank - React Native

Sistema de crédito coletivo desenvolvido em React Native para Android e iOS.

## 🚀 Funcionalidades

- ✅ **Autenticação de usuários** - Login e registro seguro
- ✅ **Gerenciamento de fundos** - Criação e visualização de fundos colaborativos
- ✅ **Sistema de depósitos** - Contribuições para fundos coletivos
- ✅ **Níveis de conta** - Bronze, Silver, Gold, Platinum
- ✅ **Chave PIX** - Sistema próprio @ColetivoBank.app
- ✅ **Interface responsiva** - Otimizada para mobile
- ✅ **Build automático** - GitHub Actions para APK Android

## 📱 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS - apenas macOS)

### Configuração do Projeto

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd coletivo-bank
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   # Edite context/AuthContext.tsx e altere a URL da API
   const API_BASE_URL = 'https://sua-api.replit.app/api';
   ```

4. **Execute o projeto:**
   ```bash
   # Iniciar o servidor de desenvolvimento
   npm start
   
   # Para Android
   npm run android
   
   # Para iOS
   npm run ios
   ```

## 🏗️ Build e Deploy

### Build Automático via GitHub Actions

O projeto está configurado com GitHub Actions para build automático do APK Android:

1. **Configuração automática:**
   - Push para `main` ou `master` dispara o build
   - APK é gerado automaticamente
   - Release é criada com download do APK

2. **Arquivos importantes:**
   - `.github/workflows/build-android.yml` - Configuração do GitHub Actions
   - `app.json` - Configuração do Expo
   - `eas.json` - Configuração do EAS Build

### Build Manual

Para build manual local:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Build para Android (APK)
eas build --platform android --profile preview

# Build para produção (AAB)
eas build --platform android --profile production
```

## 🏛️ Arquitetura do App

### Estrutura de Pastas
```
├── App.tsx                 # Componente principal e navegação
├── context/               
│   └── AuthContext.tsx    # Contexto de autenticação
├── screens/               # Telas do aplicativo
│   ├── LoginScreen.tsx    
│   ├── RegisterScreen.tsx 
│   ├── HomeScreen.tsx     
│   ├── FundsScreen.tsx    
│   ├── AccountScreen.tsx  
│   └── CreateFundScreen.tsx
├── assets/                # Ícones e imagens
├── .github/workflows/     # GitHub Actions
└── app.json              # Configuração do Expo
```

### Navegação
- **Stack Navigator** - Para fluxo de autenticação
- **Tab Navigator** - Para navegação principal (Home, Fundos, Conta)
- **Nested Navigation** - Combinação de stack e tabs

### Estado Global
- **AuthContext** - Gerenciamento de autenticação e usuário logado
- **AsyncStorage** - Persistência local de dados do usuário

## 🔧 APIs e Integração

### Backend Flask
O app se conecta com o backend Flask através das seguintes APIs:

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário  
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário atual
- `GET /api/funds/` - Lista de fundos
- `POST /api/funds/` - Criar novo fundo
- `POST /api/funds/:id/deposits` - Fazer depósito

### Configuração da API
Edite o arquivo `context/AuthContext.tsx` para configurar a URL da sua API:

```typescript
const API_BASE_URL = 'https://sua-api-replit.replit.app/api';
```

## 🎨 Design System

### Cores Principais
- **Verde Principal:** `#10b981` - Botões e elementos ativos
- **Fundo:** `#f8fafc` - Cor de fundo das telas
- **Texto Principal:** `#1f2937` - Títulos e texto principal
- **Texto Secundário:** `#6b7280` - Textos auxiliares

### Componentes
- **Cards** - Design com bordas arredondadas e sombra sutil
- **Botões** - Estilo consistente com ícones do Material Icons
- **Inputs** - Bordas arredondadas com estados de foco
- **Navigation** - Tab bar inferior com ícones

## 🔒 Segurança

### Autenticação
- Login seguro com validação
- Armazenamento seguro de tokens
- Logout com limpeza de dados locais

### Dados
- Validação de entrada em todos os formulários
- Sanitização de dados antes do envio
- Tratamento de erros de API

## 📋 Checklist de Desenvolvimento

- [x] Estrutura básica do React Native
- [x] Sistema de autenticação
- [x] Navegação entre telas
- [x] Integração com API Flask
- [x] Telas principais (Home, Fundos, Conta)
- [x] Formulário de criação de fundos
- [x] Sistema de depósitos
- [x] GitHub Actions para build APK
- [x] Documentação completa

## 🚀 Próximos Passos

1. **Integração PIX** - Implementar gateway de pagamento real
2. **Notificações Push** - Alertas sobre fundos e depósitos
3. **Chat** - Comunicação entre membros do fundo
4. **Analytics** - Métricas de uso e performance
5. **Testes** - Cobertura de testes unitários e E2E

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do GitHub Actions
2. Teste localmente com `npm start`
3. Confirme se a API está funcionando
4. Verifique as configurações do `app.json`

---

**Desenvolvido com ❤️ para facilitar fundos colaborativos**