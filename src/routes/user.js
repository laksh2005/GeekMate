const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const  ConnectionRequest = require("../models/connectionRequest")
const mongoose = require("mongoose")

//API to get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        //we are going to find an array of all the connecton requests with a status of "interested"
        const connectionRequests = await ConnectionRequest.find({
            toUserID: new mongoose.Types.ObjectId(loggedInUser._id),
            status: "interested"
        }).populate("fromUserID", ["firstName", "lastName"]);
        

        res.json({
            message: "Here are all the pending requests!",
            data: connectionRequests,
        });

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;