import React, { useState ,useEffect} from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";
function Exit() {
  const [loading, setLoading] = useState(false);
  const [hasMarkedExit, setHasMarkedExit] = useState(false);
  const exitTime = new Date().toLocaleTimeString();
  const navigate = useNavigate();
  
  // Load the exit status from localStorage when component mounts
  useEffect(() => {
    const exitStatus = localStorage.getItem('hasMarkedExit');
    if (exitStatus === 'true') {
      setHasMarkedExit(true);
    }
    
    // Check if entry was marked
    const entryStatus = localStorage.getItem('hasMarkedEntry');
    if (entryStatus !== 'true') {
      // If entry wasn't marked, redirect to entry page
      toast.error("You must mark entry before accessing the exit page");
      navigate("/entry");
    }
  }, [navigate]);

  const handleExit = async () => {
    setLoading(true);
    try {
      const response = await apiService.post('/attendance/exit');
      setHasMarkedExit(true);
      // Save the exit status to localStorage
      localStorage.setItem('hasMarkedExit', 'true');
      console.log(response.data);
      toast.success(`Exit Successful at ${exitTime}`);
    } catch (error) {
      console.error("Exit error:", error);
      toast.error("Exit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    if (!hasMarkedExit) {
      e.preventDefault();
      toast.error("Mark exit first before logging out!");
      return;
    }
    
    // Clear the token and attendance states from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('hasMarkedEntry');
    localStorage.removeItem('hasMarkedExit');
    
    toast.success("You have successfully logged out.");
    navigate("/logout");
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

      {/* Exit Confirmation Box */}
      <div className="flex flex-col justify-center items-center text-blue-600 bg-white shadow-lg rounded-lg p-6 sm:p-10 space-y-4 sm:space-y-6 border border-gray-300 w-full max-w-md">


        {/* Mark Attendance Exit Button */}
        <button
          onClick={handleExit}
          disabled={loading || hasMarkedExit}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3 disabled:opacity-50"
        >
          {loading ? "Marking Exit..." : hasMarkedExit ? "Exit Marked" : "Mark Attendance Exit"}

        </button>

        {/* Logout Button */}
         
          <button
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4
            focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3 text-center"
            onClick={handleLogout} 
          >
            Log Out
          </button>
          
        </div>
    </div>
  );
}

export default Exit;