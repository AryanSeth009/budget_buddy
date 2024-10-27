"use client";
import React, { useState } from "react";

const BalanceForm: React.FC<{
    onSaveBalance: (balanceData: { balance: number | null, userId: string }) => void;
    onCancel: () => void;
}> = ({ onSaveBalance, onCancel }) => {

    const [balance, setBalance] = useState<number | null>(null);
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
    
        const userId = sessionStorage.getItem('userId');
        const token = sessionStorage.getItem('token');
    
        if (!userId || !token) {
            console.error("User ID or token is not available");
            return;
        }
    
        const balanceData = {
            balance: balance, // Ensure the balance is being sent
        };
    
        fetch('/api/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(balanceData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
            } else {
                console.log("Balance updated successfully:", data.balance);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    

    return (
        <div className="flex absolute bg-[#0F0F10] font-sans items-center h-screen w-screen bg-opacity-95 ml-[22.5rem] justify-center align-middle self-center pb-32">
            <form
                onSubmit={submitHandler}
                className="bg-white mt-20 bg-opacity-5 flex-row mr-32 mb-20 items-center align-middle w-[450px] h-auto text-white rounded-md border-1 p-8"
            >
                <h2 className="text-center text-3xl">Add Transaction Detail</h2>
                <div className="flex flex-col font-light w-auto text-[#E7E7E4] gap-6 pt-10">
                    <div className="text-[#E7E7E4] flex flex-col gap-2">
                        <label>Balance</label>
                        <input
                            type="number"  // Changed to 'number' for easier handling of balance input
                            placeholder="Enter Balance"
                            className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border border-1 bg-opacity-90"
                            value={balance !== null ? balance : ''} // Prevent null balance from showing
                            onChange={(e) => setBalance(parseFloat(e.target.value) || null)}
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
                        Add Balance
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BalanceForm;
