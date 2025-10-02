
import React, { useState } from 'react';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import GroupList from './GroupList';
import GroupDetail from './GroupDetail';
import AddGroupModal from './AddGroupModal';
import Button from './Button';
import TotalBalanceCard from './TotalBalanceCard';

const Dashboard: React.FC = () => {
  const { groups } = useSplitwise();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(groups[0]?.id || null);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TotalBalanceCard />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="md:col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Groups</h2>
            <Button onClick={() => setIsAddGroupModalOpen(true)} size="sm">New Group</Button>
          </div>
          <GroupList
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={setSelectedGroupId}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          {selectedGroup ? (
            <GroupDetail group={selectedGroup} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Welcome to Splitwiser!</h2>
                <p className="mt-2 text-gray-500">Select a group to see details or create a new group to get started.</p>
            </div>
          )}
        </div>
      </div>
      {isAddGroupModalOpen && <AddGroupModal onClose={() => setIsAddGroupModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
