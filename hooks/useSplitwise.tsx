import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Member, Group, Expense, Balance } from '../types';

const DUMMY_DATA = {
    members: [
        { id: 'u1', name: 'You' },
        { id: 'u2', name: 'Alice' },
        { id: 'u3', name: 'Bob' },
        { id: 'u4', name: 'Charlie' },
        { id: 'u5', name: 'David' },
    ],
    groups: [
        {
            id: 'g1',
            name: 'Trip to Goa',
            members: [
                { id: 'u1', name: 'You' },
                { id: 'u2', name: 'Alice' },
                { id: 'u3', name: 'Bob' },
            ],
        },
        {
            id: 'g2',
            name: 'Apartment Rent',
            members: [
                { id: 'u1', name: 'You' },
                { id: 'u4', name: 'Charlie' },
            ],
        },
    ],
    expenses: [
        {
            id: 'e1',
            groupId: 'g1',
            description: 'Flights',
            amount: 9000,
            paidById: 'u1',
            splitWithIds: ['u1', 'u2', 'u3'],
            date: '2023-10-01T10:00:00Z',
        },
        {
            id: 'e2',
            groupId: 'g1',
            description: 'Hotel',
            amount: 15000,
            paidById: 'u2',
            splitWithIds: ['u1', 'u2', 'u3'],
            date: '2023-10-02T12:00:00Z',
        },
        {
            id: 'e3',
            groupId: 'g1',
            description: 'Dinner',
            amount: 2400,
            paidById: 'u1',
            splitWithIds: ['u1', 'u3'],
            date: '2023-10-02T19:00:00Z',
        },
        {
            id: 'e4',
            groupId: 'g2',
            description: 'Monthly Rent',
            amount: 20000,
            paidById: 'u4',
            splitWithIds: ['u1', 'u4'],
            date: '2023-10-05T11:00:00Z',
        },
        {
            id: 'e5',
            groupId: 'g2',
            description: 'Groceries',
            amount: 3000,
            paidById: 'u1',
            splitWithIds: ['u1', 'u4'],
            date: '2023-10-06T18:00:00Z',
        }
    ],
};


interface SplitwiseContextType {
  members: Member[];
  groups: Group[];
  expenses: Expense[];
  addGroup: (name: string, membersString: string) => void;
  addMemberToGroup: (groupId: string, memberName: string) => void;
  addExpense: (groupId: string, description: string, amount: number, paidById: string, splitWithIds: string[]) => void;
  settleUp: (groupId: string, fromId: string, toId: string, amount: number) => void;
  calculateBalances: (groupId: string) => Balance[];
  calculateTotalBalance: () => { totalOwedToYou: number; totalYouOwe: number };
}

const SplitwiseContext = createContext<SplitwiseContextType | undefined>(undefined);

export const SplitwiseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(DUMMY_DATA.members);
  const [groups, setGroups] = useState<Group[]>(DUMMY_DATA.groups);
  const [expenses, setExpenses] = useState<Expense[]>(DUMMY_DATA.expenses);

  const addGroup = useCallback((name: string, membersString: string) => {
    const newMemberNames = membersString.split(',').map(s => s.trim()).filter(Boolean);
    const existingYou = members.find(m => m.name === 'You')!;
    
    let lastMemberId = Math.max(...members.map(m => parseInt(m.id.substring(1))), 0);

    const newMembers: Member[] = newMemberNames.map(memberName => ({
        id: `u${++lastMemberId}`,
        name: memberName,
    }));
    
    const allNewMembers = [...members, ...newMembers];
    setMembers(allNewMembers);
    
    const groupMembers = [existingYou, ...newMembers];

    let lastGroupId = Math.max(...groups.map(g => parseInt(g.id.substring(1))), 0);
    const newGroup: Group = {
        id: `g${++lastGroupId}`,
        name,
        members: groupMembers,
    };
    
    setGroups(prev => [...prev, newGroup]);
  }, [members, groups]);


  const addMemberToGroup = useCallback((groupId: string, memberName: string) => {
    let lastMemberId = Math.max(...members.map(m => parseInt(m.id.substring(1))), 0);
    const newMember: Member = {
      id: `u${++lastMemberId}`,
      name: memberName,
    };
    setMembers(prev => [...prev, newMember]);
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: [...g.members, newMember] } : g));
  }, [members]);


  const addExpense = useCallback((groupId: string, description: string, amount: number, paidById: string, splitWithIds:string[]) => {
      let lastExpenseId = Math.max(...expenses.map(e => parseInt(e.id.substring(1))), 0);
      const newExpense: Expense = {
          id: `e${++lastExpenseId}`,
          groupId,
          description,
          amount,
          paidById,
          splitWithIds,
          date: new Date().toISOString(),
      };
      setExpenses(prev => [...prev, newExpense]);
  }, [expenses]);
  
  const settleUp = useCallback((groupId: string, fromId: string, toId: string, amount: number) => {
      const fromMember = members.find(m => m.id === fromId);
      const toMember = members.find(m => m.id === toId);
      if (!fromMember || !toMember) return;
      
      addExpense(groupId, `Payment from ${fromMember.name} to ${toMember.name}`, amount, fromId, [toId]);
  }, [addExpense, members]);

  const calculateBalances = useCallback((groupId: string): Balance[] => {
    const groupExpenses = expenses.filter(e => e.groupId === groupId);
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
  
    const memberBalances: { [key: string]: number } = {};
    group.members.forEach(m => memberBalances[m.id] = 0);
  
    groupExpenses.forEach(expense => {
      const { paidById, splitWithIds, amount } = expense;
      const share = amount / splitWithIds.length;
  
      // The payer lent money, so their balance increases
      memberBalances[paidById] += amount;
  
      // The splitters owe money, so their balance decreases
      splitWithIds.forEach(memberId => {
        if (memberId in memberBalances) {
          memberBalances[memberId] -= share;
        }
      });
    });
  
    return group.members.map(member => ({
      memberId: member.id,
      name: member.name,
      amount: memberBalances[member.id]
    }));
  }, [expenses, groups]);

  const calculateTotalBalance = useCallback(() => {
    const youId = members.find(m => m.name === 'You')?.id;
    if (!youId) return { totalOwedToYou: 0, totalYouOwe: 0 };
    
    let totalOwedToYou = 0;
    let totalYouOwe = 0;

    expenses.forEach(expense => {
        const share = expense.amount / expense.splitWithIds.length;
        
        if (expense.paidById === youId) {
            // You paid. Find how much others owe you.
            expense.splitWithIds.forEach(splitId => {
                if (splitId !== youId) {
                    totalOwedToYou += share;
                }
            });
        } else {
            // Someone else paid. Find if you owe anything.
            if (expense.splitWithIds.includes(youId)) {
                totalYouOwe += share;
            }
        }
    });

    return { totalOwedToYou, totalYouOwe };

  }, [expenses, members]);

  const value = useMemo(() => ({
    members,
    groups,
    expenses,
    addGroup,
    addMemberToGroup,
    addExpense,
    settleUp,
    calculateBalances,
    calculateTotalBalance
  }), [members, groups, expenses, addGroup, addMemberToGroup, addExpense, settleUp, calculateBalances, calculateTotalBalance]);

  return (
    <SplitwiseContext.Provider value={value}>
      {children}
    </SplitwiseContext.Provider>
  );
};

export const useSplitwise = () => {
  const context = useContext(SplitwiseContext);
  if (context === undefined) {
    throw new Error('useSplitwise must be used within a SplitwiseProvider');
  }
  return context;
};