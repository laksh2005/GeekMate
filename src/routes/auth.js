const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.use(express.json());

//we store the data in the database using post api request
authRouter.post("/signup",async (req,res)=>{
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

authRouter.post("/login",async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        // finding the email in db
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error ("invalid credentials");
        }
        
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            //HERE WE WILL CREATE A JWT TOKEN
            //ONLY IF THE PASSWORD ID VALID AND THE LOGIN HAPPENS
            const token = await user.getJWT();

            //Adding the token to cookie and then sending a response back to the user
            res.cookie("token", token);
            res.send(user);
        }
        else{
            throw new Error ("invalid credentials");
        }
    } catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})

authRouter.post("/logout",async (req,res)=>{
    try{
        res.cookie("token", null,{
            expires: new Date(Date.now()),
        });

        res.send("you've been logged out!")
    } catch(err){
        res.status(400).send("ERR : " + err.message);
    }
})

module.exports = authRouter;