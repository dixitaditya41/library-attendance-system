import React, { useState ,useEffect} from "react";
import { NavLink } from "react-router-dom";
import apiService from "../apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";;

function Entry() {
  // Check localStorage on component mount to see if entry was already marked
  const [loading, setLoading] = useState(false);
  const [hasMarkedEntry, setHasMarkedEntry] = useState(false);
  const entryTime = new Date().toLocaleTimeString();
  const navigate = useNavigate();
  
  // Load the entry status from localStorage when component mounts
  useEffect(() => {
    const entryStatus = localStorage.getItem('hasMarkedEntry');
    if (entryStatus === 'true') {
      setHasMarkedEntry(true);
    }
  }, []);

  const handleEntry = async () => {
    setLoading(true);
    try {
      const response = await apiService.post('/attendance/entry');
      setHasMarkedEntry(true);
      // Save the entry status to localStorage
      localStorage.setItem('hasMarkedEntry', 'true');
      console.log(response);
      toast.success(`Entry Successful at ${entryTime}`);
    } catch (error) {
      console.error("Entry error:", error);
      toast.error("Entry failed. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleExitOnEntry = (e) => {
    if (!hasMarkedEntry) {
      e.preventDefault();
      toast.error("Mark entry first before Exit");
      return;
    } else {
      navigate("/exit");
      toast.success("You have successfully marked your entry");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 px-4">
      
      {/* Progress Button */}
      <div className="py-2 my-4 w-full max-w-md">
        <NavLink to={"/profile"}>
          <button 
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3"
          >
            See Your Progress
          </button>
        </NavLink> 
      </div>
  
      {/* Entry Confirmation Box */}
      <div className="flex flex-col justify-center items-center text-blue-600 bg-white shadow-lg rounded-lg p-6 sm:p-10 space-y-4 sm:space-y-6 border border-gray-300 w-full max-w-md">
  
  
        {/* Mark Attendance Entry Button */}
        <button
          onClick={handleEntry} 
          disabled={loading || hasMarkedEntry}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3 disabled:opacity-50"
        >
          {loading ? "Marking Entry..." : hasMarkedEntry ? "EntryMarked" : "Mark Attendance Entry"}
        </button>
  
        {/* Exit Button */}
          <button
           onClick={handleExitOnEntry}
           className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4
            focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3 text-center">
            Exit
          </button>
    
      </div>
    </div>
  );  
}

export default Entry;
