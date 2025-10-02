export interface User {
  id: string;
  name: string;
  email: string | null;
}

export interface Member {
  id: string;
  name: string;
  balance: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  paidByName: string;
  splitWith: { memberId: string; amount: number }[];
  createdAt: Date;
  isSettlement?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  memberIds: string[]; // Added for security rules
  expenses: Expense[];
  createdBy: string;
}

export interface ParsedExpense {
  description: string;
  totalAmount: number;
  paidBy: string;
  splitWith: string[];
}