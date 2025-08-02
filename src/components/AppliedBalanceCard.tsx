import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from '@/utils/formatCurrency';
import { useApp } from '@/context/AppContext';

interface AppliedBalanceCardProps {
  className?: string;
}

const AppliedBalanceCard: React.FC<AppliedBalanceCardProps> = ({ className = "" }) => {
  const { getUserAppliedBalance, hideValues, funds } = useApp();
  
  const appliedBalance = getUserAppliedBalance();
  const activeFundsCount = funds.length;

  return (
    <Card className={`bg-white shadow-sm border-0 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Saldo aplicado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(appliedBalance, hideValues)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Fundos ativos</p>
            <p className="text-lg font-semibold text-gray-700">{activeFundsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppliedBalanceCard;