import Home from "./Pages/Home";
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
import Profile from "./Pages/Profile";
import Login from './components/Login';
import Logout from "./Pages/LogOut";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Entry from './Pages/Entry';
import Exit from './Pages/Exit';

function App() {


  const [isLoggedIn , setIsLoggedIn] = useState(false);
   
  return (
    <div className="w-screen h-screen">

      <Routes>

        <Route path="/" element={<Home isLoggedin ={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path ="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/entry" element={<Entry setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/exit" element={<Exit setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />

         {/* Protect admin dashboard */}
         <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
         </Route>
      </Routes>
    </div>
  );
}

export default App;
