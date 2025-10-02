
export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  splitWithIds: string[];
  date: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
}

export interface Balance {
  memberId: string;
  name: string;
  amount: number;
}

export interface ParsedExpense {
  description: string | null;
  totalAmount: number | null;
  paidBy: string | null;
  splitWith: string[] | null;
}
