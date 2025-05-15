import React, { createContext, useContext, useState } from 'react';
import { Debt, Fund } from '@/types';

interface AppContextType {
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isCapitalRequestOpen: boolean;
  setIsCapitalRequestOpen: (open: boolean) => void;
  isDebtPaymentOpen: boolean;
  setIsDebtPaymentOpen: (open: boolean) => void;
  isFundCreationOpen: boolean;
  setIsFundCreationOpen: (open: boolean) => void;
  selectedFundIdForDeposit: string | null;
  setSelectedFundIdForDeposit: (id: string | null) => void;
  selectedFundIdForCapitalRequest: string | null;
  setSelectedFundIdForCapitalRequest: (id: string | null) => void;
  selectedFundIdForDebtPayment: string | null;
  setSelectedFundIdForDebtPayment: (id: string | null) => void;
  funds: Fund[];
  setFunds: (funds: Fund[]) => void;
  userDebts: Debt[];
  setUserDebts: (debts: Debt[]) => void;
  depositToFund: (fundId: string, amount: number, description: string) => void;
  requestCapitalFromFund: (fundId: string, amount: number, description: string, repaymentDate: Date) => void;
  payFundDebt: (fundId: string, debtId: string, amount: number) => void;
  createFund: (fund: Omit<Fund, 'id' | 'balance'>) => void;
  hideValues: boolean;
  setHideValues: React.Dispatch<React.SetStateAction<boolean>>;
  activeScreen: string;
  setActiveScreen: React.Dispatch<React.SetStateAction<string>>;
  selectedFund: Fund | null;
  setSelectedFund: React.Dispatch<React.SetStateAction<Fund | null>>;
  fundTab: string;
  setFundTab: React.Dispatch<React.SetStateAction<string>>;
  accountTab: string;
  setAccountTab: React.Dispatch<React.SetStateAction<string>>;
  handleFundClick: (fundId: string) => void;
  handleBackClick: () => void;
  handleAccountClick: () => void;
  getTotalBalance: () => number;
  getTotalMembers: () => number;
  getTotalUserDeposits: () => number;
  handleDepositClick: (fundId?: string) => void;
  handleCapitalRequestClick: (fundId?: string) => void;
  handleDebtPaymentClick: (fundId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCapitalRequestOpen, setIsCapitalRequestOpen] = useState(false);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [isFundCreationOpen, setIsFundCreationOpen] = useState(false);
  const [selectedFundIdForDeposit, setSelectedFundIdForDeposit] = useState<string | null>(null);
  const [selectedFundIdForCapitalRequest, setSelectedFundIdForCapitalRequest] = useState<string | null>(null);
  const [selectedFundIdForDebtPayment, setSelectedFundIdForDebtPayment] = useState<string | null>(null);
  const [hideValues, setHideValues] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundTab, setFundTab] = useState<string>('history');
  const [accountTab, setAccountTab] = useState<string>('debts');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [userDebts, setUserDebts] = useState<Debt[]>([]);

  const depositToFund = (fundId: string, amount: number, description: string) => {
    setFunds(currentFunds =>
      currentFunds.map(fund =>
        fund.id === fundId
          ? { ...fund, balance: fund.balance + amount }
          : fund
      )
    );
  };

  const requestCapitalFromFund = (fundId: string, amount: number, description: string, repaymentDate: Date) => {
    // Simular criação de dívida
    const newDebt: Debt = {
      id: Math.random().toString(36).substr(2, 9),
      fundId,
      fundName: funds.find(f => f.id === fundId)?.name || '',
      amount,
      description,
      dueDate: repaymentDate.toLocaleDateString(),
      status: 'pending'
    };

    setUserDebts(prev => [...prev, newDebt]);
  };

  const payFundDebt = (fundId: string, debtId: string, amount: number) => {
    setUserDebts(prev => prev.filter(debt => debt.id !== debtId));
  };

  const createFund = (fundData: Omit<Fund, 'id' | 'balance'>) => {
    const newFund: Fund = {
      id: Math.random().toString(36).substr(2, 9),
      ...fundData,
      balance: 0
    };

    setFunds(prev => [...prev, newFund]);
  };

  const handleFundClick = (fundId: string) => {
    const fund = funds.find(f => f.id === fundId);
    if (fund) {
      setSelectedFund(fund);
      setFundTab('history'); // Reset to default tab
      setActiveScreen('fund-detail');
    }
  };

  const handleBackClick = () => {
    setActiveScreen('home');
    setSelectedFund(null);
  };

  const handleAccountClick = () => {
    setActiveScreen('account');
  };

  const handleDepositClick = (fundId?: string) => {
    if (fundId) {
      setSelectedFundIdForDeposit(fundId);
    } else {
      setSelectedFundIdForDeposit(null);
    }
    setIsDepositModalOpen(true);
  };

  const handleCapitalRequestClick = (fundId?: string) => {
    if (fundId) {
      setSelectedFundIdForCapitalRequest(fundId);
    } else {
      setSelectedFundIdForCapitalRequest(null);
    }
    setIsCapitalRequestOpen(true);
  };

  const handleDebtPaymentClick = (fundId?: string) => {
    if (fundId) {
      setSelectedFundIdForDebtPayment(fundId);
    } else {
      setSelectedFundIdForDebtPayment(null);
    }
    setIsDebtPaymentOpen(true);
  };

  const formatDate = (): string => {
    const date = new Date();
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getTotalBalance = (): number => {
    return funds.reduce((sum, fund) => sum + fund.balance, 0);
  };

  const getTotalMembers = (): number => {
    // Count unique members across all funds (a member can be in multiple funds)
    const uniqueMemberIds = new Set();
    if(funds){
      funds.forEach(fund => {
        if(fund.members){
          fund.members.forEach(member => uniqueMemberIds.add(member));
        }
      });
    }
    return uniqueMemberIds.size;
  };

  const getTotalUserDeposits = (): number => {
    return userDebts
      .filter(debt => debt.fundId === '1') // Assuming user deposits are related to fund with id '1'
      .reduce((sum, debt) => sum + debt.amount, 0);
  };

  return (
    <AppContext.Provider value={{
      isDepositModalOpen,
      setIsDepositModalOpen,
      isCapitalRequestOpen,
      setIsCapitalRequestOpen,
      isDebtPaymentOpen,
      setIsDebtPaymentOpen,
      isFundCreationOpen,
      setIsFundCreationOpen,
      selectedFundIdForDeposit,
      setSelectedFundIdForDeposit,
      selectedFundIdForCapitalRequest,
      setSelectedFundIdForCapitalRequest,
      selectedFundIdForDebtPayment,
      setSelectedFundIdForDebtPayment,
      funds,
      setFunds,
      userDebts,
      setUserDebts,
      depositToFund,
      requestCapitalFromFund,
      payFundDebt,
      createFund,
      hideValues,
      setHideValues,
      activeScreen,
      setActiveScreen,
      selectedFund,
      setSelectedFund,
      fundTab,
      setFundTab,
      accountTab,
      setAccountTab,
      handleFundClick,
      handleBackClick,
      handleAccountClick,
      getTotalBalance,
      getTotalMembers,
      getTotalUserDeposits,
      handleDepositClick,
      handleCapitalRequestClick,
      handleDebtPaymentClick,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};