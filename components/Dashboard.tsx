
import React, { useState, useMemo } from 'react';
// Fix: Explicitly import from .tsx file to resolve conflict with empty .ts file.
import { useSplitwise } from '../hooks/useSplitwise.tsx';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import GroupList from './GroupList';
import GroupDetail from './GroupDetail';
import Button from './Button';
import AddGroupModal from './AddGroupModal';
import TotalBalanceCard from './TotalBalanceCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { groups, loading } = useSplitwise();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);

  // Set the first group as selected by default
  React.useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId);
  }, [groups, selectedGroupId]);

  const totalBalance = useMemo(() => {
    if (!user) return 0;
    return groups.reduce((acc, group) => {
        const userMember = group.members.find(m => m.id === user.id);
        return acc + (userMember?.balance || 0);
    }, 0);
  }, [groups, user]);

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <p>Loading your data...</p>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <TotalBalanceCard balance={totalBalance} />
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Groups</h2>
                    <Button onClick={() => setAddGroupModalOpen(true)} size="sm">New Group</Button>
                </div>
                {groups.length > 0 ? (
                    <GroupList 
                        groups={groups} 
                        selectedGroupId={selectedGroupId} 
                        onSelectGroup={setSelectedGroupId}
                    />
                ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">You're not in any groups yet.</p>
                        <Button onClick={() => setAddGroupModalOpen(true)} className="mt-4">
                            Create your first group
                        </Button>
                    </div>
                )}
            </div>
            <div className="lg:col-span-2">
                {selectedGroup ? (
                    <GroupDetail group={selectedGroup} />
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">Select a group</h2>
                        <p className="mt-2 text-gray-500">Choose a group from the list to see its details.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      {isAddGroupModalOpen && <AddGroupModal onClose={() => setAddGroupModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
