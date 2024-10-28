const mongoose = require("mongoose");

//THIS IS A USER SCHEMA, USERMODEL
const userSchema = mongoose.Schema({
           //pass in all the parameters that describe the schema
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    emailId:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    age:{
        type: Number,
        min:18,
        max:60,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"]){
                throw new Error ("Gender data isn't valid");
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about statement generated.",
    },
    skills:{
        type: [String],
    },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;