const express = require('express');
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth")

//Handle Auth middleware for all the GET, POST requests
//This middleware makes sure that the data sending or the data deleting elements are accessible, only when the admin is authorized
//or else, it tends to send the error and the code won't be access from there onwards

//this means that all the /admin calls come here first
app.use("/admin", adminAuth);
app.use("/user", userAuth);

//THIS ISN'T AUTHORIZED
app.get("/user/login", (req,res)=>{
    res.send("User login function")
})

//THIS IS AUTHORIZED
app.get("/user/data", userAuth, (req,res)=>{
    res.send("User data sent")
})

app.get("/admin/getAllData", (req,res)=>{
    res.send("All data is sent")
})

app.get("/admin/deleteAllData", (req,res)=>{
    res.send("All data is gone")
})

app.listen(1000,()=>{
    console.log("Server is accessible at localhost:1000")
})