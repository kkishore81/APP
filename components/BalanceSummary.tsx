
import React from 'react';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import Avatar from './Avatar';

interface BalanceSummaryProps {
  groupId: string;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ groupId }) => {
  const { calculateBalances } = useSplitwise();
  const balances = calculateBalances(groupId);

  const owes = balances.filter(b => b.amount < -0.01);
  const owed = balances.filter(b => b.amount > 0.01);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Group Balances</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-600 mb-2">Who owes money</h4>
          {owes.length > 0 ? (
            <ul className="space-y-3">
              {owes.map(balance => (
                <li key={balance.memberId} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar name={balance.name} className="h-8 w-8 text-xs" />
                    <span>{balance.name}</span>
                  </div>
                  <span className="font-semibold text-red-600">
                    ₹{Math.abs(balance.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Everyone is settled up.</p>
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-600 mb-2">Who is owed money</h4>
          {owed.length > 0 ? (
            <ul className="space-y-3">
              {owed.map(balance => (
                <li key={balance.memberId} className="flex justify-between items-center">
                   <div className="flex items-center space-x-3">
                    <Avatar name={balance.name} className="h-8 w-8 text-xs" />
                    <span>{balance.name}</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    ₹{balance.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-gray-500 text-sm">No one is owed money.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
