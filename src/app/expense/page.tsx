"use client";
import React, { useState } from "react";

const page: React.FC<{
  onSaveExpense: (expenseData: any) => void;
  onCancel: () => void;
}> = ({ onSaveExpense, onCancel }) => {
  const [subject, setSubject] = useState("");
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [date, setDate] = useState("");

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const expenseData = {
      subject,
      personName,
      amount: +amount, // Ensure amount is a number
      date: new Date(date), // Ensure date is a Date object
    };

    onSaveExpense(expenseData);
  };

  return (
    <div className="flex bg-[#0F0F10] items-center h-screen  w-auto justify-center align-middle self-center pb-10">
      <form
        onSubmit={submitHandler}
        className="bg-white bg-opacity-5 flex-row items-center align-middle w-[400px] h-[550px]  text-white rounded-md border-1 p-8"
      >
        <h2 className="text-center text-3xl">Add Transaction Detail</h2>
        <div className="flex flex-col  w-auto text-[#E7E7E4 gap-6 pt-12">
          <div className="text-[#E7E7E4] flex flex-col gap-4">
            <label >Subject</label>
            <input
              type="text" placeholder="Enter Subject"
              className="rounded-lg p-1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Person Name</label>
            <input
              type="text" placeholder="Enter Person Name"
              className="rounded-lg p-1"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Amount</label>
            <input 
              type="number" placeholder="Enter Amount"
              className="rounded-lg p-1 text-gray-400"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col ">
            <label>Date</label>
            <input 
              type="date" placeholder="Enter Date"
              className="rounded-lg p-1 text-gray-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="text-end pt-6">
          <button
            type="submit"
            className="text-black rounded-md p-2  w-auto text-center  bg-[#E7E7E4]"
          >
            Add Expense
          </button>
        </div>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
   
  );
};

export default page;
