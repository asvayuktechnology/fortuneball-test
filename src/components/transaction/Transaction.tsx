"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "../ui/common/pagetitle/PageTitle";
import { MyTransactionList } from "./TransactionTable";

const Transaction = () => {

  return (
    <div className="container mx-auto mt-8 px-4">
      <PageTitle title="My Transaction History" />
      <div className="mb-6 text-white rounded-xl  md:p-6 sm:py-6 py-2 px-3">
        <MyTransactionList />
      </div>
    </div>
  );
};

export default Transaction;
