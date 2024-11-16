const mongoose = require("mongoose");

//this is a connection request schema model 
const connectionRequestSchema  = new mongoose.Schema(
    {
        fromUserID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //this is  a refernce to the user collection (USER schema)
            required: true,
        },
        toUserID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
        status:{
            type: String,
            required: true,
            enum:{
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {timestamps: true}
);

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    //checking if the fromUserId is same as toUserId
    //we need to avoid that
    if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
        throw new Error("cannot send connection request to yourself")
    }
    next();
});

const connectionRequestModel = new mongoose.model(
    "ConnectionRquest",
    connectionRequestSchema
);

module.exports = connectionRequestModel;