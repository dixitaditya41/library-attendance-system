const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { asyncHandler } = require("./asyncHandler");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  try {
    let token = req.headers['authorization']?.split(' ')[1];
   
    if (!token) return res.status(401).json({ error: "Access Denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        return res.status(401).json({ message: "Not Authorized, user not found" });
    }

    if (!user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

module.exports = { verifyAdmin };
