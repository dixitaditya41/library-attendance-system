const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function mongoDbConnect() {
    

    try {
        await mongoose.connect(process.env.MONGO_URL, { // Us
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = { mongoDbConnect };
