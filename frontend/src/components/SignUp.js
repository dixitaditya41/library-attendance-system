import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";


function SignUp({ setIsLoggedIn }) {

  const navigate = useNavigate(); // Initialize navigate

  const [showHint, setShowHint] = useState(false);
  const [showScholarHint, setshowScholarHint] = useState(false);

  const [formData, setFormData] = useState({

    scholarId: "",
    name: "",
    password: "",
    branch: "",

  });

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }


  async function submitHandler(event) {
    event.preventDefault();
    //console.log("Button is clicked!")

    if (!/^\d+$/.test(formData.scholarId)) {
      alert("Scholar Id should be numeric only");
      return;
    }

    if (formData.scholarId.length !== 10) {
      alert("Scholar Id should be 10 digits");
      return;
    }

    if (!/^\d+$/.test(formData.password)) {
      alert("Password should be numeric only");
      return;
    }

    if (formData.password.length !== 4) {
      alert("Password should be 4 digits");
      return;
    }

    if (formData.name.length === 0) {
      alert("Name cannot be empty");
      return;
    }

    try {
      // Make a POST request to the backend for registration
      const response = await axios.post('https://library-attendance-system.onrender.com/register', formData);
      console.log(response.data);  // Log the backend response for debugging
      setIsLoggedIn(true);
      toast.success("Account Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to register");
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center px-4 py-2">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-blue-600">
        Library Registration
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col justify-center items-center border shadow-lg rounded-xl px-6 py-8 w-full max-w-md"
      >
        {/* Scholar ID Field */}
        <label className="font-medium w-full">
          <div
            className="relative flex flex-row items-center gap-2"
            onMouseEnter={() => setshowScholarHint(true)}
            onMouseLeave={() => setshowScholarHint(false)}
          >
            Enter ScholarId
            <FaInfoCircle className="cursor-pointer" />
            {showScholarHint && (
              <div className="absolute top-8 left-0 w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 10 digit Scholar Id in numeric 0-9
              </div>
            )}
          </div>
        </label>
        <input
          type="text"
          name="scholarId"
          onChange={changeHandler}
          placeholder="Enter Scholar Number"
          className="border px-4 py-2 m-2 w-full rounded-md"
          required
        />

        {/* Name Field */}
        <label className="font-medium w-full">Enter Name</label>
        <input
          type="text"
          name="name"
          onChange={changeHandler}
          placeholder="Enter Full Name"
          className="border px-4 py-2 m-2 w-full rounded-md"
          required
        />

        {/* Branch Field */}
        <label className="font-medium w-full text-lg mb-2">Select Branch</label>
        <select
          name="branch"
          onChange={changeHandler}
          className="border px-4 py-2 m-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          style={{
            maxHeight: '200px',  // Adjust height as needed
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <option value="" disabled selected>
            Select Branch
          </option>
          <option value="MCA">MCA</option>
          <option value="MDS">MDS</option>
          <option value="MBA">MBA</option>
          <option value="Btech">Btech</option>
          <option value="B.Arch">B.Arch</option>
          <option value="Mtech">Mtech</option>
        </select>


        {/* Password Field */}
        <label className="flex justify-start items-center gap-2 font-medium w-full">
          Enter Password
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            <FaInfoCircle className="cursor-pointer" />
            {showHint && (
              <div className="absolute top-8 left-0 w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 4 numeric digits only
              </div>
            )}
          </div>
        </label>
        <input
          type="password"
          name="password"
          onChange={changeHandler}
          required
          placeholder="Enter Password"
          className="border px-4 py-2 m-2 w-full rounded-md"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="border px-6 py-2 mt-4 bg-blue-600 text-white font-semibold text-lg w-full rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {/* Already a member Button */}
      <div className="mt-4 w-full max-w-md">
        <NavLink to={"/login"}>
          <button className="border px-6 py-2 bg-blue-600 text-white font-semibold text-lg w-full rounded-md hover:bg-blue-700 transition">
            Already a member
          </button>
        </NavLink>
      </div>
    </div>
  );
}
export default SignUp;
