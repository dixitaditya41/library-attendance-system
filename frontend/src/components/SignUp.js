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
    console.log("Button is clicked!")

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
      const response = await axios.post('http://localhost:5000/register', formData);
      console.log(response.data);
      setIsLoggedIn(true);
      toast.success("Account Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to register");
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center m-4 p-2">
      <h1 className="text-3xl font-semibold mb-14 text-blue-600">
        Library Registration
      </h1>
      <form onSubmit={submitHandler} className="flex flex-col justify-center items-center border shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] rounded-xl pt-1">
        <label className='font-medium'>
          <div
            className="relative flex flex-row items-center gap-2"
            onMouseEnter={() => setshowScholarHint(true)}
            onMouseLeave={() => setshowScholarHint(false)}
          >Enter ScholarId
            <FaInfoCircle className="cursor-pointer" />
            {showScholarHint && (
              <div className="absolute bottom-[-40px] left-[-50px] w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
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
          className="border px-20 py-3 m-3"
          required={true}
        />
        <label className="font-medium">Enter Name</label>
        <input
          type="text"
          name="name"
          onChange={changeHandler}
          placeholder="Enter Full Name"
          className="border px-20 py-3 m-3"
          required={true}
        />
        <label className="font-medium">Enter Branch</label>
        <input
          type="text"
          name="branch"
          onChange={changeHandler}
          placeholder="Enter Full Branch Name"
          className="border px-20 py-3 m-3"
          required={true}
        />
        <label className="flex justify-center items-center gap-2 font-medium">
          Enter Password
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            <FaInfoCircle className="cursor-pointer" />
            {showHint && (
              <div className="absolute bottom-[-40px] left-[-50px] w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 4 numeric digits only
              </div>
            )}
          </div>
        </label>
        <input
          type="password"
          name="password"
          onChange={changeHandler}
          required={true}
          placeholder="Enter Password"
          className="border px-20 py-3 m-3"
        />
        <button
          type="submit"
          className="border px-20 py-3 m-3 bg-blue-600 text-white font-semibold text-lg"
        >
          Submit
        </button>
      </form>

      <div>
        <NavLink to={"/login"}>
          <button className="border px-20 py-3 m-3 bg-blue-600 text-white font-semibold text-lg">Already a member</button>
        </NavLink>
      </div>
    </div>
  );
}

export default SignUp;
