const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const userModel = require('./models/user');
const { ReturnDocument } = require('mongodb');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//this is a readymade middleware, which helps us read the JSON data from the end user, and converts it to JS
app.use(express.json());
app.use(cookieParser());

//we store the data in the database using post api request
app.post("/signup",async (req,res)=>{
    try{
        // Validation of data 
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypting the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // Creating a new instance of the User model
        const user= new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully")
    } catch (err){
        res.status(400).send("error saving the user: " + err.message);
    }
});

app.post("/login",async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        // finding the email in db
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error ("invalid credentials");
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //HERE WE WILL CREATE A JWT TOKEN
            //ONLY IF THE PASSWORD ID VALID AND THE LOGIN HAPPENS
            const token = await jwt.sign({_id: user._id}, "Thisis+key+forthistoken123");

            //Adding the token to cookie and then sending a response back to the user
            res.cookie("token", token);
            res.send("Login successful");
        }
        else{
            throw new Error ("invalid credentials");
        }
    } catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})

app.get("/profile", async (req,res)=>{
    try{
        const cookies = req.cookies;
        const { token } = cookies;

        if(!token){
            throw new Error("Invalid Token");
        }
    
        const decodedMessage = await jwt.verify(token, "Thisis+key+forthistoken123");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("USER DOES NOT EXIST");
        }

        res.send(user);
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

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
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["password", "gender", "age", "skills", "about"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data.skills && data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true,
        });

        res.send("User data is updated");

    } catch (err) {
        res.status(400).send(err.message);
    }
});

//this PATCH API will help us update the documents fromt the db by emailId
// app.patch("/user/byEmail", async (req, res) => {
//     const userEmail = req.body.userEmail;
//     const data = req.body;

//     try {
//         await User.findOneAndUpdate({ emailId: userEmail }, data);
//         res.send("User data is updated");
//         runValidators: true;
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }
// });

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

