const express = require('express');

const app = express();

//by using app.get, it will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName: "Laksh", lastName: "Nijhawan"})
})

//by using app.post, it will only handle POST call to /user
app.post("/user",(req,res)=>{
    res.send("Data saved successfully")
})

//this will match all the other HTTP method API calls to /route
app.use("/route",(req,res)=>{
    res.send("Hello from the route")
});

app.use("/hi/2",(req,res)=>{
    res.send("hi x2")
});

app.use("/hi",(req,res)=>{
    res.send("hi mate")
});

app.use("/",(req,res)=>{
    res.send("welcome to server")
});

app.listen(1000,()=>{
    console.log("Server is accesible at above port")
})