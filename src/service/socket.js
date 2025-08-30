let {Server} = require('socket.io')
let io ; 


const connectSocket  = (server)=>{
    io = new Server(server  , {cors: {origin: "*"}}) 
    io.on('connection' , (socket)=>{
        console.log('user connected: ' + socket.id) ;
        
        socket.on('joinConversation' , (conversationId)=>{
            socket.join(conversationId); 
            console.log(`User ${socket.id} joined room ${conversationId}`);
        })

        socket.on('writing' , (conversationId)=>{
            console.log('writing')
            socket.to(conversationId).emit('writing' , 'user is wraiting...')  
        })

        socket.on('disconnect', () => {
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