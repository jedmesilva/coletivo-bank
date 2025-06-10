
import React from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface SummaryCardProps {
  title: string;
  balance: number;
  leftLabel?: string;
  leftValue?: string | number;
  centerLabel?: string;
  centerValue?: string | number;
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
  centerLabel,
  centerValue,
  rightLabel,
  rightValue,
  showGrowth = false,
  growthValue = 0,
}) => {
  const { hideValues, setHideValues } = useApp();

  return (
    <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <button 
          className="p-1 text-gray-600 hover:text-gray-900 transition-colors" 
          onClick={() => setHideValues(!hideValues)}
        >
          {hideValues ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>
      <div className="mb-6">
        <p className="text-4xl font-bold">
          {formatCurrency(balance, hideValues)}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {(leftLabel && leftValue !== undefined) && (
          <div className="text-center">
            <p className="text-sm text-gray-500">{leftLabel}</p>
            <p className="text-lg font-bold">{leftValue}</p>
          </div>
        )}
        
        {(centerLabel && centerValue !== undefined) && (
          <div className="text-center">
            <p className="text-sm text-gray-500">{centerLabel}</p>
            <p className="text-lg font-bold">
              {typeof centerValue === 'string' && centerValue.startsWith('R$') 
                ? (hideValues ? 'R$ ***' : centerValue)
                : centerValue}
            </p>
          </div>
        )}
        
        {showGrowth ? (
          <div className="flex items-center justify-center text-green-500">
            <TrendingUp className="mr-1" size={20} />
            <p className="text-lg font-bold">
              {hideValues ? "***%" : `+${growthValue}%`}
            </p>
          </div>
        ) : (
          (rightLabel && rightValue !== undefined) && (
            <div className="text-center">
              <p className="text-sm text-gray-500">{rightLabel}</p>
              <p className="text-lg font-bold">{rightValue}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
