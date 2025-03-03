const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { urlencoded } = require('express');
const dotenv = require('dotenv');
const { mongoDbConnect } = require("./config/db");
const adminRoute = require("./routes/adminRoutes");
const userRoute = require("./routes/userRoute");
const cors = require("cors")

dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoDbConnect();

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    //origin: 'https://library-attendance-system.vercel.app' || 'http://localhost:3000',  // Set the exact origin (frontend)
    origin:  'http://localhost:3000',
    credentials: true                 // Allow credentials (cookies, authorization headers)
  }));
  

// Use the user route
app.use("/", userRoute);
//Use the admin route
app.use("/admin", adminRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
