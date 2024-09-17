"use client";
import React, { useState } from "react";

const ExpenseForm: React.FC<{
  onSaveExpense: (expenseData: { subject: string; personName: string; amount: number; date: Date; userId: string }) => void;
  onCancel: () => void;
  userId: string | null; // Add userId as a prop
}> = ({ onSaveExpense, onCancel, userId }) => {
  const [subject, setSubject] = useState("");
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [date, setDate] = useState("");

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const expenseData = {
      subject,
      personName,
      amount: +amount, // Ensure amount is a number
      date: new Date(date), // Ensure date is a Date object
      userId, // Include userId in the expense data
    };

    onSaveExpense(expenseData);
  };

  return (
    <div className="flex absolute bg-[#0F0F10] font-sans items-center h-fit w-screen bg-opacity-95 ml-[22.5rem] justify-center align-middle self-center pb-72">
      <form
        onSubmit={submitHandler}
        className="bg-white mt-20 bg-opacity-5 flex-row mr-32 mb-20 items-center align-middle w-[450px] h-auto text-white rounded-md border-1 p-8"
      >
        <h2 className="text-center text-3xl">Add Transaction Detail</h2>
        <div className="flex flex-col font-light w-auto text-[#E7E7E4] gap-6 pt-10">
          <div className="text-[#E7E7E4] flex flex-col gap-2">
            <label>Subject</label>
            <input
              type="text" placeholder="Enter Subject"
              className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border border-1 bg-opacity-90"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 text-[#E7E7E4]">
            <label>Person Name</label>
            <input
              type="text" placeholder="Enter Person Name"
              className="rounded-lg p-1 text-[#E7E7E4] pl-4 border bg-[#0F0F10]"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Amount</label>
            <input 
              type="number" placeholder="Enter Amount"
              className="rounded-lg p-1 pl-4 bg-[#0F0F10] border text-[#E7E7E4]"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Date</label>
            <input 
              type="date" placeholder="Enter Date"
              className="rounded-lg p-1 pl-4 bg-[#0F0F10] border text-[#E7E7E4]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-row space-x-28 text-end pt-6">
          <button type="button" className="flex mr-0 bg-[#E7E7E4] rounded-md self-start" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="text-black rounded-md p-2 pb w-auto text-center bg-[#E7E7E4]"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
