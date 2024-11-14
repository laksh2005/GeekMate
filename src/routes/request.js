const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

requestRouter.use(express.json());

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];
        //here we are making sure there is nothing else than ignored or interested in url api call
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type: " + status);
        }
        //if the target user isn't found, we return this
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        //here we check if there is already an existing connection request from fromuser to touser, if so, we return an error
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserID: fromUserId, toUserID: toUserId },
                { fromUserID: toUserId, toUserID: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request already exists" });
        }
        //here we create a connection request
        const connectRequest = new ConnectionRequest({
            fromUserID: fromUserId,
            toUserID: toUserId,
            status,
        });
        const data = await connectRequest.save();
        res.json({
            message: `${req.user.firstName} seems to have ${status} ${toUser.firstName}`,
            data
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
      try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
          return res.status(400).json({ messaage: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          toUserID: loggedInUser._id,
          status: "interested",
        });

        if (!connectionRequest) {
          return res
            .status(404)
            .json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });

      } catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }
    });

module.exports = requestRouter;