import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [showHint, setShowHint] = useState(false);
  const [showScholarHint, setshowScholarHint] = useState(false);

  const [formData, setFormData] = useState({
    scholarId: "",
    name: "",
    password: "",
    branch: "",
    memberType: "",
    institute: "",
  });

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (!/^\d{10}$/.test(formData.scholarId)) {
      alert("Scholar ID must be 10 digits");
      return;
    }

    if (!/^\d{4}$/.test(formData.password)) {
      alert("Password must be 4 numeric digits");
      return;
    }

    if (!formData.name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        "https://library-attendance-system.onrender.com/register",
        formData
      );
      console.log(response.data);
      setIsLoggedIn(true);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center px-5 py-3">
      <h1 className="text-2xl font-semibold mb-6 text-blue-600">
        Library Registration
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex flex-col border shadow-lg rounded-lg px-6 py-6 w-full max-w-md"
      >
        <label className="text-base">Member Type</label>
        <select
          name="memberType"
          onChange={changeHandler}
          className="border px-4 py-2 mb-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled selected>
            Select Type
          </option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Staff">Staff</option>
        </select>

        <label className="text-base">Institute</label>
        <select
          name="institute"
          onChange={changeHandler}
          className="border px-4 py-2 mb-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled selected>
            Select Institute
          </option>
          <option value="MANIT">MANIT</option>
          <option value="IIIT">IIIT</option>
        </select>

        <label className="text-base flex items-center gap-2">
          Scholar ID
          <div
            className="relative"
            onMouseEnter={() => setshowScholarHint(true)}
            onMouseLeave={() => setshowScholarHint(false)}
          >
            <FaInfoCircle className="text-gray-500 text-sm cursor-pointer" />
            {showScholarHint && (
              <div className="absolute top-7 left-0 w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 10-digit Scholar ID
              </div>
            )}
          </div>
        </label>
        <input
          type="text"
          name="scholarId"
          onChange={changeHandler}
          placeholder="Scholar ID"
          className="border px-4 py-2 mb-3 rounded-md"
          required
        />

        <label className="text-base">Full Name</label>
        <input
          type="text"
          name="name"
          onChange={changeHandler}
          placeholder="Your Name"
          className="border px-4 py-2 mb-3 rounded-md"
          required
        />

        <label className="text-base">Branch</label>
        <select
          name="branch"
          onChange={changeHandler}
          className="border px-4 py-2 mb-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
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

        <label className="text-base flex items-center gap-2">
          Password
          <div
            className="relative"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            <FaInfoCircle className="text-gray-500 text-sm cursor-pointer" />
            {showHint && (
              <div className="absolute top-7 left-0 w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 4 numeric digits
              </div>
            )}
          </div>
        </label>
        <input
          type="password"
          name="password"
          onChange={changeHandler}
          placeholder="Password"
          className="border px-4 py-2 mb-3 rounded-md"
          required
        />

        <button
          type="submit"
          className="border px-6 py-3 mt-4 bg-blue-600 text-white text-base font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <div className="mt-4 w-full max-w-md">
        <NavLink to={"/login"}>
          <button className="border px-6 py-3 bg-blue-600 text-white text-base font-semibold w-full rounded-md hover:bg-blue-700 transition">
            Already a member? Login
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default SignUp;
