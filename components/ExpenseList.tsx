import React from 'react';
import type { Expense, Member } from '../types';
import { ReceiptIcon } from './icons';
import Avatar from './Avatar';

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, members }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown';

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
        <ReceiptIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new expense.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {expenses.map((expense) => (
        <li key={expense.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                  <div className={`p-2 rounded-full ${expense.isSettlement ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <ReceiptIcon className={`h-5 w-5 ${expense.isSettlement ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{expense.description}</p>
                <p className="text-xs text-gray-500">
                  {expense.paidByName} paid {formatCurrency(expense.amount)}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-800">{formatCurrency(expense.amount)}</p>
                <p className="text-xs text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-3 pl-10">
            <p className="text-xs text-gray-500">Split with:</p>
            <div className="flex flex-wrap gap-2 mt-1">
                {expense.splitWith.map(split => (
                    <div key={split.memberId} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-0.5">
                        <Avatar name={getMemberName(split.memberId)} className="h-4 w-4 text-xs" />
                        <span className="text-xs text-gray-700">{getMemberName(split.memberId)}</span>
                    </div>
                ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
