
import { useState, useCallback } from 'react';
import { Fund } from '@/types';

export const useFunds = (initialFunds: Fund[]) => {
  const [funds, setFunds] = useState<Fund[]>(initialFunds);

  const createFund = useCallback((fund: Fund) => {
    setFunds(prev => [...prev, fund]);
  }, []);

  const updateFund = useCallback((updatedFund: Fund) => {
    setFunds(prev => 
      prev.map(fund => fund.id === updatedFund.id ? updatedFund : fund)
    );
  }, []);

  const deleteFund = useCallback((fundId: string) => {
    setFunds(prev => prev.filter(fund => fund.id !== fundId));
  }, []);

  const makeDeposit = useCallback((fundId: string, amount: number, description: string) => {
    const date = new Date().toLocaleDateString('pt-BR');
    const depositId = `deposit-${Date.now()}`;
    
    setFunds(prev => 
      prev.map(fund => {
        if (fund.id === fundId) {
          return {
            ...fund,
            balance: fund.balance + amount,
            history: [
              {
                id: depositId,
                date,
                description,
                value: amount,
                type: 'deposit'
              },
              ...fund.history
            ]
          };
        }
        return fund;
      })
    );
  }, []);

  const requestWithdrawal = useCallback((fundId: string, amount: number, description: string) => {
    const date = new Date().toLocaleDateString('pt-BR');
    const approvalId = `approval-${Date.now()}`;
    
    setFunds(prev => 
      prev.map(fund => {
        if (fund.id === fundId) {
          return {
            ...fund,
            approvals: [
              {
                id: approvalId,
                date,
                description,
                value: amount,
                status: 'pending'
              },
              ...fund.approvals
            ]
          };
        }
        return fund;
      })
    );
  }, []);

  return {
    funds,
    createFund,
    updateFund,
    deleteFund,
    makeDeposit,
    requestWithdrawal
  };
};
