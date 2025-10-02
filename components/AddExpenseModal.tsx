
import React, { useState, useCallback, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import type { Group, ParsedExpense } from '../types';
import { SparklesIcon } from './icons';
import { parseExpenseFromString } from '../services/geminiService';


interface AddExpenseModalProps {
  group: Group;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ group, onClose }) => {
  const { addExpense } = useSplitwise();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [paidById, setPaidById] = useState<string>(group.members.find(m => m.name === 'You')?.id || group.members[0].id);
  const [splitWithIds, setSplitWithIds] = useState<string[]>(group.members.map(m => m.id));

  const [smartAddText, setSmartAddText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleSmartParse = useCallback(async () => {
    setIsParsing(true);
    setParseError('');
    try {
      const memberNames = group.members.map(m => m.name);
      const result = await parseExpenseFromString(smartAddText, memberNames);
      
      if (result) {
        if (result.description) setDescription(result.description);
        if (result.totalAmount) setAmount(result.totalAmount.toString());
        
        const paidByMember = group.members.find(m => m.name === result.paidBy);
        if (paidByMember) setPaidById(paidByMember.id);

        if (result.splitWith && result.splitWith.length > 0) {
            const validSplitMemberIds = result.splitWith
                .map(name => group.members.find(m => m.name === name)?.id)
                .filter((id): id is string => !!id);
            if(validSplitMemberIds.length > 0) {
                setSplitWithIds(validSplitMemberIds);
            }
        }
      } else {
        setParseError("Couldn't parse the expense. Please check the text or fill the form manually.");
      }
    } catch (error) {
        setParseError("An error occurred while parsing. Please try again.");
        console.error(error);
    } finally {
        setIsParsing(false);
    }
  }, [group.members, smartAddText]);


  const handleSplitCheckboxChange = (memberId: string) => {
    setSplitWithIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  const selectAllSplits = () => setSplitWithIds(group.members.map(m => m.id));
  const clearAllSplits = () => setSplitWithIds([]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (description.trim() && !isNaN(numericAmount) && numericAmount > 0 && paidById && splitWithIds.length > 0) {
      addExpense(group.id, description, numericAmount, paidById, splitWithIds);
      onClose();
    }
  };

  return (
    <Modal title={`Add expense to ${group.name}`} onClose={onClose}>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <SparklesIcon className="h-5 w-5 text-teal-500" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-teal-800">Smart Add with Gemini</p>
                    <div className="mt-2 text-sm text-teal-700">
                        <input
                            type="text"
                            value={smartAddText}
                            onChange={(e) => setSmartAddText(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            placeholder="e.g., I paid ₹500 for dinner for everyone"
                        />
                         <Button size="sm" onClick={handleSmartParse} isLoading={isParsing} className="mt-2">
                           Parse Expense
                        </Button>
                        {parseError && <p className="text-red-600 text-xs mt-1">{parseError}</p>}
                    </div>
                </div>
            </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
            </div>
        </div>
        
        <div>
          <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">Paid by</label>
          <select id="paidBy" value={paidById} onChange={e => setPaidById(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500">
            {group.members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Split equally with</label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                {group.members.map(member => (
                    <div key={member.id} className="flex items-center">
                        <input id={`split-${member.id}`} type="checkbox" checked={splitWithIds.includes(member.id)} onChange={() => handleSplitCheckboxChange(member.id)} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                        <label htmlFor={`split-${member.id}`} className="ml-3 text-sm text-gray-700">{member.name}</label>
                    </div>
                ))}
            </div>
            <div className="flex space-x-2 mt-2">
                <button type="button" onClick={selectAllSplits} className="text-xs text-teal-600 hover:underline">Select All</button>
                <button type="button" onClick={clearAllSplits} className="text-xs text-teal-600 hover:underline">Clear All</button>
            </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Add Expense</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
