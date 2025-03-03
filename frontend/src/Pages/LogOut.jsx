import React from 'react';
import { NavLink } from 'react-router-dom';


const Logout = () => {
 

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 px-4">
      
      {/* Exit Message Box */}
      <div className="flex flex-col justify-center items-center text-blue-600 bg-white shadow-lg rounded-lg p-6 sm:p-10 space-y-4 sm:space-y-6 border border-gray-300 w-full max-w-md">
        
        {/* Thank You Message */}
        <span className="text-2xl sm:text-4xl font-semibold text-center">
          Thank you for visiting the library!
        </span>
  
        {/* Login Again Button */}
        <NavLink 
          to="/login"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg w-full py-3 text-center"
        >
          Log in again
        </NavLink>
        

      </div>
    </div>
  );
}  

export default Logout;
