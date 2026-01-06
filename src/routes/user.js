const express = require('express')
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const USER_SAFE_DATA =  "firstName lastName photoUrl age gender about skills"


//get all the connection request
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{


    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested",

        }).populate("fromUserId",USER_SAFE_DATA
           )//herer we using the populate because of the referece ref = user

        res.json({
            message:"Data fetched successfully",
            data: connectionRequest
        })


    }catch(err){
        req.status(400).send("ERROR:"+err.message);
    }
})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId :loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ],

        }).populate("fromUserId",USER_SAFE_DATA);

        const data = connectionRequest.map((row)=>row.fromUserId);

        res.json({data});

    }catch(err){
        res.status(400).send({message:err.message});
    }
})







module.exports = userRouter;

