const moment = require("moment");
const User = require("../models/userModel");
const { asyncHandler } = require("../middlewares/asyncHandler");

const getDashboardData = asyncHandler(async (req, res) => {
  const { filter, institute, programType, memberType, startDate, endDate } = req.query;

  let start, end;
  const now = moment().endOf("day").toDate();

  switch (filter) {
    case "today":
      start = moment().startOf("day").toDate();
      break;
    case "week":
      start = moment().startOf("isoWeek").toDate();
      break;
    case "month":
      start = moment().startOf("month").toDate();
      break;
    case "year":
      start = moment().startOf("year").toDate();
      break;
    default:
      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      } else {
        start = null;
      }
  }
  end = end || now;

  const dateFilter = start ? { "attendance.entryTime": { $gte: start, $lte: end } } : {};
  

  const matchFilter = {};
  if (institute) matchFilter.institute = institute;
  if (programType) matchFilter.programType = programType;
  if (memberType) matchFilter.memberType = memberType;

  const presentFilter = { "attendance.exitTime": null };

  const [memberTypeData, instituteData, programData, attendanceData, presentUsers] = await Promise.all([
    User.aggregate([
      { $unwind: "$attendance" }, // Unwind attendance to filter users by date
      { $match: { ...dateFilter, ...matchFilter } }, // Apply date filter
      { $group: { _id: "$memberType", count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $unwind: "$attendance" }, // Unwind attendance to filter users by date
      { $match: { ...dateFilter, ...matchFilter } }, // Apply date filter
      { $group: { _id: "$institute", count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $match: matchFilter },
      { $match: { memberType: "Student" } },
      { $unwind: "$attendance" },
      { $match: dateFilter },
      { $group: { _id: "$programType", count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $unwind: "$attendance" },
      { $match: { ...dateFilter, ...matchFilter } },
      { $group: { _id: null, totalEntries: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $unwind: "$attendance" },
      { $match: { ...dateFilter, ...matchFilter, ...presentFilter } },
      {
        $group: {
          _id: "$scholarId",
          name: { $first: "$name" },
          institute: { $first: "$institute" },
          memberType: { $first: "$memberType" },
          programType: { $first: "$programType" },
          entryTime: { $first: "$attendance.entryTime" }
        }
      }
    ])
  ]);  

  // **Only add defaults when no filters are applied**
  const shouldAddDefaults = !institute && !programType && !memberType;

  const defaultInstitutes = shouldAddDefaults
    ? ["MANIT", "IIIT"].map(inst => ({ _id: inst, count: instituteData.find(d => d._id === inst)?.count || 0 }))
    : instituteData;

  const defaultMemberTypes = shouldAddDefaults
    ? ["Student", "Faculty", "Staff"].map(type => ({ _id: type, count: memberTypeData.find(d => d._id === type)?.count || 0 }))
    : memberTypeData;

  const defaultPrograms = shouldAddDefaults
    ? ["UG", "PG", "PhD"].map(prog => ({ _id: prog, count: programData.find(d => d._id === prog)?.count || 0 }))
    : programData;

  res.json({
    filterApplied: filter || "all",
    memberTypeData: defaultMemberTypes,
    instituteData: defaultInstitutes,
    programData: defaultPrograms,
    attendanceData,
    presentUsers: { count: presentUsers.length, users: presentUsers }
  });
});

module.exports = { getDashboardData };
