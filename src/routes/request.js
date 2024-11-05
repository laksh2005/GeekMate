const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user");
const ConnectionRequest = require = require("../models/connectionRequest");

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


module.exports = requestRouter;