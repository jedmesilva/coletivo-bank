# 🚀 Deploy do Coletivo Bank - React Native

## ✅ STATUS: PRONTO PARA DEPLOY!

Sua aplicação React Native está completamente configurada e pronta para o GitHub Actions fazer o build automático do APK Android.

## 📋 Checklist Completo

### ✅ Backend Flask (Funcionando)
- [x] API Flask rodando na porta 5000
- [x] Banco PostgreSQL configurado
- [x] Autenticação com Flask-Login
- [x] Endpoints de fundos e depósitos
- [x] CORS configurado para React Native

### ✅ React Native App (Pronto)
- [x] Estrutura completa do Expo
- [x] 5 telas principais criadas
- [x] Navegação Stack + Tabs
- [x] Sistema de autenticação
- [x] Context API para estado global
- [x] AsyncStorage para persistência
- [x] UI com Material Design

### ✅ GitHub Actions (Configurado)
- [x] Workflow para build APK
- [x] Build automático no push
- [x] Release automática com APK
- [x] Configuração Android completa

## 🎯 Como Fazer o Deploy

### 1. Suba para o GitHub
```bash
git add .
git commit -m "feat: Complete React Native app with Flask backend"
git push origin main
```

### 2. GitHub Actions Automático
O workflow `.github/workflows/build-android.yml` irá:
- ✅ Instalar Node.js e Android SDK
- ✅ Instalar Expo CLI e dependências
- ✅ Gerar APK Android automaticamente
- ✅ Criar release com download do APK
- ✅ Upload do APK como artefato

### 3. Download do APK
Após o build (5-10 minutos):
- Vá em **Actions** no GitHub
- Clique no build mais recente
- Baixe o artefato **android-apk**
- Ou vá em **Releases** para download direto

## 📱 Instalação no Android

1. **Baixe o APK** do GitHub Releases
2. **Habilite fontes desconhecidas:**
   - Configurações → Segurança → Fontes desconhecidas
3. **Instale o APK** baixado
4. **Configure a API:**
   - Edite `context/AuthContext.tsx`
   - Altere `API_BASE_URL` para sua URL do Replit

## 🔧 Estrutura do App

### Telas Principais
- **LoginScreen** - Autenticação de usuários
- **RegisterScreen** - Cadastro de novos usuários  
- **HomeScreen** - Dashboard com fundos recentes
- **FundsScreen** - Lista completa de fundos + depósitos
- **AccountScreen** - Perfil e chave PIX
- **CreateFundScreen** - Criar novos fundos

### Funcionalidades
- 🔐 **Login/Registro** completo
- 💰 **Criar fundos** colaborativos
- 💸 **Fazer depósitos** nos fundos
- 📊 **Visualizar progresso** das metas
- 👤 **Gerenciar perfil** e conta
- 🔑 **Chave PIX** personalizada (@ColetivoBank.app)

## 🎨 Design System

### Cores
- **Verde Principal:** `#10b981`
- **Fundo:** `#f8fafc` 
- **Texto:** `#1f2937`
- **Secundário:** `#6b7280`

### Componentes
- **Cards** com sombra sutil
- **Botões** com ícones Material
- **Inputs** com bordas arredondadas
- **Tab Navigation** inferior

## ⚡ Próximos Passos (Opcional)

Após o deploy básico, você pode adicionar:

1. **Integração PIX real** (Asaas API)
2. **Notificações push** 
3. **Chat entre usuários**
4. **Gráficos e relatórios**
5. **Versão iOS** (App Store)

## 🐛 Troubleshooting

### Se o build falhar:
1. Verifique os logs no GitHub Actions
2. Confirme que todos arquivos foram commitados
3. Verifique se o `app.json` está correto

### Se o app não conectar na API:
1. Verifique se o backend Flask está rodando
2. Confirme a URL em `AuthContext.tsx`
3. Teste as APIs com curl/Postman

---

## 🎉 ESTÁ PRONTO!

Você pode fazer o **git push** agora que o GitHub Actions irá:
1. Fazer build automático
2. Gerar o APK Android
3. Disponibilizar para download

**Tempo estimado do build:** 5-10 minutos

**Resultado:** APK pronto para instalar em qualquer Android!