
import { useState, useEffect } from 'react';
import { DollarSign, ArrowUp } from 'lucide-react';

export default function IconScroller() {
  // Define os dois tipos de ícones (adaptado para o tamanho correto)
  const iconTypes = {
    dollar: <DollarSign size={18} className="text-white" />,
    arrow: <ArrowUp size={18} className="text-white" />
  };

  // Estado para controlar a coluna de ícones
  const [iconColumn, setIconColumn] = useState([
    { id: 'top', type: 'dollar', position: -1 },     // Fora da visão (topo)
    { id: 'visible', type: 'arrow', position: 0 },   // Visível para o usuário (meio)
    { id: 'bottom', type: 'dollar', position: 1 }    // Aguardando para entrar (abaixo)
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Mover todos os ícones uma posição para cima
      setIconColumn(prevColumn => {
        // Criar um novo array para não mutar o estado diretamente
        const newColumn = [...prevColumn];
        
        // Determinar o próximo tipo de ícone (alternando)
        // Se o último na fila for dollar, o próximo será arrow e vice-versa
        const lastType = newColumn[2].type;
        const newType = lastType === 'dollar' ? 'arrow' : 'dollar';
        
        // Ícone que estava no topo sai da lista
        // Ícone visível move para o topo
        // Ícone de baixo se torna visível
        // Novo ícone entra na posição de baixo
        return [
          { id: newColumn[1].id, type: newColumn[1].type, position: -1 },  // Move para cima (fora)
          { id: newColumn[2].id, type: newColumn[2].type, position: 0 },   // Agora visível
          { id: `bottom-${Date.now()}`, type: newType, position: 1 }       // Novo ícone abaixo
        ];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[18px] w-[18px] mr-2 relative overflow-hidden">
      {iconColumn.map(icon => (
        <div
          key={icon.id}
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(${icon.position * 100}%)`,
          }}
        >
          {iconTypes[icon.type]}
        </div>
      ))}
    </div>
  );
}
