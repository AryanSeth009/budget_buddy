"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import "@/app/components/Button.css";
import { ethers } from "ethers";
import ExpenseForm from "@/app/components/ExpenseForm";
import TripForm from "@/app/components/TripForm";
import { differenceInCalendarWeeks, startOfWeek, formatISO } from "date-fns";
import WeeklyExpenseChart from "@/app/components/WeeklyExpenseChart";
import BalanceForm from "../components/Balance";
import Balance from "../models/Balance";
declare global {
  interface Window {
    ethereum: any; // Declare ethereum as any, or you can use a more specific type
  }
}

const EtherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

function Page() {
  type Expense = {
    _id: string;
    subject: string;
    personName: string;
    amount: number;
    date: string;
  };
  const [tripCount, setTripCount] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null); // Add balance state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isBalanceFormVisible, setIsBalanceFormVisible] = useState(false);
  const [isTripFormVisible, setTripFormVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Add userId state
  const [weeklyExpenses, setWeeklyExpenses] = useState<
    { week: string; total: number }[]
  >([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  type ExpensePayload = {
    expenseData: any;
    userId: string;
  };

  const showForm = () => {
    setIsFormVisible(true);
  };

  const showTripForm = () => {
    setTripFormVisible(true);
  };
  const showBalanceForm = () => {
    setIsBalanceFormVisible(true);
  };
  const hideBalanceForm = () => {
    setIsBalanceFormVisible(false);
  };

  const hideForm = () => {
    setIsFormVisible(false);
  };

  const hideTripForm = () => {
    setTripFormVisible(false);
  };
  const fetchBalance = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in sessionStorage");
      return;
    }

    try {
      const response = await fetch(`/api/balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Make sure this token is being sent
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTripCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("User token is missing");
          return;
        }

        const response = await fetch("/api/trip?count=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trip count");
        }

        const data = await response.json();
        setTripCount(data.tripCount);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchTripCount();
  }, []);

  //Total Amount
  const fetchTotalExpenses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }

      const response = await fetch("/api/expenses?total=true", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTotalAmount(data.totalAmount); // Set total amount in state
      } else {
        console.error("Failed to fetch total expenses:", await response.json());
      }
    } catch (error) {
      console.error("An error occurred while fetching total expenses:", error);
    }
  };

  // Fetch total expenses on component mount
  useEffect(() => {
    fetchTotalExpenses();
  }, []);

  const saveBalanceHandler = async (balanceData: {
    balance: number | null;
    userId: string;
  }) => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("/api/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify({ balance: balanceData.balance, userId }), // Pass the balance and userId
      });

      if (!response.ok) {
        throw new Error("Failed to add balance");
      }

      const responseData = await response.json();
      console.log("Balance added successfully:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveExpenseHandler = async (expenseData: {
    subject: string;
    personName: string;
    amount: number;
    date: Date;
    userId: string;
  }) => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        console.error("No token found");
        return;
      }

      const { userId, ...data } = expenseData;
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify({ ...data, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const responseData = await response.json();
      console.log("Expense added:", responseData);
      hideForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveTripHandler = async (tripData: {
    userId: string;
    TripName: string;
    Destination: string;
    Amount: number;
    StartDate: Date;
    EndDate: Date;
    method: string;
    Note?: string; // Optional field
  }) => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token from sessionStorage
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const { userId, ...data } = tripData;
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
        body: JSON.stringify({ ...data, userId }), // Include all required fields
      });
  
      if (!response.ok) {
        throw new Error("Failed to save the trip");
      }
  
      const responseData = await response.json();
      console.log("Trip saved successfully:", responseData);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };
  
  

  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // Assuming userId is derived from the account address or similar
        setUserId(accounts[0]); // Or fetch the user ID from your backend if applicable
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  useEffect(() => {
    const fetchMetaMaskTransactions = async () => {
      if (!account) return;

      try {
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=asc&apikey=${EtherscanApiKey}`
        );

        const textResponse = await response.text();
        console.log("Raw Response:", textResponse);

        const data = JSON.parse(textResponse);

        if (data.result) {
          const metaMaskExpenses = data.result.map((tx: any) => ({
            _id: tx.hash,
            subject: "MetaMask Transaction",
            personName: account,
            amount: parseFloat(ethers.utils.formatEther(tx.value)),
            date: new Date(tx.timeStamp * 1000).toISOString(),
          }));

          setExpenses((prevExpenses) => [...prevExpenses, ...metaMaskExpenses]);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
  });
  useEffect(() => {
    const fetchExpenses = async () => {
      const userId = sessionStorage.getItem("userId"); // Get userId from sessionStorage
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage

      console.log("Retrieved userId:", userId); // Debug log for userId
      console.log("Retrieved token:", token); // Debug log for token

      if (!userId || !token) {
        console.error("User ID or token is missing");
        return;
      }

      try {
        const response = await fetch("/api/expenses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
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

  useEffect(() => {
    const fetchWeeklyExpenses = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/expenses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        // Group expenses by week
        const expenseMap: { [key: string]: number } = {};

        data.forEach((expense) => {
          const expenseDate = new Date(expense.date);
          const startOfCurrentWeek = startOfWeek(expenseDate, {
            weekStartsOn: 1,
          }); // Monday as start of week
          const weekKey = formatISO(startOfCurrentWeek, {
            representation: "date",
          });

          if (!expenseMap[weekKey]) {
            expenseMap[weekKey] = 0;
          }
          expenseMap[weekKey] += expense.amount; // Summing up the amounts for the same week
        });

        const weeklyExpenseArray = Object.keys(expenseMap).map((week) => ({
          week,
          total: expenseMap[week],
        }));

        setWeeklyExpenses(weeklyExpenseArray);
      }
    };

    fetchWeeklyExpenses();
  }, []);

  return (
    <div className="flex relative">
      <Sidebar />
      <div className="home_section flex flex-col gap-4 p-10 justify-center bg-black h-screen w-full">
        <div className="1st_row  flex flex-row justify-center gap-6 h-auto w-full rounded-xl">
          <div className="1st pt-5 ml-24 flex flex-col text-white p-4 h-[230px]  w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2 className="text-xl text-center font-semibold mb-2 ">
              Financial Data
            </h2>
            <div className="items flex flex-col text-lg">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex gap-4 items-center pt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                  </svg>
                  Total Income
                </div>
                <span className="items-end space-x-10">
                  + ₹{balance !== null ? `${balance}` : "Loading..."}
                </span>{" "}
              </a>
            </div>

            <div className="2nd-item flex flex-col pt-6 text-lg">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex gap-4 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6246L5.96728 4.55896L7.89913 4.04124L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118ZM4.00013 19H20.0001V21H4.00013V19Z"></path>
                  </svg>
                  New Trips Registered
                </div>
                {error ? (
                  <p className="error">{error}</p>
                ) : (
                  <p>
                     {tripCount !== null ? tripCount : "Loading..."}
                  </p>
                )}
              </a>
            </div>
            <div className="3rd-item flex flex-col pt-6 text-lg">
              <a
                href=""
                className="flex justify-between items-center gap-4 text-[#A4A4A4] text-md"
              >
                <div className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="rgba(97,36,211,1)"
                  >
                    <path d="M2.00488 8.99979H21.0049C21.5572 8.99979 22.0049 9.4475 22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V8.99979ZM3.00488 2.99979H18.0049V6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM15.0049 13.9998V15.9998H18.0049V13.9998H15.0049Z"></path>
                  </svg>
                  Total Expenses
                </div>
                <span className="flex justify-end items-end place-items-end space-x-10">
                  - ₹
                  {typeof totalAmount === "number"
                    ? totalAmount.toFixed(2)
                    : "Loading..."}
                </span>
              </a>
            </div>
          </div>
          <div className="2nd h-full flex flex-col text-white p-4 text-xl font-semibold self-center items-center w-[500px] bg-[#1B1B1B] rounded-md shadow-lg">
            <h2>Recent Expenses</h2>
            <div className="w-full flex ml-10 items-center justify-center">
              <ul className="flex flex-col space-y-3   pt-4 w-full">
                {/* Header */}
                <li className="flex  justify-between text-sm text-[#A4A4A4] w-full">
                  <span className="w-[25%] text-sm text-[#A4A4A4]">
                    Subject
                  </span>
                  <span className="w-[25%] text-sm">Person</span>
                  <span className="w-[25%] text-sm">Date</span>
                  <span className="w-[25%] text-sm">Amount</span>
                </li>

                {/* Mapping through expenses (including MetaMask transactions) */}
                {expenses.slice(0, 5).map((expense) => (
                  <li
                    key={expense._id}
                    className="flex justify-between font-normal text-[#A4A4A4] text-sm w-full"
                  >
                    <span className="w-[25%] text-[14px] truncate">
                      {expense.subject}
                    </span>
                    <span className="w-[25%] text-[12px] truncate">
                      {expense.personName}
                    </span>
                    <span className="w-[25%] text-[14px] truncate">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="w-[25%] text-[14px] truncate">
                      ₹{expense.amount.toFixed(2)}
                    </span>
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
            <button
              onClick={showBalanceForm}
              className="first px-4 py-2 flex gap-4  bg-[#373A40] text-[#fff] rounded-md shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                className="border   border-yellow-300 rounded-full p-1"
                fill="rgba(240,187,64,1)"
              >
                <path d="M2.00488 8.99979H21.0049C21.5572 8.99979 22.0049 9.4475 22.0049 9.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V8.99979ZM3.00488 2.99979H18.0049V6.99979H2.00488V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM15.0049 13.9998V15.9998H18.0049V13.9998H15.0049Z"></path>
              </svg>
              + ADD Balance
            </button>
            {isBalanceFormVisible && (
              <BalanceForm
                onSaveBalance={saveBalanceHandler}
                onCancel={hideBalanceForm}
                // userId={account || ""}
              />
            )}
            <button
              onClick={showForm}
              className="sec_btn px-4 py-2 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
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
                userId={account || ""}
              />
            )}
            <button
              onClick={showTripForm}
              className="thir_btn px-4 py-2 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                className="border  border-blue-300 rounded-full p-1"
                fill="rgba(70,146,221,1)"
              >
                <path d="M21.949 10.1118C22.1634 10.912 21.6886 11.7345 20.8884 11.9489L5.2218 16.1467C4.77856 16.2655 4.31138 16.0674 4.08866 15.6662L1.46582 10.9415L2.91471 10.5533L5.3825 12.9979L10.4778 11.6246L5.96728 4.55896L7.89913 4.04124L14.8505 10.4609L20.1119 9.05113C20.9121 8.83671 21.7346 9.31159 21.949 10.1118ZM4.00013 19H20.0001V21H4.00013V19Z"></path>
              </svg>
              + Create Trip
            </button>
            {isTripFormVisible && (
              <TripForm
                onSaveTrip={saveTripHandler}
                onCancel={hideTripForm}
                userId={account }
              />
            )}

          
            <button
              onClick={connectWallet}
              className="for_btn px-2 py-1 flex gap-4 bg-[#373A40] text-white rounded-md shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                className="border  border-purple-300 rounded-full p-1"
                fill="rgba(140,108,196,1)"
              >
                <path d="M20 2C21.6569 2 23 3.34315 23 5V7H21V19C21 20.6569 19.6569 22 18 22H4C2.34315 22 1 20.6569 1 19V17H17V19C17 19.5128 17.386 19.9355 17.8834 19.9933L18 20C18.5128 20 18.9355 19.614 18.9933 19.1166L19 19V15H3V5C3 3.34315 4.34315 2 6 2H20Z"></path>
              </svg>{" "}
              {account ? <p>Connected Wallet</p> : <p>Connect Wallet</p>}
            </button>
          </div>
        </div>

        <div className="3rd_row p-4 ml-24 flex  flex-col pb-10 h-[300px] w-[1040px] justify-center self-center bg-[#1B1B1B]">
          <h2 className="text-white   text-center place-content-between text-xl">
            Reports
          </h2>
          <div className="flex w-auto pt-4 justify-center ">
            <WeeklyExpenseChart weeklyExpenses={weeklyExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
