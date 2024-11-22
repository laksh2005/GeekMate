const express = require('express');
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const userModel = require('./models/user');
const { ReturnDocument } = require('mongodb');
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

//here we are connecting the /login api in express with login button in frontend
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

//WE WILL USE THE ROUTES AS MIDDLEWARES
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//this is a readymade middleware, which helps us read the JSON data from the end user, and converts it to JS
app.use(express.json());
app.use(cookieParser());


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

