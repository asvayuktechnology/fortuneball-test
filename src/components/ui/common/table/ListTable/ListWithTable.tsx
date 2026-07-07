'use client';
import React from 'react';

type TableProps<T> = {
    columns: { key: keyof T; label: string }[];
    data: T[];
    showAction?: boolean;
};

const DynamicTable = <T extends Record<string, any>>({
    columns,
    data,
    showAction = false,
}: TableProps<T>) => {
    return (
        <div className="w-full">
            <table className="min-w-full table-auto border rounded-lg text-white bg-[#23025b]">
                    <thead>
                        <tr className="bg-[#32076f] text-left text-sm">
                            <th className="py-2 px-4 border-r border-purple-700">#</th>
                            {columns.map((col) => (
                                <th key={String(col.key)} className="py-2 px-4 border-r border-purple-700">
                                    {col.label}
                                </th>
                            ))}
                            {showAction && <th className="py-2 px-4">Show more</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="text-sm bg-[#3a0a7d] border-t border-purple-700 hover:bg-[#4e13a1]"
                            >
                                <td className="py-2 px-4 border-r border-purple-700">{index + 1}</td>
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="py-2 px-4 border-r border-purple-700 truncate">
                                        {row[col.key]}
                                    </td>
                                ))}
                                {showAction && (
                                    <td className="py-2 px-4">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
                                            ↓
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default DynamicTable;



type Transaction = {
    withdrawalId: string;
    name: string;
    amount: number;
    date: string;
};

const tableColumns = [
    { key: 'withdrawalId', label: 'Withdrawal ID' },
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
] as const satisfies { key: keyof Transaction; label: string }[];


const tableData: Transaction[] = [
    {
        withdrawalId: '68527f040876556ac00a3a86',
        name: 'Customer new2',
        amount: 65.745,
        date: 'Jun 27, 2025 7:30 AM',
    },
];

export const ListTable = () => {
    return (
        <div className="p-4 bg-gradient-to-b from-purple-900 to-indigo-900 min-h-screen">
            <DynamicTable columns={tableColumns} data={tableData} showAction />
        </div>
    );
};