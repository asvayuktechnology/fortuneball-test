import { TicketBall, TicketType } from "@/types/ticket";
import { colorBalls } from "@/utils/constant";

export const BULK_TICKET_OPTIONS = [5,10, 20, 50, 100, 200, 500, 1000] as const;

export const BULK_TICKETS_PAGE_SIZE = 5;

export const TICKETS_PER_ROW_BATCH = BULK_TICKETS_PAGE_SIZE;

export function createEmptyTickets(
  startId: number,
  count: number
): TicketType[] {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    numbers: [],
  }));
}

/** True when all rows are filled (ready for next batch). */
export function isLastTicketBatchComplete(tickets: TicketType[]): boolean {
  if (tickets.length === 0) return true;

  return tickets.every((ticket) => ticket.numbers.length === 6);
}

export function generateRandomTicketBalls(): TicketBall[] {
  return [...colorBalls].sort(() => 0.5 - Math.random()).slice(0, 6);
}

export function generateRandomTickets(count: number): TicketType[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    numbers: generateRandomTicketBalls(),
  }));
}

export function ticketToString(ticket: TicketType): string {
  return ticket.numbers.map((n) => n.digit).join("");
}

export function getValidTicketStrings(tickets: TicketType[]): string[] {
  return tickets
    .filter((ticket) => ticket.numbers.length === 6)
    .map(ticketToString);
}
