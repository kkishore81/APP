
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
// Fix: Explicitly import from .tsx file to resolve conflict with empty .ts file.
import { useSplitwise } from '../hooks/useSplitwise.tsx';

interface AddGroupModalProps {
  onClose: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ onClose }) => {
  const { createGroup } = useSplitwise();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const addMemberInput = () => {
    setMembers([...members, '']);
  };
  
  const removeMemberInput = (index: number) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      setIsLoading(true);
      try {
        const memberNames = members.map(m => m.trim()).filter(m => m !== '');
        await createGroup(groupName.trim(), memberNames);
        onClose();
      } catch (error) {
        console.error("Failed to create group:", error);
        // Here you could show an error message to the user
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal title="Create a new group" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            id="group-name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="e.g., Trip to Bali"
            required
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Group Members</label>
            <p className="text-xs text-gray-500 mb-2">Add other members to the group. You are automatically included.</p>
            <div className="space-y-2">
                {members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={member}
                            onChange={(e) => handleMemberChange(index, e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            placeholder={`Member ${index + 1} Name`}
                        />
                         {members.length > 1 && (
                            <button type="button" onClick={() => removeMemberInput(index)} className="text-gray-400 hover:text-red-500 p-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addMemberInput} className="mt-2">
                Add another member
            </Button>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isLoading}>Create Group</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGroupModal;
