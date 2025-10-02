
import React from 'react';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import type { Member, Expense } from '../types';
import Avatar from './Avatar';
import { ReceiptIcon } from './icons';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const { members } = useSplitwise();
  const youId = members.find(m => m.name === 'You')?.id || 'u1';

  const findMember = (id: string): Member | undefined => members.find(m => m.id === id);

  const getSplitDetails = (paidById: string, splitWithIds: string[], amount: number): { text: string, yourShare: number | null } => {
    const paidByMember = findMember(paidById);
    if (!paidByMember) return { text: '', yourShare: null };

    const splitCount = splitWithIds.length;
    const share = amount / splitCount;
    const isYouInSplit = splitWithIds.includes(youId);
    let yourShare: number | null = null;
    let text = '';
    
    if (paidById === youId) {
        text = `You paid ₹${amount.toFixed(2)}`;
        if (isYouInSplit && splitCount > 1) {
            const lentAmount = amount - share;
            yourShare = -lentAmount; // Negative because it's money coming back to you
        } else if (!isYouInSplit) {
            yourShare = -amount; // You lent the full amount
        }
    } else {
        text = `${paidByMember.name} paid ₹${amount.toFixed(2)}`;
        if (isYouInSplit) {
            yourShare = share; // Positive because you owe this
        }
    }

    return { text, yourShare };
  };

  if (expenses.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">No Expenses Found</h3>
        <p className="text-gray-500 text-sm">No expenses match your search, or the group has no expenses yet.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
        {expenses.map(expense => {
            const paidByMember = findMember(expense.paidById);
            const { text: splitText, yourShare } = getSplitDetails(expense.paidById, expense.splitWithIds, expense.amount);
            
            return (
                <li key={expense.id} className="p-4 flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10">
                       {paidByMember ? <Avatar name={paidByMember.name} className="h-10 w-10" /> : <div className="h-10 w-10 rounded-full bg-gray-200" />}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-500">{splitText}</p>
                    </div>
                    <div className="text-right">
                       {yourShare !== null && Math.abs(yourShare) > 0.01 && (
                           yourShare > 0 ? (
                               <p className="text-sm text-red-600">you owe<br /><span className="font-bold">₹{yourShare.toFixed(2)}</span></p>
                           ) : (
                               <p className="text-sm text-green-600">you are owed<br /><span className="font-bold">₹{Math.abs(yourShare).toFixed(2)}</span></p>
                           )
                       )}
                    </div>
                </li>
            );
        })}
    </ul>
  );
};

export default ExpenseList;
