
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
    <div className="bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-lg rounded-2xl p-6 mb-4 shadow-2xl border border-white/40 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {showGrowth && (
            <Badge 
              variant="outline" 
              className={`${isPositiveGrowth ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'} 
                         flex items-center px-3 py-1 ml-3 text-xs font-semibold shadow-sm`}
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
          className="p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100/80 shadow-sm" 
          onClick={() => setHideValues(!hideValues)}
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent drop-shadow-sm">
          {formatCurrency(balance, hideValues)}
        </p>
      </div>
      
      <div className="flex justify-between border-t border-gray-200/60 pt-4">
        {(leftLabel && leftValue !== undefined) && (
          <div>
            <p className="text-lg font-bold flex items-center gap-2 text-gray-800">
              <span>{leftValue}</span>
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider">{leftLabel}</span>
            </p>
          </div>
        )}
        
        {(!showGrowth && rightLabel && rightValue !== undefined) && (
          <div className="text-right">
            <p className="text-lg font-bold flex items-center gap-2 justify-end text-gray-800">
              <span>{rightValue}</span>
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider">{rightLabel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
