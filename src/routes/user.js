const express = require('express')
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const User = require("../models/user");
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
                {fromUserId:loggedInUser._id,status:"accepted"},  //datatabase queries
            ],

        }).populate("fromUserId",USER_SAFE_DATA)
          .populate("toUserId",USER_SAFE_DATA);

          console.log(connectionRequest);
          

        const data = connectionRequest.map((row)=>
        {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;

        })

        res.json({data});

    }catch(err){
        res.status(400).send({message:err.message});
    }
})


userRouter.get("/feed",userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user;
        const page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;
        limit = limit >50?50:limit;
         const skip = (page-1)*limit;

        const connectionRequest = await ConnectionRequestModel.find({
            $or:[{fromUserId: loggedInUser._id},
              {toUserId:loggedInUser._id}  
            ]
        }).select("fromUserId toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUsersFromFeed)}},//not in array
                {_id:{$ne :loggedInUser._id}},//not equal to the loggedinuserid
            ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
    
        res.send({data:users});//standaad way to erite the data



    }catch(err){
        res.status(400).json({message:err.message});
    }
})







module.exports = userRouter;
//you cannot compare the two mongo ids like this ===//wrong way
//notes /feed?page=1&limit=10 =>1-10 =>.skip(0) & limit(10)
//      page 2&limit=10 11-20 =>.skip(10 )&.limit(10)
//skip  1*10