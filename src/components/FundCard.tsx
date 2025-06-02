
import React from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { Fund } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatPercentage } from '@/utils/formatCurrency';
import { Badge } from './ui/badge';

interface FundCardProps {
  fund: Fund;
  onClick: () => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, onClick }) => {
  const { hideValues, handleDepositClick } = useApp();
  
  // Determine if growth is positive or negative for color styling
  const isPositiveGrowth = fund.growth >= 0;
  
  return (
    <div 
      className="bg-white rounded-2xl p-4 mb-4 cursor-pointer shadow-sm hover:shadow-lg 
                 transition-all duration-200 border border-gray-200 hover:border-gray-300
                 hover:scale-[1.01] ease-out"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Ícone do fundo */}
        <div className="w-16 h-16 rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
          <img 
            src={fund.image} 
            alt={fund.name} 
            className="w-full h-full object-cover aspect-square" 
          />
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {fund.name}
          </h4>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {fund.description}
          </p>
          
          {/* Métricas */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-green-600 font-semibold">
                {hideValues ? "***%" : formatPercentage(fund.growth, hideValues)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users size={12} />
              <span>{fund.members.length} Membros</span>
            </div>
            <span className="text-gray-500 text-xs">Desde {fund.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
