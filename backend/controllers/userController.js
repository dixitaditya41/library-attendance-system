const User = require('../models/userModel');
const createToken = require("../utills/createToken");
const {asyncHandler} = require("../middlewares/asyncHandler");
const moment = require('moment');


const registerRoute = asyncHandler(async(req,res) => {
    const { scholarId, password, name ,branch} = req.body;
    if(!scholarId || !name || !password ||!branch){
        throw new Error("Please fill out all the inputs");
    }
    try {
        const newUser = new User({ scholarId, password, name ,branch});
        await newUser.save();
        res.status(201).json({ message: "Registration Successful", user: {
            scholarId: newUser.scholarId,
            name: newUser.name,
            branch: newUser.branch
        }});
    } catch (e) {
        res.status(500).json({ message: "Registration Failed" });
    }
})

const loginRoute= asyncHandler(async (req, res) => {
    const { scholarId, password } = req.body;

    try {
        const user = await User.findOne({ scholarId, password });
        if (user) {
             // console.log(user);
             const token = createToken(res,user._id);      
             res.status(200).json({
                message: "Login Successful",
                token, // Include the token in the response
               });
               
        } else {
            res.status(400).json({ message: "Login Failed" });
        }
    } catch (e) {
        res.status(500).json({ message: "Login Failed" });
    }
})


const attendanceEntryRoute = asyncHandler(async(req, res) => {
    try {
        const user = req.user; // Use the authenticated user
        user.attendance.push({ entryTime: Date.now() });
        await user.save();
        res.status(200).json({ message: "Attendance entry successful" });
    } catch (e) {
        res.status(500).json({ message: "Attendance Failed" });
    }
})


const attendanceExitRoute = asyncHandler(async(req, res) => {
    try {
        const user = req.user; // Use the authenticated user
        const lastAttendance = user.attendance[user.attendance.length - 1];
        if (lastAttendance && !lastAttendance.exitTime) {
            lastAttendance.exitTime = Date.now();
            await user.save();
            res.status(200).json({ message: "Attendance exit successful" });
        } else {
            res.status(400).json({ message: "No entry record found or already exited" });
        }
    } catch (e) {
        res.status(500).json({ message: "Attendance Failed" });
    }
})

const profileRoute = asyncHandler(async (req, res) => {
    try {
        const user = req.user; // Assuming user is authenticated and fetched in middleware
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get user's attendance data
        const attendanceRecords = user.attendance;

        // Variables for calculating time
        let todaysTime = 0; 
        const last5DaysTotalTime = Array(5).fill(0); // Total time for the last 5 days
        const previous5WeeksTotalTime = Array(5).fill(0); // Total time for the last 5 weeks
        const previous3MonthsTotalTime = Array(3).fill(0); // Total time for the last 3 months

        const today = moment().startOf('day');
        const last5DaysStart = moment().subtract(4, 'days').startOf('day'); // Start date for the last 5 days
        const weekStartDates = Array.from({ length: 5 }, (_, i) => moment().subtract(i, 'weeks').startOf('isoWeek')); // Start dates for the last 5 weeks
        const monthStartDates = Array.from({ length: 3 }, (_, i) => moment().subtract(i, 'months').startOf('month')); // Start dates for the last 3 months

        // Variables for average calculation
        let currentWeekTotalTime = 0;
        let currentWeekCount = 0;
        let currentMonthTotalTime = 0;
        let currentMonthCount = 0;

        attendanceRecords.forEach(record => {
            const entryTime = moment(record.entryTime);
            const exitTime = moment(record.exitTime);
            const duration = moment.duration(exitTime.diff(entryTime)).asHours(); // Duration in hours

            // Calculate today's time
            if (entryTime.isSame(today, 'day')) {
                todaysTime += duration;
            }

            // Calculate total time for the last 5 days
            if (entryTime.isSameOrAfter(last5DaysStart)) {
                const dayIndex = moment().diff(entryTime, 'days'); // Get the index for the last 5 days
                if (dayIndex >= 0 && dayIndex < 5) {
                    last5DaysTotalTime[dayIndex] += duration; // Accumulate time for that day
                }
            }

            // Calculate total time for the previous 5 weeks
            weekStartDates.forEach((startDate, index) => {
                const endDate = moment(startDate).add(6, 'days'); // End of the week
                if (entryTime.isBetween(startDate, endDate, null, '[]')) {
                    previous5WeeksTotalTime[index] += duration; // Accumulate time for that week
                }
            });

            // Calculate total time for the previous 3 months
            monthStartDates.forEach((startDate, index) => {
                const endDate = moment(startDate).endOf('month'); // End of the month
                if (entryTime.isBetween(startDate, endDate, null, '[]')) {
                    previous3MonthsTotalTime[index] += duration; // Accumulate time for that month
                }
            });

            // Calculate current week total time and count
            const currentWeekStart = moment().startOf('isoWeek'); // Start of the current week
            if (entryTime.isSameOrAfter(currentWeekStart)) {
                currentWeekTotalTime += duration;
                currentWeekCount++;
            }

            // Calculate current month total time and count
            const currentMonthStart = moment().startOf('month'); // Start of the current month
            if (entryTime.isSameOrAfter(currentMonthStart)) {
                currentMonthTotalTime += duration;
                currentMonthCount++;
            }
        });

        // Calculate averages
        const currentWeekAvgTime = currentWeekCount > 0 ? (currentWeekTotalTime / currentWeekCount) : 0;
        const currentMonthAvgTime = currentMonthCount > 0 ? (currentMonthTotalTime / currentMonthCount) : 0;

        // Return metrics
        res.status(200).json({
            user,
            metrics: {
                todaysTime: todaysTime.toFixed(2),
                last5DaysTotalTime: last5DaysTotalTime.map(time => time.toFixed(2)), // Total time for each day in the last 5 days
                previous5WeeksTotalTime: previous5WeeksTotalTime.map(time => time.toFixed(2)), // Total time for each week in the last 5 weeks
                previous3MonthsTotalTime: previous3MonthsTotalTime.map(time => time.toFixed(2)), // Total time for each month in the last 3 months
                currentWeekAvgTime: currentWeekAvgTime.toFixed(2), // Average time for the current week
                currentMonthAvgTime: currentMonthAvgTime.toFixed(2), // Average time for the current month
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating profile metrics" });
    }
});

module.exports = { registerRoute, loginRoute ,attendanceEntryRoute, attendanceExitRoute,profileRoute};
