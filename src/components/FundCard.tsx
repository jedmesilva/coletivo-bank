
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
                 hover:scale-[1.01] ease-out"
      onClick={onClick}
    >
      <div className="flex items-start mb-4">
        <div className="mr-4 relative">
          <div className="relative">
            <img 
              src={fund.image} 
              alt={fund.name} 
              className="w-16 h-16 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <Badge variant="outline" className={`${isPositiveGrowth ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} flex items-center px-1.5 py-0.5 text-xs font-medium`}>
                <TrendingUp className={`${isPositiveGrowth ? '' : 'rotate-180'} mr-0.5`} size={12} />
                {hideValues ? "***%" : formatPercentage(fund.growth, hideValues)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 line-clamp-1">{fund.name}</h3>
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{fund.description}</p>
          
          <div className="flex items-center text-sm mt-1 text-gray-600">
            <Users size={14} className="mr-1 opacity-70" />
            <span className="font-medium">{fund.members.length} Membros</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-500">Desde {fund.date}</span>
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
              Depositar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
