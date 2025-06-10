
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Fund } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface FundCardProps {
  fund: Fund;
  onClick: () => void;
}

const FundCard: React.FC<FundCardProps> = ({ fund, onClick }) => {
  const { hideValues } = useApp();
  
  return (
    <div 
      className="bg-white rounded-xl p-4 mb-4 cursor-pointer shadow-sm grow-animation"
      onClick={onClick}
    >
      <div className="flex mb-4">
        <div className="mr-4">
          <img 
            src={fund.image} 
            alt={fund.name} 
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Saldo</p>
              <p className="text-2xl font-bold">
                {formatCurrency(fund.balance, hideValues)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">Últimos 30 dias</p>
              <p className="text-xl font-bold text-green-500 flex items-center">
                <TrendingUp className="mr-1" size={18} /> 
                {hideValues ? "***%" : `+${fund.growth}%`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-1">{fund.name}</h3>
      <p className="text-gray-600 mb-3 text-sm">{fund.description}</p>
      <div className="flex justify-between text-sm">
        <p className="font-bold">{fund.members.length} Membros</p>
        <p className="text-gray-500">Desde {fund.date}</p>
      </div>
    </div>
  );
};

export default FundCard;
