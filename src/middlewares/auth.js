const adminAuth = (req,res,next)=>{
    //LOGIC OF CHECKING IF THE REQUEST IS AUTHORIZED
    console.log("admin auth is getting checked");
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access");
    }
    else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    //LOGIC OF CHECKING IF THE USER IS AUTHORIZED
    console.log("user auth is getting checked");
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access");
    }
    else{
        next();
    }
}

module.exports={
    adminAuth,
    userAuth
}