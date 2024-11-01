const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")

requestRouter.use(express.json());

requestRouter.post("/sendConnectionRequest", userAuth, async (req,res)=>{
    try{
        const user = req.user;
        //sending a connection request
        console.log("sending a connection request...");
        res.send(user.firstName + " sent a connection request!")
    } catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = requestRouter;