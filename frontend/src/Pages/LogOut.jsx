import React from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Optionally, you can add a toast message to confirm logout
    toast.success("You have successfully logged out.");
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center text-blue-600 bg-white shadow-lg rounded-lg p-10 space-y-6 border border-gray-300">
        <span className="text-4xl font-semibold">
          Thank you for visiting the library!
        </span>
        
        <NavLink 
          to="/login"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3"
        >
          Log in again
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 mt-4"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
