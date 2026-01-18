const socket = require("socket.io");
const crypto = require("crypto");
const { log } = require("console");



 const getSecretRoomId =({userId,targetUserId})=>{
    return crypto
    .createHash("sha256")
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex");
 };
const intializeSocket = (server)=>{
    const io = socket(server,{
     


    cors:{
        origin:"http://localhost:5173",
    },
})
//io to recieve this  connection
io.on("connection",(socket)=>{
    //handle events
    socket.on("joinChat",({firstName,userId,targetUserId})=>
        {
            const roomId =getSecretRoomId(userId,targetUserId);
            console.log(roomId);
            

        
            socket.join(roomId);
            

    });
    socket.on("sendMessage",
        ({ firstName ,
      userId,
      targetUserId,
      text,})=>{

        const roomId = getSecretRoomId(userId,targetUserId);
       
        
        io.to(roomId).emit("messageReceived",{firstName,text});
        

      });
    socket.on("disconnect",()=>{});
    
});
}

module.exports = intializeSocket;

