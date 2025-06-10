
export interface Member {
  id: string;
  name: string;
  role: 'Admin' | 'Membro';
  joined: string; // Date in format DD/MM/YYYY
  profileImage?: string;
}

export interface HistoryItem {
  id: string;
  date: string; // Date in format DD/MM/YYYY
  description: string;
  value: number;
  type: 'deposit' | 'withdrawal' | 'debt-payment';
  fundName?: string; // Optional for backward compatibility
}

export interface ApprovalItem {
  id: string;
  date: string; // Date in format DD/MM/YYYY
  description: string;
  value: number | null;
  status: 'pending' | 'approved' | 'rejected';
  requesterId?: string;
  fundName?: string; // Optional for backward compatibility
}

export interface DebtItem {
  id: string;
  fundId: string;
  fundName: string;
  amount: number;
  dueDate: string; // Date in format DD/MM/YYYY
  description: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  balance: number;
  growth: number;
  members: Member[];
  date: string; // Creation date in format DD/MM/YYYY
  image: string;
  history: HistoryItem[];
  approvals: ApprovalItem[];
}

export type Screen = 'home' | 'fund-detail' | 'account';
export type FundTab = 'history' | 'approvals' | 'members';
export type AccountTab = 'debts' | 'movements' | 'approvals';
