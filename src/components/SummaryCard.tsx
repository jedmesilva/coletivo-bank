
import React from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatPercentage } from '@/utils/formatCurrency';
import { Badge } from './ui/badge';

interface SummaryCardProps {
  title: string;
  balance: number;
  leftLabel?: string;
  leftValue?: string | number;
  rightLabel?: string;
  rightValue?: string | number;
  showGrowth?: boolean;
  growthValue?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  balance,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  showGrowth = false,
  growthValue = 0,
}) => {
  const { hideValues, setHideValues } = useApp();
  const isPositiveGrowth = growthValue >= 0;
  
  return (
    <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          {showGrowth && (
            <Badge 
              variant="outline" 
              className={`${isPositiveGrowth ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} 
                         flex items-center px-2 py-0.5 ml-3 text-xs font-medium`}
            >
              {isPositiveGrowth ? (
                <TrendingUp className="mr-1" size={14} />
              ) : (
                <TrendingDown className="mr-1" size={14} />
              )}
              {hideValues ? "***%" : formatPercentage(growthValue, hideValues)}
            </Badge>
          )}
        </div>
        <button 
          className="p-1.5 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100" 
          onClick={() => setHideValues(!hideValues)}
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {formatCurrency(balance, hideValues)}
        </p>
      </div>
      
      <div className="flex justify-between border-t border-gray-100 pt-4">
        {(leftLabel && leftValue !== undefined) && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">{leftLabel}</p>
            <p className="text-lg font-bold">{leftValue}</p>
          </div>
        )}
        
        {(!showGrowth && rightLabel && rightValue !== undefined) && (
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">{rightLabel}</p>
            <p className="text-lg font-bold">{rightValue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
