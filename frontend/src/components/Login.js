import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { NavLink } from "react-router-dom";


function Login({ setIsLoggedIn }) {

  const [showHint, setShowHint] = useState(false);
  const [showScholarHint, setshowScholarHint] = useState(false);

  const [formData, setformData] = useState({  scholarId: "", password: "" });
  const navigate = useNavigate(); // Initialize navigate

  async function submitHandler(event) {
    event.preventDefault();

    // Validate inputs 

    try {
      const response = await axios.post('https://library-attendance-system.onrender.com/login', formData, {
        withCredentials: true
      });
      console.log(response.data);
      //console.log(response.data);
     // const token = response.data.token;
      //Cookies.set("jwt", token, { expires: 1 / 24 }); // Store token in cookie
      // localStorage.setItem('authToken', token); // Store token in localStorage
      setIsLoggedIn(true);
      toast.success("Logged In");
      navigate("/entry");
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
    <div className='w-screen h-screen flex flex-col justify-center items-center m-4 p-2'>

      <h1 className=" text-3xl font-semibold mb-14 text-blue-600"> Library Login </h1>
      <form onSubmit={submitHandler} className="flex flex-col justify-center items-center border shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
                          rounded-xl">

        <label className='font-medium'>
          <div
            className="relative flex flex-row items-center gap-2"
            onMouseEnter={() => setshowScholarHint(true)}
            onMouseLeave={() => setshowScholarHint(false)}
          >Enter ScholarId
            <FaInfoCircle className="cursor-pointer" />
            {showScholarHint && (
              <div className="absolute bottom-[-40px] left-[-50px] w-48 bg-gray-700 text-white text-xs rounded-md p-2 shadow-lg">
                Enter 10 digit Scholar Id in Numeric 0-9
              </div>
            )}
          </div>
        </label>
        <input type="text"
          name="scholarId"
          placeHolder="Enter Scholar Number"
          required={true}
          onChange={changeHandler}
          className='border px-20 py-3 m-3'
        ></input>

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
        <input type="password"
          required={true}
          name="password"
          placeholder="Enter Password"
          onChange={changeHandler}
          className='border px-20 py-3 m-3'
        ></input>

        <button type="submit"
          className='border px-20 py-3 m-3 bg-blue-600 text-white font-semibold text-lg'
        >Submit</button>
      </form>
      <div>
        <NavLink to={"/"}>
          <button className="border px-20 py-3 m-3 bg-blue-600 text-white font-semibold text-lg">Sign Up</button>
        </NavLink>
      </div>

    </div>
  );

}

export default Login;