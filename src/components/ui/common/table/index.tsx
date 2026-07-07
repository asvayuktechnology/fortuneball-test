import React from "react";
import { TablePagination } from "./Pagination";

type ColumnConf<T> = {
    field: string;
    cell: (row: T, index: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    width?: string;
};

interface TeamTableProps<T> {
    data: T[];
    columns: ColumnConf<T>[];
    pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        handlePageChange: (page: number) => void;
    };
    isLoading?: boolean;
    tableClassName?: string;
    rowClassName?: string;
}

const TableDataLoader = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="text-center p-6 text-gray-400">
            <div className="flex justify-center">
                <div className="animate-spin rounded-full  w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </td>
    </tr>
);

const BlankRow = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="text-center p-6 text-gray-400">
            <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No data found</span>
            </div>
        </td>
    </tr>
);

const Table = <T,>({
    data,
    pagination,
    isLoading,
    columns,
    tableClassName = "",
    rowClassName = "hover:bg-gray-50/10"
}: TeamTableProps<T>) => {
    const { page, perPage } = pagination;

    return (
        <div className="flex flex-col space-y-4 ">
            <div className={`overflow-x-auto rounded-lg   ${tableClassName}`}>
                <table className="w-full border-separate border-spacing-y-2">
                    <thead className="">
                        <tr >
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${col.headerClassName || ""}`}
                                    style={{ width: col.width }}
                                >
                                    {col.field}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <TableDataLoader colSpan={columns.length} />
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => {
                                const absoluteIndex = (page - 1) * perPage + rowIndex;

                                return (
                                    <tr
                                        key={absoluteIndex}
                                        className={`transition-colors ${rowClassName}`}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`px-4 py-3 text-sm ${col.cellClassName || "text-gray-200"}`}
                                            >
                                                {col.cell(row, absoluteIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <BlankRow colSpan={columns.length} />
                        )}
                    </tbody>
                </table>
            </div>
            {pagination.totalCount > 0 && (
                <TablePagination {...pagination} />
            )}
        </div>
    );
};

export default Table;
