import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import apiService from "../apiService";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    filter: "",
    institute: "",
    programType: "",
    memberType: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate(); 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState("program"); // For switching chart data

  // Time filter options
  const timeFilters = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/admin/get-dashboard-stats", { params: filters });
      //console.log("Dashboard Data", response.data);
      setData(response.data);
      
      // Set chart data based on active tab
      if (activeTab === "program") {
        setChartData(response.data.programData || []);
      } else if (activeTab === "memberType") {
        setChartData(response.data.memberTypeData || []);
      } else if (activeTab === "institute") {
        setChartData(response.data.instituteData || []);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update chart data when tab changes
  useEffect(() => {
    if (data) {
      if (activeTab === "program") {
        setChartData(data.programData || []);
      } else if (activeTab === "memberType") {
        setChartData(data.memberTypeData || []);
      } else if (activeTab === "institute") {
        setChartData(data.instituteData || []);
      }
    }
  }, [activeTab, data]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const resetFilters = () => {
    setFilters({
      filter: "",
      institute: "",
      programType: "",
      memberType: "",
      startDate: "",
      endDate: "",
    });
    setTimeout(() => {
      fetchData();
    }, 0);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate total attendance from filtered results
  const getTotalAttendance = () => {
    return data?.attendanceData?.[0]?.totalEntries || 0;
  };

  const handleLogout =  (e) => {

    // Clear the token from localStorage
    localStorage.removeItem('authToken');

    // Optionally, you can add a toast message to confirm logout
    toast.success("You have successfully logged out.");

    navigate("/logout");
  };


  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 min-h-screen p-6 text-white">
      <div className="bg-white shadow-xl rounded-xl p-6 text-gray-900 relative">
        {/* Logout button positioned in top right corner */}
        <div className="absolute top-6 right-6">
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
        <p className="text-center text-gray-600">Attendance and User Analytics</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 my-6 text-gray-900">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        
        {/* Time Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={filters.filter}
              onChange={(e) => handleFilterChange("filter", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              {timeFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Institute Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
            <select
              value={filters.institute}
              onChange={(e) => handleFilterChange("institute", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Institutes</option>
              {data?.instituteData?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
          </div>
          
          {/* Program Type Filter - Fixed with correct property name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
            <select
              value={filters.programType}
              onChange={(e) => handleFilterChange("programType", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Programs</option>
              {data?.programData?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
          </div>
          
          {/* Member Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Type</label>
            <select
              value={filters.memberType}
              onChange={(e) => handleFilterChange("memberType", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Member Types</option>
              {data?.memberTypeData?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full bg-gray-50 p-2 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* Apply & Reset Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={applyFilters} 
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          >
            Apply Filters
          </button>
          <button 
            onClick={resetFilters} 
            className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Dashboard Content */}
      {data && !loading && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-600 p-4">
                <h2 className="text-lg font-semibold text-white">Total Entries</h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-900">{getTotalAttendance()}</p>
                <p className="text-gray-500 mt-2">Total attendance records</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-600 p-4">
                <h2 className="text-lg font-semibold text-white">Present Users</h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-900">{data.presentUsers?.count || 0}</p>
                <p className="text-gray-500 mt-2">Currently present</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-600 p-4">
                <h2 className="text-lg font-semibold text-white">Filtered Results</h2>
              </div>
              <div className="p-6 flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-900">{chartData.reduce((acc, curr) => acc + curr.count, 0)}</p>
                <p className="text-gray-500 mt-2">Based on current filters</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 text-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">User Statistics</h3>
              
              {/* Chart Type Tabs */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab("program")} 
                  className={`px-4 py-2 rounded-lg ${activeTab === "program" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Program
                </button>
                <button 
                  onClick={() => setActiveTab("memberType")} 
                  className={`px-4 py-2 rounded-lg ${activeTab === "memberType" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Member Type
                </button>
                <button 
                  onClick={() => setActiveTab("institute")} 
                  className={`px-4 py-2 rounded-lg ${activeTab === "institute" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Institute
                </button>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <XAxis dataKey="_id" stroke="#555" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name={`${activeTab === "program" ? "Program" : activeTab === "memberType" ? "Member Type" : "Institute"} Count`}
                    fill={activeTab === "program" ? "#6366F1" : activeTab === "memberType" ? "#8B5CF6" : "#4F46E5"} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available with the current filters</p>
              </div>
            )}
          </div>

          {/* Present Users Table */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-gray-900">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Present Users</h3>
              <div className="text-sm text-gray-500">
                {data.presentUsers?.count || 0} users currently present
              </div>
            </div>
            
            {data.presentUsers?.users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left border-b font-semibold">ID</th>
                      <th className="p-3 text-left border-b font-semibold">Name</th>
                      <th className="p-3 text-left border-b font-semibold">Institute</th>
                      <th className="p-3 text-left border-b font-semibold">Member Type</th>
                      <th className="p-3 text-left border-b font-semibold">Program Type</th>
                      <th className="p-3 text-left border-b font-semibold">Entry Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.presentUsers.users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3">{user._id}</td>
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3">{user.institute}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.memberType === "Student" ? "bg-blue-100 text-blue-800" :
                            user.memberType === "Faculty" ? "bg-green-100 text-green-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {user.memberType}
                          </span>
                        </td>
                        <td className="p-3">{user.programType}</td>
                        <td className="p-3">{new Date(user.entryTime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No users currently present</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;