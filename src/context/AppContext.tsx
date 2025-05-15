
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Fund, Screen, FundTab, AccountTab, DebtItem, HistoryItem, ApprovalItem } from '@/types';

// Update types.ts to include fundName field for these items
interface UserHistoryItem extends HistoryItem {
  fundName: string;
}

interface UserApprovalItem extends ApprovalItem {
  fundName: string;
}

// Mock data
const mockFunds: Fund[] = [
  {
    id: '1',
    name: 'Amigos do futebol de sexta',
    description: 'Grana para locação de equipamentos',
    balance: 5000,
    growth: 268,
    date: '10/04/2023',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=200&h=200',
    members: [
      { id: '1', name: 'Lucas', role: 'Admin', joined: '10/04/2023' },
      { id: '2', name: 'João', role: 'Membro', joined: '10/04/2023' },
      { id: '3', name: 'Maria', role: 'Membro', joined: '15/04/2023' },
      { id: '4', name: 'Carlos', role: 'Membro', joined: '20/04/2023' },
      { id: '5', name: 'Ana', role: 'Membro', joined: '25/04/2023' },
      { id: '6', name: 'Pedro', role: 'Membro', joined: '30/04/2023' },
      { id: '7', name: 'Paula', role: 'Membro', joined: '05/05/2023' }
    ],
    history: [
      { id: '1', date: '12/05/2023', description: 'Aporte de João', value: 500, type: 'deposit' },
      { id: '2', date: '05/05/2023', description: 'Pagamento quadra', value: -200, type: 'withdrawal' },
      { id: '3', date: '01/05/2023', description: 'Aporte de Maria', value: 500, type: 'deposit' }
    ],
    approvals: [
      { id: '1', date: '15/05/2023', description: 'Compra de bolas', value: 350, status: 'pending' }
    ]
  },
  {
    id: '2',
    name: 'Amigo secreto TI',
    description: 'Compra de presentes para o final de ano',
    balance: 500,
    growth: 27,
    date: '15/03/2023',
    image: 'https://images.unsplash.com/photo-1608116518432-ec97a1b7e8b0?q=80&w=200&h=200',
    members: [
      { id: '1', name: 'Lucas', role: 'Admin', joined: '15/03/2023' },
      { id: '8', name: 'Carlos', role: 'Membro', joined: '16/03/2023' },
      { id: '9', name: 'Ana', role: 'Membro', joined: '17/03/2023' },
      { id: '10', name: 'Rafael', role: 'Membro', joined: '18/03/2023' },
      { id: '11', name: 'Juliana', role: 'Membro', joined: '19/03/2023' },
      { id: '12', name: 'Marcos', role: 'Membro', joined: '20/03/2023' }
    ],
    history: [
      { id: '4', date: '10/05/2023', description: 'Aporte de Carlos', value: 100, type: 'deposit' },
      { id: '5', date: '01/05/2023', description: 'Aporte de Ana', value: 100, type: 'deposit' }
    ],
    approvals: []
  }
];

const userDebts: DebtItem[] = [
  { 
    id: '1', 
    fundId: '1',
    fundName: 'Amigos do futebol de sexta', 
    amount: 1200, 
    dueDate: '30/05/2023', 
    description: 'Empréstimo para equipamentos' 
  },
  { 
    id: '2', 
    fundId: '2',
    fundName: 'Amigo secreto TI', 
    amount: 300, 
    dueDate: '15/06/2023', 
    description: 'Adiantamento para presente' 
  }
];

const userMovements: UserHistoryItem[] = [
  { id: '6', date: '12/05/2023', fundName: 'Amigos do futebol de sexta', description: 'Aporte', value: 500, type: 'deposit' },
  { id: '7', date: '10/05/2023', fundName: 'Amigo secreto TI', description: 'Aporte', value: 200, type: 'deposit' },
  { id: '8', date: '05/05/2023', fundName: 'Amigos do futebol de sexta', description: 'Saque', value: -150, type: 'withdrawal' },
  { id: '9', date: '01/05/2023', fundName: 'Amigo secreto TI', description: 'Aporte', value: 100, type: 'deposit' },
  { id: '10', date: '28/04/2023', fundName: 'Amigos do futebol de sexta', description: 'Pagamento de dívida', value: 300, type: 'debt-payment' }
] as UserHistoryItem[];

const userApprovals: UserApprovalItem[] = [
  { id: '2', date: '15/05/2023', fundName: 'Amigos do futebol de sexta', description: 'Solicitação de empréstimo - João', value: 1000, status: 'pending' },
  { id: '3', date: '12/05/2023', fundName: 'Amigo secreto TI', description: 'Alteração de regras do fundo', value: null, status: 'pending' }
] as UserApprovalItem[];

interface AppContextType {
  funds: Fund[];
  userDebts: DebtItem[];
  userMovements: UserHistoryItem[];
  userApprovals: UserApprovalItem[];
  hideValues: boolean;
  setHideValues: React.Dispatch<React.SetStateAction<boolean>>;
  activeScreen: Screen;
  setActiveScreen: React.Dispatch<React.SetStateAction<Screen>>;
  selectedFund: Fund | null;
  setSelectedFund: React.Dispatch<React.SetStateAction<Fund | null>>;
  fundTab: FundTab;
  setFundTab: React.Dispatch<React.SetStateAction<FundTab>>;
  accountTab: AccountTab;
  setAccountTab: React.Dispatch<React.SetStateAction<AccountTab>>;
  handleFundClick: (fundId: string) => void;
  handleBackClick: () => void;
  handleAccountClick: () => void;
  getTotalBalance: () => number;
  getTotalMembers: () => number;
  getTotalUserDeposits: () => number;
  
  // Fund creation and deposit features
  isFundCreationOpen: boolean;
  setIsFundCreationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFundIdForDeposit: string | null;
  setSelectedFundIdForDeposit: React.Dispatch<React.SetStateAction<string | null>>;
  createFund: (fundData: { name: string; description: string; image: string; members: string[] }) => void;
  depositToFund: (fundId: string, amount: number, description: string) => void;
  handleDepositClick: (fundId?: string) => void;
  
  // Capital request features
  isCapitalRequestOpen: boolean;
  setIsCapitalRequestOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFundIdForCapitalRequest: string | null;
  setSelectedFundIdForCapitalRequest: React.Dispatch<React.SetStateAction<string | null>>;
  handleCapitalRequestClick: (fundId?: string) => void;
  requestCapitalFromFund: (fundId: string, amount: number, description: string, repaymentDate: Date) => void;
  
  // Debt payment features
  isDebtPaymentOpen: boolean;
  setIsDebtPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFundIdForDebtPayment: string | null;
  setSelectedFundIdForDebtPayment: React.Dispatch<React.SetStateAction<string | null>>;
  handleDebtPaymentClick: (fundId?: string) => void;
  payFundDebt: (fundId: string, debtId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [funds, setFunds] = useState<Fund[]>(mockFunds);
  const [userDebtsState, setUserDebts] = useState<DebtItem[]>(userDebts);
  const [hideValues, setHideValues] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [fundTab, setFundTab] = useState<FundTab>('history');
  const [accountTab, setAccountTab] = useState<AccountTab>('debts');
  
  // Fund creation and deposit features
  const [isFundCreationOpen, setIsFundCreationOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [selectedFundIdForDeposit, setSelectedFundIdForDeposit] = useState<string | null>(null);
  
  // Capital request features
  const [isCapitalRequestOpen, setIsCapitalRequestOpen] = useState<boolean>(false);
  const [selectedFundIdForCapitalRequest, setSelectedFundIdForCapitalRequest] = useState<string | null>(null);
  
  // Debt payment features
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState<boolean>(false);
  const [selectedFundIdForDebtPayment, setSelectedFundIdForDebtPayment] = useState<string | null>(null);

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

  const createFund = (fundData: { name: string; description: string; image: string; members: string[] }) => {
    const newFund: Fund = {
      id: `${funds.length + 1}`,
      name: fundData.name,
      description: fundData.description,
      balance: 0,
      growth: 0,
      date: formatDate(),
      image: fundData.image,
      members: [
        { id: '1', name: 'Lucas', role: 'Admin', joined: formatDate() },
        ...fundData.members.map((memberName, index) => ({
          id: `new-member-${index}`,
          name: memberName,
          role: 'Membro' as 'Membro',
          joined: formatDate()
        }))
      ],
      history: [],
      approvals: []
    };
    
    setFunds([...funds, newFund]);
  };

  const depositToFund = (fundId: string, amount: number, description: string) => {
    const date = formatDate();
    
    // Update fund balance and add to history
    setFunds(prevFunds => prevFunds.map(fund => {
      if (fund.id === fundId) {
        const updatedBalance = fund.balance + amount;
        const newHistoryItem = {
          id: `hist-${Date.now()}`,
          date,
          description: `${description} - Lucas`,
          value: amount,
          type: 'deposit' as 'deposit'
        };
        
        return {
          ...fund,
          balance: updatedBalance,
          history: [newHistoryItem, ...fund.history]
        };
      }
      return fund;
    }));
    
    // Add to user movements
    const fundName = funds.find(f => f.id === fundId)?.name || '';
    const newMovement = {
      id: `mov-${Date.now()}`,
      date,
      fundName,
      description: description,
      value: amount,
      type: 'deposit' as 'deposit'
    };
    
    // We'd update userMovements here if it wasn't a mock
    console.log('New user movement:', newMovement);
  };
  
  const requestCapitalFromFund = (fundId: string, amount: number, description: string, repaymentDate: Date) => {
    const date = formatDate();
    
    // Format the repayment date string
    const formattedRepaymentDate = repaymentDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Create a new approval request in the fund
    setFunds(prevFunds => prevFunds.map(fund => {
      if (fund.id === fundId) {
        const newApprovalItem: ApprovalItem = {
          id: `apr-${Date.now()}`,
          date,
          description: `Solicitação de empréstimo - Lucas - Pagamento em ${formattedRepaymentDate}`,
          value: amount,
          status: 'pending',
          requesterId: '1' // Lucas's ID
        };
        
        return {
          ...fund,
          approvals: [newApprovalItem, ...fund.approvals]
        };
      }
      return fund;
    }));
    
    // Add to user approvals
    const fundName = funds.find(f => f.id === fundId)?.name || '';
    const newApproval: UserApprovalItem = {
      id: `apr-${Date.now()}`,
      date,
      fundName,
      description: `Solicitação de empréstimo - ${description}`,
      value: amount,
      status: 'pending',
      requesterId: '1' // Lucas's ID
    };
    
    // We'd update userApprovals here if it wasn't a mock
    console.log('New user approval:', newApproval);
  };
  
  const payFundDebt = (fundId: string, debtId: string, amount: number) => {
    const date = formatDate();
    
    // Remove the debt from user's debts
    setUserDebts(prevDebts => prevDebts.filter(debt => debt.id !== debtId));
    
    // Add payment to the fund's history
    setFunds(prevFunds => prevFunds.map(fund => {
      if (fund.id === fundId) {
        const newHistoryItem = {
          id: `hist-${Date.now()}`,
          date,
          description: `Pagamento de dívida - Lucas`,
          value: amount,
          type: 'debt-payment' as 'debt-payment'
        };
        
        return {
          ...fund,
          history: [newHistoryItem, ...fund.history]
        };
      }
      return fund;
    }));
    
    // Add to user movements
    const fundName = funds.find(f => f.id === fundId)?.name || '';
    const newMovement = {
      id: `mov-${Date.now()}`,
      date,
      fundName,
      description: 'Pagamento de dívida',
      value: amount,
      type: 'debt-payment' as 'debt-payment'
    };
    
    // We'd update userMovements here if it wasn't a mock
    console.log('New debt payment movement:', newMovement);
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
    return userMovements
      .filter(movement => movement.type === 'deposit')
      .reduce((sum, movement) => sum + movement.value, 0);
  };

  const value = {
    funds,
    userDebts: userDebtsState,
    userMovements,
    userApprovals,
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
    
    // Fund creation and deposit features
    isFundCreationOpen,
    setIsFundCreationOpen,
    isDepositModalOpen,
    setIsDepositModalOpen,
    selectedFundIdForDeposit,
    setSelectedFundIdForDeposit,
    createFund,
    depositToFund,
    handleDepositClick,
    
    // Capital request features
    isCapitalRequestOpen,
    setIsCapitalRequestOpen,
    selectedFundIdForCapitalRequest,
    setSelectedFundIdForCapitalRequest,
    handleCapitalRequestClick,
    requestCapitalFromFund,
    
    // Debt payment features
    isDebtPaymentOpen,
    setIsDebtPaymentOpen,
    selectedFundIdForDebtPayment,
    setSelectedFundIdForDebtPayment,
    handleDebtPaymentClick,
    payFundDebt
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
