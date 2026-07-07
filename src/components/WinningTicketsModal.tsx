"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

export interface WinningTicket {
  ticketNumber: string;
  prizeLevel: number;
  prizeName: string;
  prizeAmount: number;
  claimed: boolean;
  matchedDigits: number;
  matchedNumbers: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  tickets: WinningTicket[];
}

const ITEMS_PER_PAGE = 10;

export default function WinningTicketsModal({ open, onClose, tickets }: Props) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!open) return null;

  const hasMore = visibleCount < tickets.length;
  const visibleTickets = tickets.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-[28px] border border-[#9a39e8] bg-[linear-gradient(180deg,#2a0a68_0%,#16053f_100%)] shadow-[0_0_30px_rgba(154,57,232,0.35)] p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Winning Tickets</h2>
          <button onClick={onClose} className="cursor-pointer text-white/50 hover:text-white transition">
            <IoClose size={22} />
          </button>
        </div>

        {tickets.length === 0 ? (
          <p className="text-center text-sm text-white/50 py-8">No tickets found</p>
        ) : (
          <>
            <div className="space-y-2">
              {visibleTickets.map((ticket) => (
                <div key={ticket.ticketNumber} className="rounded-xl border border-[#7c56ff]/30 bg-[#1a0d40] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">#{ticket.ticketNumber}</span>
                    {ticket.claimed ? (
                      <span className="text-[10px] text-green-400 border border-green-400/30 rounded-full px-2 py-0.5">
                        Claimed
                      </span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">
                        Unclaimed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium text-[#ffc928]">{ticket.prizeName}</p>
                      <p className="text-[10px] text-white/60">{ticket.prizeAmount} MTHT</p>
                    </div>
                    <div className="flex gap-1">
                      {ticket.matchedNumbers.map((num) => (
                        <span
                          key={num}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7c56ff] text-[10px] font-bold text-white"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="mt-4 w-full rounded-full border border-[#9a39e8] py-2.5 text-sm font-semibold text-white hover:bg-[#9a39e8]/20 transition cursor-pointer"
              >
                Load More ({visibleCount}/{tickets.length})
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
