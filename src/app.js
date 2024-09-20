const express = require('express');

const app = express();


//next() moves the get context to the next route handlers, since they don't have any res.send() statement
// this goes on until the 5th request handler, and since we have no next() in it, and also a res.send(), it gets returned

app.get("/user",
    (req, res, next) =>{
        console.log("Handling the route user!!")
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route user2!!")
        //res.send("2nd response")
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route user3!!")
        //res.send("3rd response")
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route user4!!")
        //res.send("4th response")
        next();
    },
    (req, res) =>{
        console.log("Handling the route user5!!")
        res.send("5th response")
    },
    
)


app.listen(1000,()=>{
    console.log("Server is accesible at above port")
})