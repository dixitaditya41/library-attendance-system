import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Cookies from "js-cookie";
import apiService from "../apiService";

Chart.register(...registerables);

const Profile = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const response = await apiService.get('/profile')
                setMetrics(response.data.metrics);
            } catch (error) {
                console.error("Error fetching profile metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const handleGoBack = () => {
        window.history.back();
    };

    if (loading) {
        return <div className="text-center text-blue-500">Loading...</div>;
    }

    if (!metrics) {
        return <div className="text-center text-red-500">No metrics found.</div>;
    }

    // Prepare data for the charts
    const last5DaysData = {
        labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
            label: 'Total Time (hours)',
            data: metrics.last5DaysTotalTime,
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
        }],
    };

    const previous5WeeksData = {
        labels: ['This Week', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Total Time (hours)',
            data: metrics.previous5WeeksTotalTime,
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
        }],
    };

    const previous3MonthsData = {
        labels: ['This Month', 'Month 1', 'Month 2'],
        datasets: [{
            label: 'Total Time (hours)',
            data: metrics.previous3MonthsTotalTime,
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    max: Math.max(...metrics.last5DaysTotalTime, ...metrics.previous5WeeksTotalTime, ...metrics.previous3MonthsTotalTime) + 1,
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-6xl w-full mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={handleGoBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back
            </button>
          </div>
          
          {/* Header Section with Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            {/* Left side - Title */}
            <div className="flex items-center justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                User Profile Metrics
              </h1>
            </div>
            
            {/* Right side - Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
                <h2 className="text-sm text-blue-600 mb-1">Today's Time</h2>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {metrics.todaysTime}h
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
                <h2 className="text-sm text-blue-600 mb-1">Week Avg</h2>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {metrics.currentWeekAvgTime}h
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
                <h2 className="text-sm text-blue-600 mb-1">Month Avg</h2>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {metrics.currentMonthAvgTime}h
                </p>
              </div>
            </div>
          </div>
      
          {/* Charts Section */}
          <div className="grid gap-6">
            
            {/* Last 5 Days Chart */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                Last 5 Days
              </h3>
              <div className="h-64 w-full">
                <Bar data={last5DaysData} options={chartOptions} />
              </div>
            </div>
      
            {/* Last 5 Weeks Chart */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                Last 5 Weeks
              </h3>
              <div className="h-64 w-full">
                <Bar data={previous5WeeksData} options={chartOptions} />
              </div>
            </div>
      
            {/* Last 3 Months Chart */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                Last 3 Months
              </h3>
              <div className="h-64 w-full">
                <Bar data={previous3MonthsData} options={chartOptions} />
              </div>
            </div>
            
          </div>
        </div>
      );
    };
export default Profile;