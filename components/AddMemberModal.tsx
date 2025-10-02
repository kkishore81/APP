
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
// Fix: Explicitly import from .tsx file to resolve conflict with empty .ts file.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import type { Group } from '../types';

interface AddMemberModalProps {
  group: Group;
  onClose: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ group, onClose }) => {
  const { addMemberToGroup } = useSplitwise();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addMemberToGroup(group.id, name.trim());
      onClose();
    }
  };

  return (
    <Modal title={`Add member to ${group.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="member-name" className="block text-sm font-medium text-gray-700">Member Name</label>
          <input
            type="text"
            id="member-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter new member's name"
            required
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit">Add Member</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
