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
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`,
        }
    },
    about:{
        type: String,
        default: "This is a default about statement generated.",
    },
    skills:{
        type: [String],
    },
    photoURL: {
        type: String,
        trim: true,
        default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp", 
    },
    },
    {
        timestamps: true,
    }
);

//this is COMPUND INDEXING : it will help when there are various users with the same firstName, it would be easy to find the exact desired user in searching
userSchema.index({firstName: 1});

userSchema.methods.getJWT = async function(){
    const user = this;
    // "this" refers to the particular instance of the userSchema which we login
    const token = await jwt.sign({_id: user._id},   "Thisis+key+forthistoken123", {expiresIn:"7d"});
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