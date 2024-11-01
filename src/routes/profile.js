const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const cookieParser = require("cookie-parser");

profileRouter.use(cookieParser());
profileRouter.use(express.json());

profileRouter.get("/profile", userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = profileRouter;
