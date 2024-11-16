import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

function Exit() {
  const [loading, setLoading] = useState(false);
  const exitTime = new Date().toLocaleTimeString(); // Format the time

  const handleExit = async () => {
    setLoading(true); 
    // Start loading state
    try { // If no token is found, handle error
      
        const token = Cookies.get("jwt");
        const response = await axios.post('https://library-attendance-system.onrender.com/attendance/exit', {},{
        withCredentials: true,
      });
      // if (!token) {
      //   toast.error("Authorization token is missing. Please log in.");
      //   setLoading(false);
      //   return;
      // }
      console.log(response.data);
      toast.success(`Exit Successful at ${exitTime}`);
    }  catch (error) {
      console.error("Exit error:", error);
      toast.error("Exit failed. Please try again.");
    } 
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
          {`Exit Successful at ${exitTime}`}
        </span>

        <button
          onClick={handleExit} // Call handleExit on button click
          disabled={loading} // Disable button while loading
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
        >
          {loading ? "Marking Exit..." : "Mark Attendance Exit"}
        </button>

        <NavLink
          to="/logout"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
        >
          Logout
        </NavLink>
      </div>
    </div>
  );
}

export default Exit;
