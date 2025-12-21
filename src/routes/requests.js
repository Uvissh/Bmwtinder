const express = require('express');
const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/ConnectionRequest");




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
    message :"Connection Request Sent SuccessFully!",
    data,
  })

   }catch(err){
    res.status(400).send("Error"+err.message);

   }

})


module.exports = requestRouter;