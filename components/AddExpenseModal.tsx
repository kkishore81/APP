
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from './Button';
// Fix: Explicitly import from .tsx file to resolve conflict with empty .ts file.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import type { Group } from '../types';
import { parseExpenseFromString } from '../services/geminiService';
import { SparklesIcon } from './icons';
import { useAuth } from '../hooks/useAuth';

interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ group, onClose }) => {
  const { user } = useAuth();
  const { addExpense } = useSplitwise();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string>(user?.id || group.members[0].id);
  const [splitWithIds, setSplitWithIds] = useState<string[]>(group.members.map(m => m.id));
  const [isLoading, setIsLoading] = useState(false);
  
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const memberNames = useMemo(() => {
    // We add 'You' for the current user to help Gemini understand context
    return group.members.map(m => m.id === user?.id ? 'You' : m.name);
  }, [group.members, user]);

  const handleGeminiParse = async () => {
    if (!geminiPrompt.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseExpenseFromString(geminiPrompt, memberNames);
      if (result) {
        setDescription(result.description || '');
        setAmount(result.totalAmount ? String(result.totalAmount) : '');
        
        const paidByMember = group.members.find(m => m.name === result.paidBy || (result.paidBy === 'You' && m.id === user?.id));
        if (paidByMember) {
            setPaidById(paidByMember.id);
        }

        const splitMembers = group.members.filter(m => result.splitWith.includes(m.name) || (result.splitWith.includes('You') && m.id === user?.id));
        if (splitMembers.length > 0) {
            setSplitWithIds(splitMembers.map(m => m.id));
        }
      } else {
        // Handle case where parsing fails, maybe show a toast notification
        console.warn("Failed to parse expense string.");
      }
    } catch (error) {
      console.error("Error parsing with Gemini:", error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSplitWithChange = (memberId: string) => {
    setSplitWithIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    setSplitWithIds(group.members.map(m => m.id));
  };
  
  const clearAllMembers = () => {
    setSplitWithIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (description.trim() && !isNaN(numericAmount) && numericAmount > 0 && paidById && splitWithIds.length > 0) {
      setIsLoading(true);
      try {
        await addExpense(group.id, description.trim(), numericAmount, paidById, splitWithIds);
        onClose();
      } catch (error) {
        console.error("Failed to add expense:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal title={`Add expense in ${group.name}`} onClose={onClose}>
        <div className="mb-6">
            <label htmlFor="gemini-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Describe the expense in one line
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="gemini-prompt"
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-3 pr-20 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Dinner for 25 paid by me, split with everyone"
                />
                <Button 
                    size="sm" 
                    className="absolute inset-y-0 right-0 rounded-l-none" 
                    onClick={handleGeminiParse}
                    isLoading={isParsing}
                >
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    Parse
                </Button>
            </div>
             <p className="text-xs text-gray-500 mt-1">Our AI will try to fill out the form for you!</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>
            <div>
                <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">Paid by</label>
                <select id="paidBy" value={paidById} onChange={e => setPaidById(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500">
                    {group.members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Split with</label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 p-3 rounded-md">
                {group.members.map(member => (
                    <div key={member.id} className="flex items-center">
                        <input
                            id={`member-${member.id}`}
                            type="checkbox"
                            checked={splitWithIds.includes(member.id)}
                            onChange={() => handleSplitWithChange(member.id)}
                            className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor={`member-${member.id}`} className="ml-3 text-sm text-gray-700">{member.name}</label>
                    </div>
                ))}
            </div>
            <div className="flex space-x-2 mt-2">
                <button type="button" onClick={selectAllMembers} className="text-xs text-teal-600 hover:underline">Select all</button>
                <button type="button" onClick={clearAllMembers} className="text-xs text-teal-600 hover:underline">Clear all</button>
            </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isLoading}>Add Expense</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
