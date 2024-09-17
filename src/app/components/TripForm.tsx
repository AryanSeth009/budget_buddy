"use client";
import React, { useState } from "react";

const TripForm: React.FC<{
  onSaveTrip: (TripData: any) => void;
  onCancel: () => void;
}> = ({ onSaveTrip, onCancel }) => {
  const [TripName, setTripName] = useState<string>("");
  const [Amount, setAmount] = useState<number | string>(0);
  const [Destination, setDestination] = useState<string>("");
  const [StartDate, setStartDate] = useState<string>("");
  const [EndDate, setEndDate] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [Note, setNote] = useState<string>("");

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const TripData = {
      TripName,
      Amount: Number(Amount), // Ensure amount is a number
      Destination,
      StartDate: new Date(StartDate), // Ensure date is a Date object
      EndDate: new Date(EndDate),
      method,
      currency,
      Note,
    };

    onSaveTrip(TripData);
  };

  return (
    <div className="flex absolute bg-[#0F0F10] font-sans  items-center h-fit w-screen  bg-opacity-95 ml-[22.5rem]    justify-center align-middle self-center pb-44">
      <form
        onSubmit={submitHandler}
        className="bg-white mt-20 bg-opacity-5 flex flex-col w-auto  p-8 text-white rounded-md"
      >
        <h2 className="text-center text-3xl">Add Trip Expense</h2>
        <div className="container font-light flex flex-row gap-">
          <div className="1st_col flex gap-10">
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex flex-col gap-2">
                <label>Trip Name</label>
                <input
                  type="text"
                  placeholder="Enter Trip Name"
                  className="rounded-lg p-1 font-medium bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={TripName}
                  onChange={(e) => setTripName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Destination</label>
                <input
                  type="text"
                  placeholder="Enter Destination"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={Destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={Amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Method</label>
                <input
                  type="text"
                  placeholder="Enter Payment Method"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  required
                />
              </div>
              <div className="flex pt-5 justify-start gap-2">
                <button
                  type="button"
                  className="bg-[#E7E7E4] text-black rounded-md p-46"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="2nd_col flex flex-col  gap-4 ">
              <div className="flex flex-col pt-5 gap-2">
                <label>Start Date</label>
                <input
                  type="date"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={StartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>End Date</label>
                <input
                  type="date"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={EndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Currency</label>
                <input
                  type="text"
                  placeholder="Enter Currency"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Note</label>
                <textarea
                  placeholder="Additional Notes"
                  className="rounded-lg p-1 bg-[#0F0F10] pl-4 text-[#E7E7E4] border"
                  value={Note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end   gap-2">
                <button
                  type="submit"
                  className="bg-[#E7E7E4] text-black rounded-md p-46"
                >
                  Add Trip
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 flex-wrap justify-between pt-6"></div>
        </div>
      </form>
    </div>
  );
};

export default TripForm;