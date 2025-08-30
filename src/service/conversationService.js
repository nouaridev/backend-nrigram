const Conversation = require('../models/conversation') ;

const createConverstion = (user1 , user2)=>{
    const conversation = new Conversation({
        participants: [user1 , user2]
    })
    const savedConversation = conversation.save();
    return savedConversation ;
} 
const checkConversation = (user1 , user2)=>{
    let conversation = Conversation.findOne({
        participants: {$all: [user1 ,user2]}
    }).select('_id') ;
    return conversation ;
}

const checkBelongs =async (conversationId , userId)=>{
    try{
        let conversation = await Conversation.findById(conversationId) ;
        let participantsIds = conversation.participants.map(p=> `${p._id}`) ;
        console.log(participantsIds)
        if(!participantsIds.includes(userId.toString())){
            return false 
        }
        return true
    }catch(err){
        throw err;
    }
}

module.exports= {createConverstion , checkConversation , checkBelongs}