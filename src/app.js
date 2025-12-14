const express = require("express");
 const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();




const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");

app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);






























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

