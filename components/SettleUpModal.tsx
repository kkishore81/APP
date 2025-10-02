
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import type { Group } from '../types';

interface SettleUpModalProps {
  group: Group;
  onClose: () => void;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({ group, onClose }) => {
  const { settleUp } = useSplitwise();
  const [fromId, setFromId] = useState<string>(group.members[0].id);
  const [toId, setToId] = useState<string>(group.members[1]?.id || group.members[0].id);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && fromId && toId) {
      settleUp(group.id, fromId, toId, numericAmount);
      onClose();
    }
  };

  return (
    <Modal title="Settle up" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                 <select id="from" value={fromId} onChange={e => setFromId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500">
                    {group.members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                <select id="to" value={toId} onChange={e => setToId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500">
                    {group.members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label htmlFor="settle-amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="settle-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit">Record Payment</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettleUpModal;
