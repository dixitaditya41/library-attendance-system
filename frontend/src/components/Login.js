import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import apiService from "../apiService";
import { NavLink } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [showHint, setShowHint] = useState(false);
  const [showScholarHint, setshowScholarHint] = useState(false);
  const [formData, setformData] = useState({ scholarId: "", password: "" });
  const navigate = useNavigate();

  async function submitHandler(event) {
    event.preventDefault();

    try {
      const response = await apiService.post("/login", formData);
  

      const { token, isAdmin } = response.data; // Extract token and isAdmin

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("isAdmin", isAdmin); // Store isAdmin status

        setIsLoggedIn(true);
        toast.success("Logged In");

        if (isAdmin) {
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        } else {
          navigate("/entry"); // Redirect to normal user page
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  function changeHandler(event) {
    setformData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center px-4 py-2">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-8 text-blue-600">
        Library Login
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
                Enter 10 digit Scholar Id in Numeric 0-9
              </div>
            )}
          </div>
        </label>
        <input
          type="text"
          name="scholarId"
          placeholder="Enter Scholar Number"
          required
          onChange={changeHandler}
          className="border px-4 py-2 m-2 w-full rounded-md"
        />

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
          required
          name="password"
          placeholder="Enter Password"
          onChange={changeHandler}
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

      {/* Sign Up Button */}
      <div className="mt-4 w-full max-w-md">
        <NavLink to={"/"}>
          <button className="border px-6 py-2 bg-blue-600 text-white font-semibold text-lg w-full rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
