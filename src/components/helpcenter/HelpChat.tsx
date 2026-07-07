"use client";

import { useFetchTicketDetails, useReplyTicket } from "@/services/helpCenterService";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../ui/common/Loader";
import { dateTimeFormat } from "@/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaInput from "../ui/common/input/TextAreaInput";
import toast from 'react-hot-toast';
import { IoClose, IoArrowBack  } from "react-icons/io5";
import Link from "next/link";
import Button from "../ui/common/input/Button";

const validationSchema = z.object({
  message: z.string().min(1, 'Please type a message.'),
});

type TicketData = z.infer<typeof validationSchema>;

export default function HelpChat({ chatId }: { chatId: string }) {
  const [loader, setLoader] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, refetch } = useFetchTicketDetails(chatId);
  const { mutateAsync: ticketReply } = useReplyTicket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketData>({
    resolver: zodResolver(validationSchema),
  });

  const ticket = data?.ticket;

  // Refetch on chatId change
  useEffect(() => {
    if (chatId) refetch();
  }, [chatId]);

  // Auto scroll to bottom when data updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  const onSubmit = async (data: TicketData) => {
    try {
      setLoader(true);
      await ticketReply({
        ticketId: chatId,
        body: data,
      });

      reset();
      await refetch(); // ensure latest reply fetched
      toast.success("Reply sent successfully");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Reply failed";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 text-center  rounded-lg  my-10 ">
        <Loader />
      </div>
    );
  }

  // If no ticket found, show nothing except message
  if (!ticket) {
    return (
      <div className="max-w-md mx-auto p-6 text-center border rounded-lg shadow text-white bg-[#e2e3ff] my-10">
        No Ticket Found
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto border-0 shadow-md rounded-lg overflow-hidden  px-5 my-10 bg-[#29292f] text-white">
      {/* Header */}
      <div className=" py-4 border-b relative border-gray-400 flex items-end ">
        <Link href={"/user/helpcenter"}>
          <IoArrowBack size={22} className="absolute top-1.5 -right-0 cursor-pointer text-[#ffc428]" />
        </Link>
        <div>
          <div className="text-sm font-semibold text-[#888899]">
            {ticket._id ? `Ticket# ${ticket._id}` : "Ticket Details"}
          </div>
          <div className="text-lg font-bold text-[#ffc428]">
            {ticket.message.length > 30
              ? ticket.message.slice(0, 30) + "..."
              : ticket.message}
          </div>
        </div>

        {ticket.status && (
          <span className="bg-[#ffc428] text-black rounded-full text-xs font-semibold px-2 py-1 ml-5">
            {ticket.status}
          </span>
        )}
      </div>

      {/* Chat Messages */}
      <div
        className=" chatarea py-4 space-y-6 max-h-[400px] overflow-y-auto  text-white px-2 "
        ref={scrollRef}
      >

        {/* Customer's original message */}
        <div className="flex border-dashed border-b border-white/30 pb-4">
          <div className=" text-white ">

            <div className="text-sm font-semibold ">
              {ticket.customer?.name || "Customer"}
            </div>
            <p className="text-sm whitespace-pre-wrap text-white">{ticket.message}</p>
            <div className="text-[11px] text-white/40 font-semibold mt-1">
              {dateTimeFormat(ticket.createdAt)}
            </div>
          </div>
        </div>

        {/* Replies */}
        {ticket.replies &&
          ticket.replies.map((reply: any) => (
            <div key={reply._id} className={`flex w-full text-end border-dashed border-b border-white/20 pb-4 ${reply.admin === 0 ? 'justify-end text-end' : 'justify-start text-start'
              } `}>
              <div className="00 text-white p-0 w-full ">
                <div className="text-sm font-bold">
                 {reply.admin === 0 ? 'You': "Customer Support"}
                </div>
                <p className="text-sm whitespace-pre-wrap text-white/90">{reply.message}</p>
                <div className="text-[11px] text-white/40 font-semibold mt-1">
                  {dateTimeFormat(reply.createdAt)}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Reply Form */}
      {ticket.status !== "Resolved" && (
        <form onSubmit={handleSubmit(onSubmit)} className="pb-4  ">
          <TextAreaInput
            name="message"
            label="Reply"
            register={register}
            error={errors.message}
            className=" border-1 border-white/15 focus:border-white focus:border-1 bg-transparent  text-black"
            labelstyle="text-black font-semibold text-[12px] mb-2"

          />
          <button
            type="submit"
            disabled={loader}
            className="w-full bg-[#ffc428] text-black font-semibold py-2 rounded hover:bg-[#49494f] hover:text-white cursor-pointer"
          >
            {loader ? "Sending..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
