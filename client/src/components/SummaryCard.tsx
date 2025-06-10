
import React from 'react';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

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
      <div className="flex justify-between">
        {(leftLabel && leftValue !== undefined) && (
          <div>
            <p className="text-lg font-bold">{leftValue} {leftLabel}</p>
          </div>
        )}
        
        {showGrowth ? (
          <div className="flex items-center text-green-500">
            <TrendingUp className="mr-1" size={20} />
            <p className="text-lg font-bold">
              {hideValues ? "***%" : `+${growthValue}%`}
            </p>
          </div>
        ) : (
          (rightLabel && rightValue !== undefined) && (
            <div>
              <p className="text-lg font-bold">{rightValue} {rightLabel}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
