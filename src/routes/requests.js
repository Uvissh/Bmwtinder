const express = require('express');
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const User = require("../models/user");




const  requestRouter = express.Router();



 requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
   try{
 const fromUserId =  req.user._id;
 const toUserId = req.params.toUserId;
 const status = req.params.status;

 const allowedStatus = ["ignored","interested"];
 if(!allowedStatus.includes(status)){
    return res.status(400).json({message:"Invalid status type:" + status});
 }

 const toUser = await User.findById(toUserId);

 if(!toUser){
  return res.status(404).json({
    message:"User not found",
  });
 }
 //if there is an  existing ConnectionRequest
  const existingConnectionRequest = await  ConnectionRequestModel.findOne({
    $or:[
        {fromUserId,toUserId},
        {fromUserId: toUserId, toUserId: fromUserId},
    ],
  });

  if(existingConnectionRequest){
    return res.status(400).send({message: "Connection Request Already Exists!!"});
  }


  const  ConnectionRequest = new ConnectionRequestModel({
    fromUserId,
    toUserId,
    status,
  });
  const data = await ConnectionRequest.save();

  res.json({
    message :req.user.firstName+ "is"+status+" in " +toUser.firstName,
    data,
  })

   }catch(err){
    res.status(400).send("Error"+err.message);

   }

})
 requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser = req.user;
    //loggedInId is should of the  touserId because it is accepting or rejecting the request
    //validate the status
    const {status,requestId} = req.params;
     const allowedStatus = ["accepted","rejected"];
     if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Status not allowed"});

     }
     const ConnectionRequest = await ConnectionRequestModel.findOne({
      _id:requestId,
      toUserId: loggedInUser._id,
      status:"interested",
     });
     if(!ConnectionRequest){
      return res.status(404).json({message:"Connection request not found"});
     }
     ConnectionRequest.status = status;//updating the status
     const data = await ConnectionRequest.save();
     res.json({message:"Connection request"+status,data});

  }catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }
 })

module.exports = requestRouter;