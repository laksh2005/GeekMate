const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://laksh10:lakshdoingmongo@firstcluster.es58x.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster"
    )
}

module.exports = connectDB;