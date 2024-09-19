const express = require('express');

const app = express();


app.use("/route",(req,res)=>{
    res.send("Hello from the route")
});

app.listen(1000,()=>{
    console.log("Server is accesible at above port")
})