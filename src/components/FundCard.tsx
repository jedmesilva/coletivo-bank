
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
      className="bg-white rounded-xl p-5 mb-4 cursor-pointer shadow-sm hover:shadow-md 
                 transition-all duration-300 border border-gray-100 hover:border-primary/20
                 hover:scale-[1.01] ease-out h-full flex flex-col"
      onClick={onClick}
    >
      <div className="mb-4 flex-1">
        <div className="flex gap-3 mb-3">
          <img 
            src={fund.image} 
            alt={fund.name} 
            className="w-16 h-16 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
          />
          <div className="flex-1 self-center">
            <h3 className="text-xl font-bold mb-1 line-clamp-1">{fund.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{fund.description}</p>
          </div>
        </div>
        
        {/* Horizontal row of stats */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="outline" className={`${isPositiveGrowth ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} flex items-center px-2 py-1 text-xs font-medium shadow-sm`}>
            <TrendingUp className={`${isPositiveGrowth ? '' : 'rotate-180'} mr-1`} size={12} />
            {hideValues ? "***%" : formatPercentage(fund.growth, hideValues)}
          </Badge>
          
          <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            <Users size={12} className="mr-1 opacity-70" />
            <span>{fund.members.length} Membros</span>
          </div>
          
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
            Desde {fund.date}
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Saldo</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(fund.balance, hideValues)}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              className="text-xs bg-primary/10 text-primary font-medium py-1.5 px-3 rounded-full
                      hover:bg-primary/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDepositClick(fund.id);
              }}
            >
              Aportar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
