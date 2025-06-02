
import React from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatPercentage } from '@/utils/formatCurrency';

interface FundBalanceCardProps {
  title: string;
  balance: number;
  leftLabel?: string;
  leftValue?: string | number;
  rightLabel?: string;
  rightValue?: string | number;
  showGrowth?: boolean;
  growthValue?: number;
}

const FundBalanceCard: React.FC<FundBalanceCardProps> = ({
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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
      {/* Header do Card */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white/90 mb-1">{title}</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        </div>
        <button 
          onClick={() => setHideValues(!hideValues)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
        >
          {hideValues ? 
            <EyeOff size={18} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all" /> : 
            <Eye size={18} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all" />
          }
        </button>
      </div>

      {/* Valor Principal */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-white">
            {formatCurrency(balance, hideValues)}
          </span>
          {showGrowth && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-xs font-semibold text-green-400">
                {hideValues ? "***%" : formatPercentage(growthValue, hideValues)}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-white/60">Saldo do fundo</p>
      </div>

      {/* Estatísticas */}
      {(leftLabel && leftValue !== undefined) && (
        <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Users size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{leftValue}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide">{leftLabel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundBalanceCard;
