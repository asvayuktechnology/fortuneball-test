'use client';
import React, { useState } from 'react';

export type ListCardData = {
  index: number;
  mainData: string[]; // Withdrawal ID, Name, Amount, Date
  secondaryData: { name: string; value: string }[];
  colTemplate?: string;
};

const ListCard: React.FC<ListCardData> = ({ index, mainData, secondaryData, colTemplate }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-white/10 rounded-md mb-2 bg-white/5 text-white">
      <div
        className={`grid ${colTemplate} items-center px-4 py-2 cursor-pointer`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <span className="text-xs">{index}</span>
        {mainData.map((item, key) => (
          <span className="text-xs truncate" key={key}>{item}</span>
        ))}
        <div className="flex justify-end">
          <span className="bg-green-700 text-xs px-3 py-1 rounded-sm">↓</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-[11px] text-slate-950 px-4 py-2 bg-[#292930] rounded-b-md space-y-1">
          {secondaryData.map((item, key) => (
            <div key={key}><strong>{item.name}</strong>: {item.value}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCard;
