const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function mongoDbConnect() {
    

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 350,  // Adjust this based on your traffic
            minPoolSize: 200,  // Keeps minimum 20 connections alive
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = { mongoDbConnect };
