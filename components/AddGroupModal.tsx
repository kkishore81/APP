
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';

interface AddGroupModalProps {
  onClose: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ onClose }) => {
  const { addGroup } = useSplitwise();
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && members.trim()) {
      addGroup(name, members);
      onClose();
    }
  };

  return (
    <Modal title="Create a new group" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            id="group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="e.g., Vacation Getaway"
            required
          />
        </div>
        <div>
          <label htmlFor="group-members" className="block text-sm font-medium text-gray-700">Group Members</label>
          <textarea
            id="group-members"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter names, separated by commas. 'You' will be added automatically."
            required
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit">Create Group</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGroupModal;
