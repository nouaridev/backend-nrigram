const Conversation = require('../models/conversation') ;
const { User } = require('../models/User');

const createConverstion = async(user1 , user2)=>{
   try {
     const conversation = new Conversation({
        participants: [user1 , user2]
    })
    const savedConversation =await conversation.save();
    return savedConversation ;
   } catch (error) {
    throw error ;
   }
} 
const checkConversation = (user1 , user2)=>{
    let conversation = Conversation.findOne({
        participants: {$all: [user1 ,user2]}
    }) ;
    return conversation ;
}

const checkBelongs =async (conversationId , userId)=>{
    try{
        let conversation = await Conversation.findById(conversationId) ;
        let participantsIds = conversation.participants.map(p=> `${p._id}`) ;
        if(!participantsIds.includes(userId.toString())){
            return false 
        }
        return true
    }catch(err){
        throw err;
    }
}

const setUserOnlineStatus = (userId , online)=>{
    User.findByIdAndUpdate(userId , {online:online} , {new:true}).then((user)=>{
        // console.log(user)
    })
}

module.exports= {createConverstion ,setUserOnlineStatus, checkConversation , checkBelongs}