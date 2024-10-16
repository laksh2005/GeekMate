const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const userModel = require('./models/user');

//we store the data in the database using post api request
app.post("/signup",async (req,res)=>{
    const user= new User({
        firstName:"virat",
        lastName: "kohli",
        emailId: "virat18@gmail.com",
        password: "virat@81",
    });
    try{
        await user.save();
        res.send("User Added successfully")
    } catch (err){
        res.status(400).send("error saving the user: " + err.message);
    }

})

connectDB()
    .then(()=>{
        console.log("Database connection established.");
        app.listen(1000,()=>{
            console.log("Server is accessible at localhost:1000")
        })
    })
    .catch((err)=>{
        console.log("Database could not be connected.");
    });

