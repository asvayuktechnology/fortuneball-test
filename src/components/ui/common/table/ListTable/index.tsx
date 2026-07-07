'use client';
import React from 'react';
import ListCard, { ListCardData } from './ListCard';
import Button from '../../input/Button';

type Props = {
    data: ListCardData[];
    totalCount: number;
    currentLimit: number;
    pageLimit: number;
    handleLimitChange: (limit: number) => void;
    header: string[]
};

export const BlankRow = () => (
  // <div className="flex flex-col items-center space-y-2 text-white py-8">
  //     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //     </svg>
  //     <span>No data found</span>
  // </div>
  <div className="flex flex-col items-center space-y-2 text-white py-8">
    <svg
      className="w-8 h-8 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>No data found</span>
  </div>
);


const ListTable: React.FC<Props> = ({ data, totalCount, currentLimit, pageLimit, handleLimitChange, header }) => {
    let gridCols = '';
    if (header?.length == 3) gridCols = 'grid-cols-[40px_1.8fr_1fr_1.5fr_70px]';
    if (header?.length == 2) gridCols = 'grid-cols-[40px_1.8fr_1fr_70px]';
    else gridCols = 'grid-cols-[40px_1.8fr_1.2fr_1fr_1.5fr_70px]';
    return (
        <div className='overflow-x-auto'>
            <div className='min-w-[600px]'>
                {data?.length < 1 ? (
                    <BlankRow />
                ) : (
                    <>
                        {/* Header */}
                        <div className={`grid ${gridCols} text-xs text-slate-300 px-4 mb-4`}>
                            <span>#</span>
                            {header?.map((title, key) => (<span key={key}>{title}</span>))}
                            <span className=''>Show more</span>
                        </div>

                        {/* Rows */}
                        {data.map((item, idx) => (
                            <ListCard key={idx} {...item} colTemplate={gridCols} />
                        ))}

                        {/* Load More */}
                        {totalCount > currentLimit && (
                            <div className="flex justify-center mt-4">
                                {/* <Button text="Load More" onClick={() => handleLimitChange(currentLimit + pageLimit)} /> */}
                                <Button text='' className='loadmore relative' onClick={() => handleLimitChange(currentLimit + pageLimit)} >
                                <span className="circle" aria-hidden="true">
                                    <span className="icon arrow"></span>
                                </span>
                                <span className="button-text">Load More</span>
                            </Button>
                            </div>
                        )}
            </>
                )}
        </div>
        </div >

    );
};

export default ListTable;
