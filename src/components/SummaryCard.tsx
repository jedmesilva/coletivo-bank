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
  className?: string;
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
  className = "",
}) => {
  const { hideValues, setHideValues } = useApp();
  const isPositiveGrowth = growthValue >= 0;

  return (
    <div className={`bg-white rounded-xl p-3 sm:p-4 mb-4 shadow-sm border border-gray-100 w-full max-w-full overflow-hidden ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center flex-wrap">
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
          {showGrowth && (
            <Badge 
              variant="outline" 
              className={`${isPositiveGrowth ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} 
                         flex items-center px-2 py-0.5 ml-2 text-xs font-medium`}
            >
              {isPositiveGrowth ? (
                <TrendingUp className="mr-1" size={12} />
              ) : (
                <TrendingDown className="mr-1" size={12} />
              )}
              {hideValues ? "***%" : formatPercentage(growthValue, hideValues)}
            </Badge>
          )}
        </div>
        <button 
          className="p-1.5 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 ml-1 flex-shrink-0" 
          onClick={() => setHideValues(!hideValues)}
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="mb-4 sm:mb-6">
        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {formatCurrency(balance, hideValues)}
        </p>
      </div>

      <div className="flex justify-between border-t border-gray-100 pt-3 sm:pt-4">
        {(leftLabel && leftValue !== undefined) && (
          <div className="max-w-[50%]">
            <p className="text-base sm:text-lg font-bold flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="whitespace-nowrap">{leftValue}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium tracking-wide">{leftLabel}</span>
            </p>
          </div>
        )}

        {(!showGrowth && rightLabel && rightValue !== undefined) && (
          <div className="max-w-[50%] text-right">
            <p className="text-base sm:text-lg font-bold flex items-center gap-1 sm:gap-2 justify-end flex-wrap">
              <span className="whitespace-nowrap">{rightValue}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium tracking-wide">{rightLabel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;