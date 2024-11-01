const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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

userSchema.methods.getJWT = async function(){
    const user = this;
    // "this" refers to the particular instance of the userSchema which we login
    const token = await jwt.sign({_id: user._id}, "Thisis+key+forthistoken123", {expiresIn:"7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;