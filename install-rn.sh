#!/bin/bash

echo "🚀 Instalando dependências do React Native..."

# Backup do package.json atual
cp package.json package-web.json

# Usar configuração do React Native  
cp package-react-native.json package.json

# Instalar dependências
npm install

echo "✅ Dependências do React Native instaladas!"
echo "📱 Para executar: npm start"
echo "🔧 Para build: npm run build:android:apk"