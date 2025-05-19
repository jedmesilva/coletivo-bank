
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, DollarSign } from 'lucide-react';

export default function IconScroller() {
  const [currentIcon, setCurrentIcon] = useState<'arrow' | 'dollar'>('arrow');
  const [animationState, setAnimationState] = useState<'idle' | 'leaving' | 'entering'>('idle');
  
  // Referência para o elemento que está saindo
  const leavingRef = useRef<HTMLDivElement>(null);
  // Referência para o elemento que está entrando
  const enteringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Inicia animação de saída
      setAnimationState('leaving');
      
      // Depois de completar a animação de saída, prepara a entrada
      // Reduziu de 400ms para 200ms - animação mais rápida
      setTimeout(() => {
        setCurrentIcon(prev => prev === 'arrow' ? 'dollar' : 'arrow');
        
        // Pequeno atraso para garantir que não haja sobreposição
        setTimeout(() => {
          setAnimationState('entering');
          
          // Volta para o estado de repouso após a entrada
          // Reduziu de 400ms para 200ms - animação mais rápida
          setTimeout(() => {
            setAnimationState('idle');
          }, 200);
        }, 20);
      }, 200);
    }, 10000); // Aumentou de 3000ms para 10000ms (10 segundos)
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-[18px] w-[18px] mr-2 relative overflow-hidden">
      {/* Container do ícone visível/saindo */}
      <div 
        ref={leavingRef}
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-[200ms] ease-in-out ${
          animationState === 'leaving' ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {currentIcon === 'arrow' ? (
          <ArrowUp size={18} className="text-white" />
        ) : (
          <DollarSign size={18} className="text-white" />
        )}
      </div>
      
      {/* Container do ícone entrando */}
      <div 
        ref={enteringRef}
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-[200ms] ease-in-out ${
          animationState === 'idle' ? 'translate-y-full' : 
          animationState === 'entering' ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {currentIcon === 'arrow' ? (
          <DollarSign size={18} className="text-white" />
        ) : (
          <ArrowUp size={18} className="text-white" />
        )}
      </div>
    </div>
  );
}
