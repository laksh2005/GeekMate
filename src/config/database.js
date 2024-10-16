const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://laksh10:lakshdoingmongo@firstcluster.es58x.mongodb.net/GeekMate"
    )
}

module.exports = connectDB;