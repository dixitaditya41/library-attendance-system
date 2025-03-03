const express = require('express'); 
const { registerRoute, loginRoute ,attendanceEntryRoute,attendanceExitRoute,profileRoute} = require('../controllers/userController.js');
const {authenticate} = require('../middlewares/authMiddleware');
const router = express.Router();   



router.post('/register', registerRoute);
router.post('/login', loginRoute);


//attendance-log
router.post("/attendance/entry",authenticate,attendanceEntryRoute);
router.post("/attendance/exit",authenticate,attendanceExitRoute);
router.get("/profile",authenticate,profileRoute)



module.exports = router;
