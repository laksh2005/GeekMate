const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const userModel = require('./models/user');

//this is a readymade middleware, which helps us read the JSON data from the end user, and converts it to JS
app.use(express.json());

//this GET api will help us find documents from the dm, having the emailId which is entered from user end (postman)
app.get("/user",async (req,res)=>{
    
    const userEmail= req.body.emailId;

    try{
        const users = await User.find({emailId: userEmail})
        //or we can do const user = await User.findOne({emailId: userEmail})

        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//this GET api will help us find documents from the dm, having the Id which is entered from user end (postman)
app.get("/id",async (req,res)=>{
    
    const userId= req.body._id;

    try{
        const users = await User.findById({_id: userId})
        //or we can do const user = await User.findOne({emailId: userEmail})

        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//this GET api will help us find all the documents from the db
app.get("/feed",async (req,res)=>{
    const userEmail= new User(req.body.email);

    try{
        const users = await User.find({});
        res.send(users);
    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//this DELETE api will help us DELETE the documents from the db by userId
app.delete("/user",async (req,res)=>{
    const userId= req.body._id;

    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted");
    } catch (err){
        res.status(400).send("Something went wrong");
    }
})

//this PATCH API will help us update the documents fromt the db by userId
app.patch("/user/byId", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        await User.findByIdAndUpdate({ _id: userId }, data);
        res.send("User data is updated");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});


//this PATCH API will help us update the documents fromt the db by emailId
app.patch("/user/byEmail", async (req, res) => {
    const userEmail = req.body.userEmail;
    const data = req.body;

    try {
        await User.findOneAndUpdate({ emailId: userEmail }, data);
        res.send("User data is updated");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

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

