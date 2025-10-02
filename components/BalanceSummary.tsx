import React from 'react';
import type { Member } from '../types';
import Avatar from './Avatar';

interface BalanceSummaryProps {
  members: Member[];
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ members }) => {
  const sortedMembers = [...members].sort((a, b) => b.balance - a.balance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className="space-y-4">
      {sortedMembers.map((member) => {
        const isOwed = member.balance > 0;
        const isOwing = member.balance < 0;
        const colorClass = isOwed ? 'text-green-600' : isOwing ? 'text-red-600' : 'text-gray-500';
        const label = isOwed ? 'gets back' : isOwing ? 'owes' : 'is settled up';

        return (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar name={member.name} className="h-8 w-8 text-sm" />
              <span className="font-medium text-gray-800">{member.name}</span>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${colorClass}`}>{formatCurrency(Math.abs(member.balance))}</p>
              <p className={`text-xs ${colorClass}`}>{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BalanceSummary;
