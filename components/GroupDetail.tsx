import React, { useState } from 'react';
import type { Group } from '../types';
// Fix: Corrected import path for BalanceSummary to remove extension.
import BalanceSummary from './BalanceSummary';
// Fix: Corrected import path for ExpenseList to remove extension.
import ExpenseList from './ExpenseList';
import Button from './Button';
// Fix: Corrected import path for AddExpenseModal to remove extension.
import AddExpenseModal from './AddExpenseModal';
import SettleUpModal from './SettleUpModal';
import AddMemberModal from './AddMemberModal';

interface GroupDetailProps {
  group: Group;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ group }) => {
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [isSettleUpModalOpen, setSettleUpModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow space-y-6">
        <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
                <div className="flex space-x-2">
                    <Button onClick={() => setAddExpenseModalOpen(true)}>Add Expense</Button>
                    <Button onClick={() => setSettleUpModalOpen(true)} variant="secondary">Settle Up</Button>
                </div>
            </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Balances</h3>
          <BalanceSummary members={group.members} />
        </div>
        
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Expenses</h3>
              <Button onClick={() => setAddMemberModalOpen(true)} variant="secondary" size="sm">Add Member</Button>
            </div>
            <ExpenseList expenses={group.expenses} members={group.members}/>
        </div>
        
        {isAddExpenseModalOpen && <AddExpenseModal group={group} onClose={() => setAddExpenseModalOpen(false)} />}
        {isSettleUpModalOpen && <SettleUpModal group={group} onClose={() => setSettleUpModalOpen(false)} />}
        {isAddMemberModalOpen && <AddMemberModal group={group} onClose={() => setAddMemberModalOpen(false)} />}
    </div>
  );
};

export default GroupDetail;