  const jwt = require('jsonwebtoken');
  const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    //read the token from the req cookies
    //validate the token
    //find the username
    try{

    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
       return res.status(401).send("Please login")
    }
     const decodedObj =     await jwt.verify(token,"bhateria@12345");
     const {_id} = decodedObj;
     const user = await User.findById(_id);
     if(!user){
        throw new Error("User not found");

     }
     req.user = user;
    next();
    }catch(err){
        res.status(400).send("Error" + err.message);
    }




    //validate the token

}
module.exports ={
    userAuth,
}