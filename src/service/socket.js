let {Server} = require('socket.io')
require('dotenv').config()
let io ; 
let jwt = require('jsonwebtoken')
const Message = require('../models/message') ; 
let Conversation = require('../models/conversation')
const {setUserOnlineStatus} = require('./conversationService');
const { set } = require('mongoose');

const connectSocket  = (server)=>{
    io = new Server(server  , {cors: {origin: "*"},
  pingInterval: 5000,  // send ping every 5s
  pingTimeout: 10000 }) 
    io.on('connection' , (socket)=>{
        console.log('user connected: ' + socket.id) ;
        socket.userId = socket.handshake.query.userId;
        socket.joinedConversations = new Set();
        setUserOnlineStatus(socket.userId , true) ;

        socket.on('joinConversation' , async({conversationId ,userId})=>{
            socket.join(conversationId.toString()); 
            socket.joinedConversations.add(conversationId) ;
            socket.to(conversationId.toString()).emit('onlineStatus' , {conversationId ,userId,  online: true}) ; 
            console.log(`User ${socket.id} joined room ${conversationId}`);
        })

        socket.on("writing", ({ conversationId, userId, isTyping }) => {
            socket.to(conversationId).emit("writing", {
                userId,
                isTyping, 
            });
            console.log(`User ${userId} is ${isTyping ? "typing" : "not typing"} in conversation ${conversationId}`);
        });

        socket.on('readConversation' , async({conversationId , userId})=>{
            try{
                await Message.updateMany({conversation: conversationId , readBy: {$ne: userId} , sender:{$ne:userId}}, {$addToSet:{readBy: userId}}) ; 
                console.log(`User ${userId} has read messages in conversation ${conversationId}`);
                socket.to(conversationId).emit('conversationRead' , {conversationId , userId})
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
            setUserOnlineStatus(socket.userId , false) ;
            for(let room of socket.joinedConversations) {
                io.to(room).emit("onlineStatus", {
                    conversationId: room,
                    userId: socket.userId,
                    online: false,
                });
                console.log(`User ${socket.id} left room ${room}`); 
            };                
            console.log('User disconnected:', socket.userId);
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