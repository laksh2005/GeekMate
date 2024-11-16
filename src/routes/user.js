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
        }).populate("fromUserID", ["firstName", "lastName", "age", "gender", "skills"]);
        

        res.json({
            message: "Here are all the pending requests!",
            data: connectionRequests,
        });

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

//API to get all the connections of the loggedInUser
 userRouter.get("/user/requests/connections", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserID: loggedInUser._id, status: "accepted"},
                {fromUserID: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserID", ["firstName", "lastName", "age", "gender", "skills"] )
          .populate("toUserID", ["firstName", "lastName", "age", "gender", "skills"])

          //here we populated both to and from user, since one of them would be the logged in user obviously, when we check the connections which are accepted

          //now here, if the fromuser is the loggedinuser, then we will map the row (user details) of touserid (since it would be from's connection) & VICE VERSA
          const data = connectionRequests.map((row)=>{
            if(row.fromUserID._id.toString() === loggedInUser._id.toString()){
                return row.toUserID;
            }
            return row.fromUserID;
          })

          res.json({data})

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

 module.exports = userRouter;