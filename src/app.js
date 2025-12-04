const express = require("express");

const app = express();
app.use("/hello",(req,res)=>{
    res.send("heloo world! ");
})


app.use("/",(req,res)=>{
    res.send("hello from the server");
});


app.listen(3000,()=>{
    console.log("Server is successfully listening");
    
})