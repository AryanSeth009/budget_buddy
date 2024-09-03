"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import "@/app/components/Button.css";
import { ethers } from 'ethers';
import ExpenseForm from  "@/app/components/ExpenseForm";
import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'


declare global {
  interface Window {
    ethereum: any;  // Declare ethereum as any, or you can use a more specific type
  }
}
function Page() {
  interface Expense {
    _id: string;
    subject: string;

    personName: string;
    amount: number;
    date: string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const showForm = () => {
    setIsFormVisible(true);
  };
  const hideForm = () => {
    setIsFormVisible(false);
  };
  const saveExpenseHandler = async (expenseData: any) => {
    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const data = await response.json();
      console.log("Expense added:", data);
      hideForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };
  const core = new Core({
    projectId: process.env.PROJECT_ID
  })
  
  const web3wallet = async () => Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: {
      name: 'Demo app',
      description: 'Demo Client as Wallet/Peer',
      url: 'www.walletconnect.com',
      icons: []
    }
  })

  useEffect(() => {
    const initWeb3Wallet = async () => {
      try {
        const core = new Core({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        });
  
        await Web3Wallet.init({
          core,
          metadata: {
            name: 'Demo app',
            description: 'Demo Client as Wallet/Peer',
            url: 'www.walletconnect.com',
            icons: [],
          },
        });
      } catch (error) {
        console.error("Failed to initialize Web3Wallet:", error);
      }
    };
  
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expense");
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching recent expenses:", error);
      }
    };
  
    fetchExpenses();
    initWeb3Wallet();
  }, []);
  return (
    <div className="flex relative">
      <Sidebar />
      <div className="home_section flex flex-col gap-4 p-10 justify-center bg-black h-screen w-full">
        <div className="1st_row  flex flex-row justify-center gap-6 h-auto w-full rounded-xl">
          <div className="1st  ml-24 flex flex-col text-white p-4 h-[230px]  w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2 className="text-xl text-center font-semibold mb-2 ">
              Pending Task
            </h2>
            <div className="items flex flex-col">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex gap-4 items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                  </svg>
                  Pending Approvals
                </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>

            <div className="2nd-item flex flex-col pt-4">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex gap-4 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6246L5.96728 4.55896L7.89913 4.04124L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118ZM4.00013 19H20.0001V21H4.00013V19Z"></path>
                  </svg>
                  New Trips Registered
                </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>
            <div className="3rd-item flex flex-col pt-4">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex items-center  gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M2.00488 8.99979H21.0049C21.5572 8.99979 22.0049 9.4475 22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V8.99979ZM3.00488 2.99979H18.0049V6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM15.0049 13.9998V15.9998H18.0049V13.9998H15.0049Z"></path>
                  </svg>
                  Unreported Expenses
                </div>
                <span className="flex justify-end items-end place-items-end space-x-10">
                  6
                </span>
              </a>
            </div>
            <div className="4th-item flex flex-col pt-4">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex gap-4 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M21 13V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V13H2V11L3 6H21L22 11V13H21ZM5 13V19H19V13H5ZM4.03961 11H19.9604L19.3604 8H4.63961L4.03961 11ZM6 14H14V17H6V14ZM3 3H21V5H3V3Z"></path>
                  </svg>
                  Upcoming Expenses
                </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>
          </div>

          <div className="2nd h-full flex flex-col  text-white p-4 text-xl font-semibold self-center items-center w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2>Recent Expenses</h2>
            <div className="w-full flex items-center justify-center">
        
              <ul className="flex flex-col space-y-3  pt-4">
                <li className="flex gap-20   text-sm text-[#A4A4A4]">
                  <span className="text-sm text-[#A4A4A4]">Subject</span>
                  <span>Person</span>
                  <span>Date</span>
                  <span>Amount</span>
                </li>
               
                {expenses.map((expense) => (
                  <li key={expense._id} className="flex font-normal text-[#A4A4A4] gap-20  text-sm">
                    <span className="mr-2">{expense.subject}</span>
                    <span className="mr-2">{expense.personName}</span>
                    <span className="mr-2">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="">${expense.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="2nd_row ml-24 p-4 text-white text-xl font-semibold h-auto w-[1040px] bg-[#1B1B1B] rounded-md shadow-lg mt-2 mb-2 self-center">
          <div className="text-center pb-4">
            <h2>Quick Access</h2>
          </div>
          <div className="flex gap-10 justify-center  pt-4">
            <button className="first px-4 py-2 flex gap-4  bg-[#373A40] text-[#fff] rounded-md shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="border   border-yellow-300 rounded-full p-1"
                fill="rgba(240,187,64,1)"
              >
                <path d="M2.00488 8.99979H21.0049C21.5572 8.99979 22.0049 9.4475 22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V8.99979ZM3.00488 2.99979H18.0049V6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM15.0049 13.9998V15.9998H18.0049V13.9998H15.0049Z"></path>
              </svg>
              + ADD Balance
            </button>
            <button
              onClick={showForm}
              className="sec_btn px-4 py-2 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="border  border-red-300 rounded-full p-1"
                fill="rgba(255,46,46,1)"
              >
                <path d="M22.0049 10.9998V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V10.9998H22.0049ZM22.0049 6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V6.99979Z"></path>
              </svg>
              + New Expense
            </button>
            {isFormVisible && (
              <ExpenseForm 
                onSaveExpense={saveExpenseHandler}
                onCancel={hideForm}
              />
            )}
            <button className="thir_btn px-4 py-2 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="border  border-blue-300 rounded-full p-1"
                fill="rgba(70,146,221,1)"
              >
                <path d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6246L5.96728 4.55896L7.89913 4.04124L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118ZM4.00013 19H20.0001V21H4.00013V19Z"></path>
              </svg>
              + Create Trip
            </button>

            {/* <button className="for_btn px-4 py-2 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="border  border-purple-300 rounded-full p-1"
                fill="rgba(140,108,196,1)"
              >
                <path d="M20 2C21.6569 2 23 3.34315 23 5V7H21V19C21 20.6569 19.6569 22 18 22H4C2.34315 22 1 20.6569 1 19V17H17V19C17 19.5128 17.386 19.9355 17.8834 19.9933L18 20C18.5128 20 18.9355 19.614 18.9933 19.1166L19 19V15H3V5C3 3.34315 4.34315 2 6 2H20Z"></path>
              </svg>{" "}
              + ADD Receipt
            </button> */}
            <button  onClick={connectWallet} className="for_btn px-2 py-1 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="border  border-purple-300 rounded-full p-1"
                fill="rgba(140,108,196,1)"
              >
                <path d="M20 2C21.6569 2 23 3.34315 23 5V7H21V19C21 20.6569 19.6569 22 18 22H4C2.34315 22 1 20.6569 1 19V17H17V19C17 19.5128 17.386 19.9355 17.8834 19.9933L18 20C18.5128 20 18.9355 19.614 18.9933 19.1166L19 19V15H3V5C3 3.34315 4.34315 2 6 2H20Z"></path>
              </svg>{" "}
             
              + connect wallet
            </button>
          </div>
        </div>

        <div className="3rd_row p-4 ml-24 flex items-start  h-[300px] w-[1040px] justify-center self-center bg-[#1B1B1B]">
          <h2 className="text-white text-xl">Reports</h2>
        </div>
      </div>
    </div>
  );
}

export default Page;
