"use client";
import React, { useEffect, useState } from "react";

function Page() {
  type Expense = {
    _id: string;
    subject: string;
    personName: string;
    amount: number;
    date: string;
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      console.log("Retrieved userId:", userId);
      console.log("Retrieved token:", token);

      if (!userId || !token) {
        console.error("User ID or token is missing");
        return;
      }

      try {
        const response = await fetch("/api/expenses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          console.error("Fetched data is not an array");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching expenses:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    fetchExpenses();
  }, []);
  const deleteExpense = async (expenseId: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }
  
    try {
      const response = await fetch(`/api/expenses?id=${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the expense");
      }
  
      // Remove the deleted expense from the state
      setExpenses((prevExpenses) => prevExpenses.filter(exp => exp._id !== expenseId));
      console.log(`Expense with id ${expenseId} deleted`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting expense:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };
  

  return (
    <div className="bg-black h-screen flex items-start justify-center">
      <div className="container rounded-lg bg-[#1B1B1B] mt-8 flex flex-col justify-start h-[800px] p-10 ml-52  w-full max-w-[1200px]">
        <div className="w-full flex justify-center p">
          <ul className="flex flex-col space-y-3 pt-4 w-auto">
            {/* Header */}
            <li className="flex justify-evenly gap-48 text-4xl pb-4 text-[#FFF1DB] w-full">
              <span className="w-[35%] uppercase font-semibold font-sans text-3xl text-[#FFF1DB]">
                Subject
              </span>
              <span className="w-[35%] uppercase font-semibold font-sans text-3xl">
                Person
              </span>
              <span className="w-[35%] uppercase font-semibold font-sans text-3xl">
                Date
              </span>
              <span className="w-[35%] uppercase font-semibold font-sans text-3xl">
                Amount
              </span>
            </li>

            {/* Mapping through expenses */}
            {expenses.slice(0, 5).map((expense) => (
              <li
                key={expense._id}
                className="flex justify-between font-normal gap-48 text-[#fff] text-sm w-full"
              >
                <span className="w-[25%] text-[16px] truncate">
                  {expense.subject}
                </span>
                <span className="w-[25%] text-[16px] truncate">
                  {expense.personName}
                </span>
                <span className="w-[25%] text-[16px] truncate">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                {/* Flex container to hold amount and delete icon */}
                <span className="w-[25%] gap-3 text-[16px] truncate flex items-center justify-between">
                ₹{expense.amount.toFixed(2)}
                  <a href=""  onClick={() => deleteExpense(expense._id)} className="ml-2  flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="rgba(255,255,255,1)"
                    >
                      <path d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7ZM13.4142 13.9997L15.182 12.232L13.7678 10.8178L12 12.5855L10.2322 10.8178L8.81802 12.232L10.5858 13.9997L8.81802 15.7675L10.2322 17.1817L12 15.4139L13.7678 17.1817L15.182 15.7675L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
                    </svg>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Page;
