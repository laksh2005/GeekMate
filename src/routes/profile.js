const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const cookieParser = require("cookie-parser");
const { validateProfileEditData } = require("../utils/validation");
const { validateSignUpData } = require("../utils/validation");
const { validatePass } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.use(cookieParser());
profileRouter.use(express.json());

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

profileRouter.put("/profile/edit", userAuth, async (req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request");
        }
        const LoggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(LoggedInUser[key] = req.body[key]));

        await LoggedInUser.save();
        res.json({
            message:`${LoggedInUser.firstName}, your profile has been edited!`,
            data: LoggedInUser,
        });
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

profileRouter.patch("/profile/password",userAuth, async (req,res)=>{
    try{

        const {oldPass, newPass} = req.body;
        if(!oldPass || !newPass){
            throw new Error("You need to tell me both the passwords");
        }
        const loggedInUser = req.user;

        const isPasswordValid = await bcrypt.compare(oldPass, loggedInUser.password);
        if (!isPasswordValid) {
            throw new Error("Old password is incorrect");
        }
        validatePass({ body: { password: newPass } }); 
        const newPasswordHash = await bcrypt.hash(newPass, 10);

        loggedInUser.password = newPasswordHash;
        await loggedInUser.save();

        res.send("Password has been changed successfully");
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = profileRouter;
