const express = require('express')
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");


//get all the connection request
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{


    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested",

        }).populate("fromUserId",["firstName","lastName"])//herer we using the populate because of the referece ref = user

        res.json({
            message:"Data fetched successfully",
            data: connectionRequest
        })


    }catch(err){
        req.status(400).send("ERROR:"+err.message);
    }
})





module.exports = userRouter;

