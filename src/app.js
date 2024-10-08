const express = require('express');
const app = express();

app.get("/getUserData", (req,res)=>{
    //Logic of DB call and get user data
    //we will randomly generate errors, to see the concept of error handlers

    throw new Error("thisisanerrorlol");
    res.send("User data sent");

    // an alternative method using TRY & CATCH
    // try{
    //     throw new Error("thisisanerrorlol");
    //     res.send("User data sent");
    // }
    // catch{
    //     res.status(500).send("Something went wrong!");
    // }

});

//(err,req,res,next)
//in this order, express treats first one as error, seocnd as request, third as response, and 4th one as next
app.use("/", (err,req,res,next)=>{
    if (err) {
        res.status(500).send("Something went wrong!");
    }
})
//also, always write this error handling file at the end

app.listen(1000,()=>{
    console.log("Server is accessible at localhost:1000")
})