const express = require("express");
 const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cors = require("cors");




const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(cors({
 origin:"http://localhost:5173",
 credentials:true,
}

));
app.use(express.json());
app.use(cookieParser());



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);
app.use("/",userRouter);





























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

