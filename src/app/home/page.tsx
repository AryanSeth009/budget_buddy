"use client"
import React,{useState, useEffect} from "react";
import Sidebar from "@/app/components/Sidebar";

function Page() {
  interface Expense {
    _id: string;
    subject: string;
    personName: string;
    amount: number;
    date: string;
  }
  
 
    const [expenses, setExpenses] = useState<Expense[]>([]);
  
    useEffect(() => {
      const fetchExpenses = async () => {
        try {
          const response = await fetch('/api/expense');
          const data = await response.json();
          setExpenses(data);
        } catch (error) {
          console.error('Error fetching recent expenses:', error);
        }
      };
  
      fetchExpenses();
    }, []);
  return (
    <div className="flex">
      <Sidebar />
      <div className="home_section flex flex-col gap-8 p-10 justify-center bg-black h-screen w-full">
        <div className="1st_row flex flex-row justify-center gap-10 h-auto w-full rounded-xl">
          <div className="1st  ml-32 flex flex-col text-white p-4 mb-4 h-full w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2 className="text-xl text-center font-semibold mb-4">
              Pending Task
            </h2>
            <div className="items flex flex-col">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-gray-400 text-md"
              >
                <div className="flex gap-4 items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(97,36,211,1)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path></svg>
                Pending Approvals
                </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>

            <div className="2nd-item flex flex-col pt-4">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-gray-400 text-md"
              >
               <div className="flex gap-4 items-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(97,36,211,1)"><path d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6326L5.96728 4.55896L7.89913 4.04132L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118ZM4.00013 19H20.0001V21H4.00013V19Z"></path></svg>
                New Trips Registered
               </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>
            <div className="3rd-item flex flex-col pt-4">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-gray-400 text-md"
              >
                <div className="flex items-center  gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(97,36,211,1)"><path d="M2.00488 8.99979H21.0049C21.5572 8.99979 22.0049 9.4475 22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V8.99979ZM3.00488 2.99979H18.0049V6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM15.0049 13.9998V15.9998H18.0049V13.9998H15.0049Z"></path></svg>
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
                className="flex justify-between items-center gap-4 text-gray-400 text-md"
              >
                <div className="flex gap-4 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(97,36,211,1)"><path d="M21 13V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V13H2V11L3 6H21L22 11V13H21ZM5 13V19H19V13H5ZM4.03961 11H19.9604L19.3604 8H4.63961L4.03961 11ZM6 14H14V17H6V14ZM3 3H21V5H3V3Z"></path></svg>
                Upcoming Expenses
                </div>
                <span className="items-end space-x-10">6</span>
              </a>
            </div>
          </div>

          <div className="2nd flex items-start text-white p-4 text-xl font-semibold justify-center h-full w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2>Recent Expenses</h2>
            <ul>
        {expenses.map(expense => (
          <li key={expense._id}>
            <span>{expense.subject}</span>
            <span>{expense.personName}</span>
            <span>{new Date(expense.date).toLocaleDateString()}</span>
            <span>${expense.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
          </div>
        </div>
        <div className="2nd_row  flex p-4 text-white justify-center ml-32 items-top text-xl font-semibold h-[300px] w-[1040px] bg-[#1B1B1B] rounded-md shadow-lg self-center mt-8">
          <p>Quick access</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
