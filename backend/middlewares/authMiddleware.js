const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./asyncHandler");
const User = require("../models/userModel"); // Ensure this is imported correctly

const authenticate = asyncHandler(async (req, res, next) => {
    let token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Authorization' header
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                // If no user found, send response and return early
                return res.status(401).json({ message: "Not Authorized, user not found" });
            }
            next();
        } catch (error) {
            // Handle token verification errors
            return res.status(401).json({ message: "Not Authorized, token failed" });
        }
    } else {
        // If token doesn't exist, send response and return early
        return res.status(401).json({ message: "Not Authorized, token not exist" });
    }
});

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Not authorized as admin");
    }
};

module.exports = { authenticate, authorizeAdmin };
