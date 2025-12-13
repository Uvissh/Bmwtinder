const express = require("express");
 const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const{validatorSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


app.use(express.json());
app.use(cookieParser());



app.post("/signup",async(req,res)=>{
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

        await user.save();
        res.send("user Added successfully!");
    }catch(err){
        res.status(400).send("Error saving the user"+err.message);
    }
});
app.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid credentilas");
        }
       
        const isPasswordValid  = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //  create  a token jwt 
            const token = await jwt.sign({_id:user._id},"bhateria@12345");
            console.log(token);
            

            res.cookie("token",token);
            res.send("Login Successful!!!");

        }else{
            throw new Error("Invalid credentials");
        }
         
    }catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

app.get("/profile",async(req,res)=>{
   try{
    const  cookies = req.cookies;

    const {token} = cookies;
    if(!token){
        throw new Error("Invalid Token");
        
    }
    //validate  my token
    const decodedMessage = await jwt.verify(token,"bhateria@12345");
    const {_id} = decodedMessage;
    console.log("loggedin userid"+_id);
  const user = await User.findById(_id);
  if(!user){
    throw new Error("User does not exist");
  }
  res.send(user);
   }catch(err){
    res.status(400).send("Error:" + err.message);
   }
})
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId:userEmail});
        if(users.length ===0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});//it all the users
        res.send(users);

    }catch(err){
        res.status(400).send("something went wrong");
    }
})
app.delete("/delete",async(req,res)=>{

    const userId =  req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");

    }catch(err){
        res.status(400).send("something wernt wrong");
    }


});
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params.userId;
    const data = req.body;
    
     try{
       const ALLOWED_UPDATES =["photoUrl","firstName","lastName","age","about","gender","skills"];
     const isUpdatedAllowed = Object.keys(data).every((k)=>
 ALLOWED_UPDATES.includes(k)
     )
     if(!isUpdatedAllowed){
        throw new Error("Update not  allowed");

     }
  
     if(data?.skills.length > 10){
        throw new Error("skills is not  more than 10");
     }






        const user = await User.findByIdAndUpdate({_id:userId},data,{
            runValidators:true,
        });

        res.send("User update successfully");
     }catch(err){
        res.status(400).send("Update failed" +err.message);
     }
});





connectDB()
.then(()=>{
    console.log("Database connection established...");
    app.listen(3000,()=>{
    console.log("Server is successfully listening");
    
});
    
})
.catch((err)=>{
    console.log("Database cannot be  connected!!");
    
});

