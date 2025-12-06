const express = require("express");
 const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();


app.use(express.json());



app.post("/signup",async(req,res)=>{
    // console.log(req.body);
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user Added successfully!");
    }catch(err){
        res.status(400).send("Error saving the user"+err.message);
    }
});
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

