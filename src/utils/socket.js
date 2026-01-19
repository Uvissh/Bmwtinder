const socket = require("socket.io");
const crypto = require("crypto");
const { log } = require("console");
const {Chat} = require("../models/chat")



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
      async  ({ firstName ,
      userId,
      targetUserId,
      text,})=>{
         try{

        const roomId = getSecretRoomId(userId,targetUserId);
       
        


        //save mesages to the database
       
         let chat = await Chat.findOne({
                participants :{$all :[userId,targetUserId]},
            });

            if(!chat){
                chat = new Chat({
                    participants:[userId,targetUserId],
                    messages:[],
                });
            }
            chat.messages.push({
                senderId : userId,
                text,
            });
            await chat.save();
            io.to(roomId).emit("messageReceived",{firstName,text});
        
        }catch(err){
            console.log(err);
        }
                

      });


    socket.on("disconnect",()=>{});
    
});
}

module.exports = intializeSocket;

