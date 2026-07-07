import React, { useState } from "react";
import { Downlinedata } from "@/types/auth"
import { TablePagination } from "./Pagination";
interface ColumnConfig {
  header: string;
  accessor: string; // path to value, e.g. "sponsor.firstName"
}

interface TeamTableProps {
  members: Downlinedata[];
  columns: ColumnConfig[];
  pagination: {
    page: number;
    perPage: number;
    totalCout: number;
    handdePageChange: (page: number) => void;
  },
  isLoading?: boolean
}

// const getValue = (obj: any, path: string) => {
//   return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? '';
// };

const Table: React.FC<TeamTableProps> = ({ members, pagination, isLoading, columns }) => {


  return (
    <div>
      <div id="table-scroll" className="overflow-x-auto rounded-lg shadow bg-[#cbd5e117]">
        <table id="main-table" className="min-w-full text-sm text-left text-slate-200">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 border-b border-slate-400">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center px-4 py-6 text-gray-400">
                  Please wait...
                </td>
              </tr>
            ) :
              members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.customerCode} className="border-b border-zinc-200">
                    <td className="p-4">{member.firstName} {member.lastName}</td>
                    <td className="p-4">{member.customerCode}</td>
                    <td className="p-4">
                      {member.emailAddress.slice(0, 2)}*****@****.
                      {member.emailAddress.split(".").pop()}
                    </td>
                    <td className="p-4">{member.phoneNumber}</td>
                    <td className="p-4">{member.sponsor.firstName} {member.sponsor.lastName}</td>
                    <td className="p-4">{member.level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-6 text-gray-400">
                    No team members found.
                  </td>
                </tr>
              )}

          </tbody>
        </table>
        <TablePagination  {...pagination} />
      </div>
    </div>
  );
};

export default Table;
