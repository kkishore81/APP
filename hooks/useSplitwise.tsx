import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    addDoc, 
    doc, 
    updateDoc, 
    arrayUnion, 
    writeBatch,
    Timestamp
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import type { Group, Expense, Member } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SplitwiseContextType {
  groups: Group[];
  loading: boolean;
  createGroup: (name: string, members: string[]) => Promise<void>;
  addExpense: (groupId: string, description: string, amount: number, paidById: string, splitWithIds: string[]) => Promise<void>;
  settleUp: (groupId: string, fromId: string, toId: string, amount: number) => Promise<void>;
  addMemberToGroup: (groupId: string, memberName: string) => Promise<void>;
}

const SplitwiseContext = createContext<SplitwiseContextType | undefined>(undefined);

export const SplitwiseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', user.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsData: Group[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        groupsData.push({ 
            id: doc.id, 
            ...data,
            // Convert Firestore Timestamps to JS Dates
            expenses: (data.expenses || []).map((exp: any) => ({
                ...exp,
                createdAt: exp.createdAt instanceof Timestamp ? exp.createdAt.toDate() : new Date(),
            })).sort((a: Expense, b: Expense) => b.createdAt.getTime() - a.createdAt.getTime()),
        } as Group);
      });
      setGroups(groupsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching groups:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createGroup = useCallback(async (name: string, memberNames: string[]) => {
    if (!user) throw new Error("User not authenticated");

    const initialMembers: Member[] = [
        { id: user.id, name: user.name, balance: 0 },
        ...memberNames.filter(name => name.trim() !== '').map(name => ({ id: uuidv4(), name, balance: 0 }))
    ];
    
    const newGroup = {
      name,
      members: initialMembers,
      memberIds: initialMembers.map(m => m.id),
      expenses: [],
      createdBy: user.id,
    };

    await addDoc(collection(db, 'groups'), newGroup);
  }, [user]);

  const addMemberToGroup = useCallback(async (groupId: string, memberName: string) => {
    if (!user) throw new Error("User not authenticated");
    
    const newMember: Member = { id: uuidv4(), name: memberName, balance: 0 };
    const groupDocRef = doc(db, 'groups', groupId);
    
    await updateDoc(groupDocRef, {
        members: arrayUnion(newMember),
        memberIds: arrayUnion(newMember.id)
    });
  }, [user]);

  const addExpense = useCallback(async (groupId: string, description: string, amount: number, paidById: string, splitWithIds: string[]) => {
    if (!user) throw new Error("User not authenticated");
    
    const groupDocRef = doc(db, 'groups', groupId);
    const group = groups.find(g => g.id === groupId);
    if (!group) throw new Error("Group not found");

    const batch = writeBatch(db);
    
    const splitAmount = amount / splitWithIds.length;
    
    const paidByMember = group.members.find(m => m.id === paidById);
    if (!paidByMember) throw new Error("Payer not found in group");

    const newMembers = group.members.map(member => {
      let newBalance = member.balance;
      if (member.id === paidById) {
        newBalance += amount;
      }
      if (splitWithIds.includes(member.id)) {
        newBalance -= splitAmount;
      }
      return { ...member, balance: newBalance };
    });

    const newExpense: Omit<Expense, 'id' | 'createdAt'> & { createdAt: Date } = {
      groupId,
      description,
      amount,
      paidById,
      paidByName: paidByMember.name,
      splitWith: splitWithIds.map(memberId => ({ memberId, amount: splitAmount })),
      createdAt: new Date(),
    };
    
    batch.update(groupDocRef, {
        members: newMembers,
        expenses: arrayUnion({...newExpense, id: uuidv4(), createdAt: Timestamp.fromDate(newExpense.createdAt)})
    });

    await batch.commit();

  }, [user, groups]);

  const settleUp = useCallback(async (groupId: string, fromId: string, toId: string, amount: number) => {
    if (!user) throw new Error("User not authenticated");

    const groupDocRef = doc(db, 'groups', groupId);
    const group = groups.find(g => g.id === groupId);
    if (!group) throw new Error("Group not found");

    const batch = writeBatch(db);
    
    const fromMember = group.members.find(m => m.id === fromId);
    const toMember = group.members.find(m => m.id === toId);
    if (!fromMember || !toMember) throw new Error("Member not found");
    
    const newMembers = group.members.map(member => {
        let newBalance = member.balance;
        if (member.id === fromId) {
            newBalance += amount;
        }
        if (member.id === toId) {
            newBalance -= amount;
        }
        return { ...member, balance: newBalance };
    });

    const settlementExpense: Omit<Expense, 'id' | 'createdAt'> & { createdAt: Date } = {
        groupId,
        description: `${fromMember.name} paid ${toMember.name}`,
        amount,
        paidById: fromId,
        paidByName: fromMember.name,
        splitWith: [{ memberId: toId, amount: amount }],
        createdAt: new Date(),
        isSettlement: true,
    };

    batch.update(groupDocRef, {
        members: newMembers,
        expenses: arrayUnion({...settlementExpense, id: uuidv4(), createdAt: Timestamp.fromDate(settlementExpense.createdAt)})
    });

    await batch.commit();
  }, [user, groups]);

  const value = { groups, loading, createGroup, addExpense, settleUp, addMemberToGroup };

  return <SplitwiseContext.Provider value={value}>{children}</SplitwiseContext.Provider>;
};

export const useSplitwise = () => {
  const context = useContext(SplitwiseContext);
  if (context === undefined) {
    throw new Error('useSplitwise must be used within a SplitwiseProvider');
  }
  return context;
};
