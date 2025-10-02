import React from 'react';

interface TotalBalanceCardProps {
    balance: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ balance }) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        }).format(amount);
    };

    const isOwed = balance > 0;
    const isOwing = balance < 0;
    const colorClass = isOwed ? 'text-green-600' : isOwing ? 'text-red-600' : 'text-gray-700';
    const label = isOwed ? "You are owed" : isOwing ? "You owe" : "You are all settled up";
    const bgColorClass = isOwed ? 'bg-green-50' : isOwing ? 'bg-red-50' : 'bg-gray-100';

    return (
        <div className={`rounded-lg shadow p-5 ${bgColorClass}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Your total balance
                    </p>
                    <p className={`text-2xl font-bold ${colorClass}`}>
                        {formatCurrency(Math.abs(balance))}
                    </p>
                     <p className={`text-sm font-medium ${colorClass}`}>
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TotalBalanceCard;
