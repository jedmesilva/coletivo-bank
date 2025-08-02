#!/bin/bash

echo "🚀 Iniciando Coletivo Bank React Native..."

# Verificar se existe configuração React Native
if [ -f "package-react-native.json" ]; then
    echo "📱 Usando configuração React Native..."
    
    # Backup do package.json atual
    if [ -f "package.json" ] && [ ! -f "package-web.json" ]; then
        cp package.json package-web.json
        echo "💾 Backup do package.json web criado"
    fi
    
    # Usar configuração React Native
    cp package-react-native.json package.json
    
    # Instalar dependências React Native
    echo "📦 Instalando dependências..."
    npm install
    
    echo "✅ Dependências instaladas!"
    echo ""
    echo "🎯 Para executar o app:"
    echo "   npm start          - Iniciar Expo"
    echo "   npm run android    - Executar no Android"
    echo "   npm run ios        - Executar no iOS"
    echo ""
    echo "🔨 Para build:"
    echo "   npm run build:android:apk  - Gerar APK"
    echo ""
    
else
    echo "❌ Arquivo package-react-native.json não encontrado!"
    echo "Execute o projeto normalmente com npm run dev"
fi