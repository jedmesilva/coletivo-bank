# 🔑 Configuração de Secrets do GitHub

Para o build automático funcionar, você precisa configurar um secret no GitHub:

## Como configurar:

### 1. Criar conta Expo (gratuita)
1. Vá em https://expo.dev
2. Crie uma conta gratuita
3. Confirme o email

### 2. Gerar token Expo
1. Vá em https://expo.dev/accounts/[seu-usuario]/settings/access-tokens
2. Clique em "Create Token"
3. Nome: "GitHub Actions"
4. Copie o token gerado

### 3. Adicionar secret no GitHub
1. Vá no seu repositório GitHub
2. Settings → Secrets and variables → Actions
3. Clique "New repository secret"
4. Nome: `EXPO_TOKEN`
5. Valor: cole o token do Expo
6. Clique "Add secret"

## Alternativa sem Expo Token:

Se não quiser criar conta Expo, use este workflow mais simples:

```yaml
name: Simple APK Build

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
    - uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'
    - uses: android-actions/setup-android@v3
    
    - name: Create app
      run: |
        npx create-expo-app@latest . --template blank --no-install
        npm install
        
    - name: Build
      run: |
        npx expo prebuild --platform android
        cd android && ./gradlew assembleRelease
        
    - name: Upload
      uses: actions/upload-artifact@v4
      with:
        name: apk
        path: android/app/build/outputs/apk/release/*.apk
```

Substitua o conteúdo de `.github/workflows/build-android.yml` por este código se preferir não usar Expo Token.