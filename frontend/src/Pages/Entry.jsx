import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function Entry() {
  const [loading, setLoading] = useState(false);
  const entryTime = new Date().toLocaleTimeString(); // Format the time

  const handleEntry = async () => {
    setLoading(true); // Start loading state
    try {
      const token = Cookies.get("jwt");
      console.log(token);
      const response = await axios.post('https://library-attendance-system.onrender.com/attendance/entry', {},{
        withCredentials: true,
      });
      console.log(response.data);
      toast.success(`Entry Successful at ${entryTime}`);
    } catch (error) {
      console.error("Entry error:", error);
      toast.error("Entry failed. Please try again.");
    }
    // } finally {
    //   setLoading(false); // End loading state
    // }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100">

      <div className="py-2 my-4">
        <NavLink to={"/profile"}>
            <button 
             className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
            > See Your Progress  </button>
          </NavLink> 
      </div>

      <div className="flex flex-col justify-center items-center text-blue-600 bg-white shadow-lg rounded-lg p-10 space-y-6 border border-gray-300">
        <span className="text-4xl font-semibold">
          {`Entry Successful at ${entryTime}`}
        </span>

        <button
          onClick={handleEntry} // Call handleEntry on button click
          disabled={loading} // Disable button while loading
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
        >
          {loading ? "Marking Entry..." : "Mark Attendance Entry"}
        </button>

        <NavLink
          to="/exit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
        >
          Exit
        </NavLink>
      </div>
    </div>
  );
}

export default Entry;
