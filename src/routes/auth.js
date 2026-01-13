const express  = require('express');

const authRouter = express.Router();
const{validatorSignUpData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt");



authRouter.post("/signup",async(req,res)=>{
    // console.log(req.body);
        try{
            //validation of the data
            validatorSignUpData(req);
            const {firstName,lastName,emailId,password} = req.body;
 
            //encrypttion of the data
            const passwordHash =  await bcrypt.hash(password,10);


    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash,
    });

      const savedUser =   await user.save();

         const token = await savedUser.getJWT();
            
            

            res.cookie("token",token);
        res.json({ message:"user Added successfully!",data:savedUser});
    }catch(err){
        res.status(400).send("Error saving the user"+err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid credentilas");
        }
       
        const isPasswordValid  = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //  create  a token jwt 
            const token = await user.getJWT();
            console.log(token);
            

            res.cookie("token",token);
            res.send(user);

        }else{
            throw new Error("Invalid credentials");
        }
         
    }catch(err){
        res.status(400).send("Error :" + err.message);
    }
});

authRouter.post("/logout",async(req,res)=>{
   res.cookie("token",null,{
    expires:new Date(Date.now()),
   });
   res.send("logged out Successful");
})



module.exports = authRouter;