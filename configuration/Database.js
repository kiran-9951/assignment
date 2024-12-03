const mongoose = require("mongoose");

// const MONGO_URI="mongodb://localhost:27017"
const Database = () => {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Assignments",
    })  
    .then(() => {
        console.log("MongoDB connected"); 
    })
    .catch((error) => {
        console.error("MongoDB not connected:", error.message);
    });
};

module.exports = Database;
