let {Server} = require('socket.io')
require('dotenv').config()
let io ; 
let jwt = require('jsonwebtoken')
const Message = require('../models/message') ; 
let Conversation = require('../models/conversation')

const connectSocket  = (server)=>{
    io = new Server(server  , {cors: {origin: "*"}}) 
    io.on('connection' , (socket)=>{
        console.log('user connected: ' + socket.id) ;
        
        socket.on('joinConversation' , (conversationId)=>{
            socket.join(conversationId); 
            socket.to(conversationId).emit('onlineStatus' , {conversationId , online: true}) ; 
            console.log(`User ${socket.id} joined room ${conversationId}`);
        })

        socket.on("writing", ({ conversationId, userId, isTyping }) => {
            socket.to(conversationId).emit("writing", {
                userId,
                isTyping, // true = typing, false = stopped
            });
        });

        socket.on('readConversation' , async({conversationId , userId})=>{
            try{
                await Message.updateMany({conversation: conversationId , readBy: {$ne: userId} , sender:{$ne:userId}}, {$addToSet:{readBy: userId}}) ; 
                socket.to(conversationId).emit('conversationRead' , conversationId)
            }catch(err){
                 console.error("Error marking conversation as read:", err);
            }
        })

        socket.on("connectNotfication" ,async (token)=>{
            try{
                let user = jwt.verify(token , process.env.JWT_SECRET) ; 
                socket.join(user._id.toString()+"notfications")
                console.log('user joinded'+user._id.toString()+"notfications" ) 


                
            }catch(err){
                if(err.name == 'JsonWebTokenError'){
                    socket.emit('Notfication failed'  , 'Invalid token , please login again')
                }else if(err.name == 'TokenExpiredError'){
                    socket.emit('Notfication failed'  , 'Session expired, please login again.')
                }
            }
        })

        socket.on('disconnect', () => {
            
            socket.rooms.forEach(room=>{
                if(room !== socket.id){
                    socket.to(room).emit('onlineStatus' ,{
                        conversationId: room , 
                        online: false 
                    })
                }
            })

            console.log('User disconnected:', socket.id);
        });
    }) 

}

getIo = ()=>{
    if(!io){
        console.log("socket.io not initialized")
    }
    return io
}
module.exports = {connectSocket , getIo}