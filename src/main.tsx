
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Função para ajustar a altura da viewport em dispositivos móveis
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Debug para verificar se o suporte a safe-area está disponível
  if (window.CSS && CSS.supports('padding: env(safe-area-inset-top)')) {
    console.debug('🚀 Safe area support detected in mobile browser');
  }
};

// Configurar a altura da viewport
setViewportHeight();

// Recalcular quando a janela for redimensionada ou o dispositivo mudar de orientação
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
