const express = require("express");
const router = express.Router();
const { getDashboardData} = require("../controllers/adminController");
const { verifyAdmin } = require('../middlewares/verifyAdmin');

router.get("/get-dashboard-stats", verifyAdmin, getDashboardData);


module.exports = router;
