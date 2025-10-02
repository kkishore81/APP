
import React, { useState, useMemo } from 'react';
import type { Group } from '../types';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import ExpenseList from './ExpenseList';
import BalanceSummary from './BalanceSummary';
import Button from './Button';
import AddExpenseModal from './AddExpenseModal';
import SettleUpModal from './SettleUpModal';
import AddMemberModal from './AddMemberModal';
import { SearchIcon } from './icons';

interface GroupDetailProps {
  group: Group;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group }) => {
  const { expenses } = useSplitwise();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const groupExpenses = useMemo(() => {
    return expenses
      .filter(e => e.groupId === group.id)
      .filter(e => e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, group.id, searchTerm]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">{group.name}</h2>
            <div className="flex space-x-2">
                <Button onClick={() => setIsAddExpenseModalOpen(true)}>Add Expense</Button>
                <Button onClick={() => setIsSettleUpModalOpen(true)} variant="secondary">Settle Up</Button>
                <Button onClick={() => setIsAddMemberModalOpen(true)} variant="secondary">Add Member</Button>
            </div>
        </div>
        <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
        </div>
      </div>
      
      <div className="p-6">
        <BalanceSummary groupId={group.id} />
      </div>

      <div>
        <h3 className="px-6 text-lg font-semibold mb-2">Expenses</h3>
        <ExpenseList expenses={groupExpenses} />
      </div>

      {isAddExpenseModalOpen && <AddExpenseModal group={group} onClose={() => setIsAddExpenseModalOpen(false)} />}
      {isSettleUpModalOpen && <SettleUpModal group={group} onClose={() => setIsSettleUpModalOpen(false)} />}
      {isAddMemberModalOpen && <AddMemberModal group={group} onClose={() => setIsAddMemberModalOpen(false)} />}
    </div>
  );
};

export default GroupDetail;
