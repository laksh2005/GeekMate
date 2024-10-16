const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const userModel = require('./models/user');

//this is a readymade middleware, which helps us read the JSON data from the end user, and converts it to JS
app.use(express.json());

//now the data is being taken fromt eh end user (postman)
app.post("/signup",async (req,res)=>{
    const user= new User(req.body);
    
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

