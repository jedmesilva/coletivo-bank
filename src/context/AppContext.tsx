import React, { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

type Fund = {
  id: string;
  name: string;
  description: string;
  balance: number;
  image: string;
};

type Debt = {
  id: string;
  fundId: string;
  fundName: string;
  amount: number;
  description: string;
  dueDate: string;
};

interface AppContextType {
  // Modal states
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isCapitalRequestOpen: boolean;
  setIsCapitalRequestOpen: (open: boolean) => void;
  isDebtPaymentOpen: boolean;
  setIsDebtPaymentOpen: (open: boolean) => void;
  isFundCreationOpen: boolean;
  setIsFundCreationOpen: (open: boolean) => void;

  // Selected fund states
  selectedFundIdForDeposit: string | null;
  setSelectedFundIdForDeposit: (id: string | null) => void;
  selectedFundIdForCapitalRequest: string | null;
  setSelectedFundIdForCapitalRequest: (id: string | null) => void;
  selectedFundIdForDebtPayment: string | null;
  setSelectedFundIdForDebtPayment: (id: string | null) => void;

  // Data and actions
  funds: Fund[];
  userDebts: Debt[];
  depositToFund: (fundId: string, amount: number, description: string) => void;
  requestCapitalFromFund: (fundId: string, amount: number, description: string, repaymentDate: Date) => void;
  payFundDebt: (fundId: string, debtId: string, amount: number) => void;
  createFund: (fund: Omit<Fund, 'id' | 'balance'> & { members: string[] }) => void;
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

export function AppProvider({ children }: { children: ReactNode }) {
  // Modal states
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isCapitalRequestOpen, setIsCapitalRequestOpen] = useState(false);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [isFundCreationOpen, setIsFundCreationOpen] = useState(false);

  // Selected fund states
  const [selectedFundIdForDeposit, setSelectedFundIdForDeposit] = useState<string | null>(null);
  const [selectedFundIdForCapitalRequest, setSelectedFundIdForCapitalRequest] = useState<string | null>(null);
  const [selectedFundIdForDebtPayment, setSelectedFundIdForDebtPayment] = useState<string | null>(null);
  const [hideValues, setHideValues] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundTab, setFundTab] = useState<string>('history');
  const [accountTab, setAccountTab] = useState<string>('debts');

  // Mock data - replace with actual data fetching
  const [funds, setFunds] = useState<Fund[]>([
    {
      id: '1',
      name: 'Fundo Exemplo',
      description: 'Um fundo de exemplo',
      balance: 1000,
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }
  ]);

  const [userDebts, setUserDebts] = useState<Debt[]>([
    {
      id: '1',
      fundId: '1',
      fundName: 'Fundo Exemplo',
      amount: 100,
      description: 'Dívida de exemplo',
      dueDate: '2024-01-01'
    }
  ]);

  // Actions
  const depositToFund = (fundId: string, amount: number, description: string) => {
    setFunds(funds.map(fund =>
      fund.id === fundId
        ? { ...fund, balance: fund.balance + amount }
        : fund
    ));
  };

  const requestCapitalFromFund = (fundId: string, amount: number, description: string, repaymentDate: Date) => {
    // Implement capital request logic
    console.log('Capital requested:', { fundId, amount, description, repaymentDate });
  };

  const payFundDebt = (fundId: string, debtId: string, amount: number) => {
    setUserDebts(userDebts.filter(debt => debt.id !== debtId));
  };

  const createFund = (fundData: Omit<Fund, 'id' | 'balance'> & { members: string[] }) => {
    const newFund: Fund = {
      ...fundData,
      id: Date.now().toString(),
      balance: 0
    };
    setFunds([...funds, newFund]);
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
    funds.forEach(fund => {
      fund.members.forEach(member => uniqueMemberIds.add(member.id));
    });
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
      userDebts,
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
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};