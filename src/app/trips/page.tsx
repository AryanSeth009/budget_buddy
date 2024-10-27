"use client";
import React, { useEffect, useState } from "react";

type Trip = {
  _id: string;
  TripName: string;
  Destination: string;
  Amount: number;
  StartDate: Date;
  EndDate: Date;
  Note: string;
};

function Page() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrip = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      console.log("Retrieved userId:", userId);
      console.log("Retrieved token:", token);

      if (!userId || !token) {
        console.error("User ID or token is missing");
        return;
      }

      try {
        const response = await fetch("/api/trip", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setTrips(data);
        } else {
          console.error("Fetched data is not an array");
        }
      } catch (error) {
        console.error("Error fetching trips:", (error as Error).message);
      }
    };

    fetchTrip();
  }, []);

  const deleteTrip = async (tripId: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await fetch(`/api/trips?id=${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the trip");
      }

      // Remove the deleted trip from the state
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
      console.log(`Trip with id ${tripId} deleted`);
    } catch (error) {
      console.error("Error deleting trip:", (error as Error).message);
    }
  };

  return (
    <div className="bg-black ml-24 pl-40 p-8 h-screen flex items-start justify-center">
      <div className="container rounded-lg bg-[#1B1B1B] flex flex-col justify-start h-screen p-10 w-full max-w-[1400px]">
        <div className="w-full flex justify-center">
          <ul className="flex flex-col space-y-3 pt-3 w-auto">
            {/* Header */}
            <li className="flex justify-evenly gap-16 text-4xl pb-4 text-[#FFF1DB] w-full">
              <span className="w-[25%] uppercase font-semibold text-2xl">Trip Name</span>
              <span className="w-[25%] uppercase font-semibold text-2xl">Destination</span>
              <span className="w-[25%] uppercase font-semibold text-2xl">Start Date</span>
              <span className="w-[25%] uppercase font-semibold text-2xl">End Date</span>
              <span className="w-[25%] uppercase font-semibold text-2xl">Amount</span>
              <span className="w-[25%] uppercase font-semibold text-2xl">Note</span>
            </li>

            {/* Mapping through Trips */}
            {trips.slice(0, 10).map((trip) => (
              <li
                key={trip._id}
                className="flex justify-between font-normal gap-48 text-white text-sm w-full"
              >
                <span className="w-[25%] text-[20px] truncate">{trip.TripName}</span>
                <span className="w-[25%] text-[20px] truncate">{trip.Destination}</span>
                <span className="w-[25%] text-[20px] truncate">{new Date(trip.StartDate).toLocaleDateString()}</span>
                <span className="w-[25%] text-[20px] truncate">{new Date(trip.EndDate).toLocaleDateString()}</span>
                <span className="w-[25%] gap-3 text-[20px] truncate flex items-center justify-between">
                {trip.Amount ? `$${trip.Amount.toFixed(2)}` : '$0.00'}

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteTrip(trip._id);
                    }}
                    className="ml-2 flex items-center"
                  >
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
                <span className="w-[25%] text-[20px] truncate">{trip.Note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Page;
