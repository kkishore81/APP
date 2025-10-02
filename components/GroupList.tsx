
import React from 'react';
import type { Group } from '../types';
import { UsersIcon } from './icons';

interface GroupListProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, selectedGroupId, onSelectGroup }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {groups.map((group) => (
          <li key={group.id}>
            <button
              onClick={() => onSelectGroup(group.id)}
              className={`w-full text-left p-4 transition-colors duration-150 ${
                selectedGroupId === group.id
                  ? 'bg-teal-50 border-l-4 border-teal-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${ selectedGroupId === group.id ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`font-semibold ${selectedGroupId === group.id ? 'text-teal-700' : 'text-gray-800'}`}>{group.name}</p>
                    <p className="text-sm text-gray-500">{group.memberIds.length} members</p>
                  </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;