const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const  ConnectionRequest = require("../models/connectionRequest")
const mongoose = require("mongoose")
const User = require("../models/user")
const USER_SAFE_DATA = "firstName lastName age gender skills photoURL about";

//API to get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        //we are going to find an array of all the connecton requests with a status of "interested"
        const connectionRequests = await ConnectionRequest.find({
            toUserID: new mongoose.Types.ObjectId(loggedInUser._id),
            status: "interested"
        }).populate("fromUserID", USER_SAFE_DATA);
        

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
        }).populate("fromUserID", USER_SAFE_DATA )
          .populate("toUserID", USER_SAFE_DATA)

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

//IMPORTANT API
// a Feed API to see the new user cards, which the user hasn't seen before
userRouter.get("/feed", userAuth, async (req,res)=>{
    try{

        //User must see all the user cards, except the ones which:
        //1. is his own card
        //2. his connections' cards
        //3. were ignored (not interested)
        //4. already sent a connection request to OR recieved connectionre request from

        const loggedInUser = req.user;

        //here we are setting the value of page and limit to integer type, in the query, example:(?page=1&limit=10) and not params, example:(/page/limit)
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        //this is the relation between skip and limit
        const skip = (page-1)*limit;

        //here we are fetching form and to user ID from all the existing connection requests
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserID: loggedInUser._id},
                {toUserID: loggedInUser._id}
            ],
        }).select("fromUserID toUserID");

        //Now we are adding all the users (to and from) form the connectionRequests to out hiddenUsers Set
        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hiddenUsersFromFeed.add(req.fromUserID.toString());
            hiddenUsersFromFeed.add(req.toUserID.toString());
        })

        //const users are the finals users being displayed on the field
        //here we are checking if they are not included in hiddenUsers array, and not equal to the loggedIn user's id
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hiddenUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}},
            ],
        }).select("firstName lastName age gender skills about photoURL")
          .skip(skip)
          .limit(limit)

        res.send(users);

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

 module.exports = userRouter;