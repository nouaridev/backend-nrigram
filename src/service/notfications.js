const Notfication = require("../models/notfication");
const { getIo } = require("./socket");

const io = getIo() ;


let sendNotfication = async(userId , data)=>{
    let roomName = userId + 'notfications' ; 
    let room = io.sockets.adapter.rooms.get(roomName) ; 
    let notf = new Notfication({...data, isNew: true}) ; 
    if(room && room.size > 0){
        io.to(roomName).emit('notfication' , notf) ; 
        notf.isNew = false ; 
    }
    await notf.save() ;
    return notf; 
} 


let getAllNewNotfications = async (userId)=>{
    try {
        let notfs = await Notfication.find({user: userId , isNew: true}).sort({createdAt: -1});
        await Notfication.updateMany({user: userId , isNew: true} , {$set: {isNew: false}})
        return notfs ; 
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [] ; 
    }
}

module.exports = {sendNotfication , getAllNewNotfications}