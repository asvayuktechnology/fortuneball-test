import React from 'react';
type Props = {
    page: number;
    perPage: number;
    totalCount: number;
    handlePageChange: (page: number) => void;
}
export const TablePagination = (props: Props) => {
    const { page, perPage, totalCount, handlePageChange } = props;
    const totalPages = Math.ceil(totalCount / perPage);
    const handlePageMove = (type: 'next' | 'pre') => {
        let updatedPage = 1;
        if (type === 'next') {
            if (page < totalPages) {
                updatedPage = Math.max(page + 1, 1);
                handlePageChange(updatedPage);
            }
        }
        if (type === 'pre') {
            if (page > 0) {
                updatedPage = Math.max(page - 1, 1);
                handlePageChange(updatedPage);
            }
        };
    }
    return (
        <div className="flex items-center justify-between border-t border-white/20  px-4 py-3 sm:px-6">
            <div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between text-slate-200">
                <div className="">
                    <p className="text-sm">
                        Showing
                        <span className="font-medium ml-2 mr-2">
                            {totalCount === 0 ? 0 : (page - 1) * perPage + 1}
                        </span>
                        to
                        <span className="font-medium ml-2 mr-2">
                            {Math.min(page * perPage, totalCount)}
                        </span>
                        of
                        <span className="font-medium ml-2 mr-2">{totalCount}</span>
                        records
                    </p>
                </div>
                <div>
                    <div
                        className="isolate inline-flex -space-x-px rounded-md shadow-xs"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => handlePageMove('pre')}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <span
                            aria-current="page"
                            className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {page}
                        </span>


                        <button
                            onClick={() => handlePageMove('next')}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}