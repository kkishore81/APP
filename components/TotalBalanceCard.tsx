
import React from 'react';
// fix: Explicitly import from the .tsx file to resolve module ambiguity.
import { useSplitwise } from '../hooks/useSplitwise.tsx';

const TotalBalanceCard: React.FC = () => {
    const { calculateTotalBalance } = useSplitwise();
    const { totalOwedToYou, totalYouOwe } = calculateTotalBalance();

    const netBalance = totalOwedToYou - totalYouOwe;

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Overall Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500">You are owed</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalOwedToYou.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">You owe</p>
                    <p className="text-2xl font-bold text-red-600">₹{totalYouOwe.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Net balance</p>
                    <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netBalance >= 0 ? `+₹${netBalance.toFixed(2)}` : `-₹${Math.abs(netBalance).toFixed(2)}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TotalBalanceCard;
