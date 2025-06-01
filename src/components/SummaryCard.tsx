
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
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 shadow-lg border border-white/30 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {showGrowth && (
            <Badge 
              variant="outline" 
              className={`${isPositiveGrowth ? 'text-green-200 bg-green-900/30 border-green-400/50' : 'text-red-200 bg-red-900/30 border-red-400/50'} 
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
          className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10" 
          onClick={() => setHideValues(!hideValues)}
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-4xl font-bold text-white">
          {formatCurrency(balance, hideValues)}
        </p>
      </div>
      
      <div className="flex justify-between border-t border-white/20 pt-4">
        {(leftLabel && leftValue !== undefined) && (
          <div>
            <p className="text-lg font-bold flex items-center gap-2 text-white">
              <span>{leftValue}</span>
              <span className="text-xs text-white/70 uppercase font-medium tracking-wide">{leftLabel}</span>
            </p>
          </div>
        )}
        
        {(!showGrowth && rightLabel && rightValue !== undefined) && (
          <div className="text-right">
            <p className="text-lg font-bold flex items-center gap-2 justify-end text-white">
              <span>{rightValue}</span>
              <span className="text-xs text-white/70 uppercase font-medium tracking-wide">{rightLabel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
