const mongoose = require("mongoose");

//THIS IS A USER SCHEMA, USERMODEL
const userSchema = mongoose.Schema({
    //pass in all the parameters that describe the schema
    firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
    },
    password:{
        type: String,
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;