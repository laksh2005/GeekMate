const express = require('express');

const app = express();

// app.get("/user",(req,res)=>{
//     console.log(req.query);
//     res.send({firstName: "Laksh", lastName: "Nijhawan"})
// })


//DYNAMIC ROUTES
app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send({firstName: "Laksh", lastName: "Nijhawan"})
})



app.listen(1000,()=>{
    console.log("Server is accesible at above port")
})