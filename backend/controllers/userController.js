const User = require('../models/userModel');
const createToken = require("../utills/createToken");
const { asyncHandler } = require("../middlewares/asyncHandler");
const moment = require('moment');


const registerRoute = asyncHandler(async (req, res) => {
    const { scholarId, password, name, branch, memberType, programType, institute } = req.body;

    if (!scholarId || !name || !password || !branch || !memberType || !institute) {
        return res.status(400).json({ error: "Please fill out all the inputs" });
    }

    if (memberType === "Student" && !programType) {
        return res.status(400).json({ error: "Program type is required for students" });
    }

    const existingUser = await User.findOne({ scholarId });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    try {
        const newUser = new User({ scholarId, password, name, branch, memberType, programType, institute });
        await newUser.save();

        res.status(201).json({
            message: "Registration Successful",
            user: {
                scholarId: newUser.scholarId,
                name: newUser.name,
                branch: newUser.branch,
                member: newUser.memberType,
                college: newUser.institute,
                ...(newUser.memberType === "Student" && { program: newUser.programType })
            }
        });

    } catch (e) {
        console.error("Registration Error:", e);
        res.status(500).json({ message: "Registration Failed", error: e.message });
    }
});

const loginRoute = asyncHandler(async (req, res) => {
    const { scholarId, password } = req.body;

    try {
        const user = await User.findOne({ scholarId });
        if (!user) {
            return res.status(400).json({ message: "Login Failed" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Login Failed" });
        }

        const token = createToken(res, user._id);
        res.status(200).json({
            message: "Login Successful",
            token,
            isAdmin: user.isAdmin,
             // Include the token in the response
        });

    } catch (e) {
        res.status(500).json({ message: "Login Failed" });
    }
})


const attendanceEntryRoute = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const lastAttendance = user.attendance[user.attendance.length - 1];

        // Ensure a new entry is only recorded if the last action was an exit
        if (lastAttendance && !lastAttendance.exitTime) {
            return res.status(400).json({ message: "Cannot enter without exiting previous session" });
        }

        user.attendance.push({ entryTime: Date.now() });
        await user.save();
        res.status(200).json({ message: "Attendance entry successful" });
    } catch (e) {
        res.status(500).json({ message: "Attendance Failed" });
    }
});



const attendanceExitRoute = asyncHandler(async (req, res) => {
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
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found" });

        const attendanceRecords = user.attendance;
        let todaysTime = 0;
        const last5DaysTotalTime = Array(5).fill(0);
        const previous5WeeksTotalTime = Array(5).fill(0);
        const previous3MonthsTotalTime = Array(3).fill(0);

        const today = moment().startOf('day');
        const last5DaysStart = moment().clone().subtract(4, 'days').startOf('day');
        const weekStartDates = Array.from({ length: 5 }, (_, i) => moment().clone().subtract(i, 'weeks').startOf('isoWeek'));
        const monthStartDates = Array.from({ length: 3 }, (_, i) => moment().clone().subtract(i, 'months').startOf('month'));

        let currentWeekTotalTime = 0, currentWeekCount = 0;
        let currentMonthTotalTime = 0, currentMonthCount = 0;

        attendanceRecords.forEach(record => {
            const entryTime = moment(record.entryTime);
            const exitTime = moment(record.exitTime);
            const duration = moment.duration(exitTime.diff(entryTime)).asHours();

            if (entryTime.isSame(today, 'day')) todaysTime += duration;

            const dayIndex = entryTime.diff(last5DaysStart, 'days');
            if (dayIndex >= 0 && dayIndex < 5) last5DaysTotalTime[dayIndex] += duration;

            weekStartDates.forEach((startDate, index) => {
                if (entryTime.isBetween(startDate, moment(startDate).add(6, 'days'), null, '[]')) {
                    previous5WeeksTotalTime[index] += duration;
                }
            });

            monthStartDates.forEach((startDate, index) => {
                if (entryTime.isBetween(startDate, moment(startDate).endOf('month'), null, '[]')) {
                    previous3MonthsTotalTime[index] += duration;
                }
            });

            if (entryTime.isSameOrAfter(moment().startOf('isoWeek'))) {
                currentWeekTotalTime += duration;
                currentWeekCount++;
            }

            if (entryTime.isSameOrAfter(moment().startOf('month'))) {
                currentMonthTotalTime += duration;
                currentMonthCount++;
            }
        });

        res.status(200).json({
            user,
            metrics: {
                todaysTime: Number(todaysTime.toFixed(2)),
                last5DaysTotalTime: last5DaysTotalTime.map(time => Number(time.toFixed(2))),
                previous5WeeksTotalTime: previous5WeeksTotalTime.map(time => Number(time.toFixed(2))),
                previous3MonthsTotalTime: previous3MonthsTotalTime.map(time => Number(time.toFixed(2))),
                currentWeekAvgTime: Number((currentWeekCount > 0 ? currentWeekTotalTime / currentWeekCount : 0).toFixed(2)),
                currentMonthAvgTime: Number((currentMonthCount > 0 ? currentMonthTotalTime / currentMonthCount : 0).toFixed(2))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating profile metrics" });
    }
});


module.exports = { registerRoute, loginRoute, attendanceEntryRoute, attendanceExitRoute, profileRoute };
