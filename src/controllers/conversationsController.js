const  Message = require('../models/message') 
const  Conversation = require('../models/conversation') 


const {checkConversation , createConverstion ,checkBelongs} = require('../service/conversationService')

const sendMessage = async (req ,res ,next)=>{
    try{
        let conversationId = req.params.conversationId ; 
        const senderId = req.user._id ; 
        const recipientId = req.body.reciepientId

        if(!conversationId){
            let conversation = await checkConversation(senderId , recipientId) ; 
            if(!conversation){
                console.log('hhi')
                conversation = await createConverstion(senderId , recipientId) ; 
            }
            conversationId = conversation._id ; 
        }
        
        let message = new Message({
            conversation: conversationId , 
            sender: req.user._id , 
            content : req.body.content  , 
            type: req.body.type 
        })
        let savedMessage = await message.save() ;

        await Conversation.findByIdAndUpdate(conversationId ,{
            lastMessage: savedMessage._id 
        }) 

        let populateMessage = await Message.findById(savedMessage._id).populate('sender' , 'name email pfpUrl')
        res.status(200).json({
            success: true , 
            message: populateMessage 
        })
    }catch(err){
        console.log('error in the conversation controller : ' + err)
        next(err)
    }
}

const getConversations = async (req ,res ,next)=>{
    try {
        let id = req.user._id ; 
        let conversations =await Conversation.find({participants: id}).populate('participants' , 'userName email pfpUrl').populate('lastMessage' , 'content type') ;
        res.json({
            success: true , 
            conversations: conversations
        })
    } catch (error) {
        next(err)
    }
}

const getMessages = async (req, res ,next)=>{
    try {
        let conversationId = req.params.conversationId ;
        
        // check if he has the right : 
        let belongs = await checkBelongs(conversationId , req.user._id) ; 
        if(!belongs){
            return res.json({
                success:false , 
                error: 'there is no conversation with id '+conversationId 
            })
        }
        
        const messages = await Message.find({"conversation": conversationId})
        .populate({path:"conversation" , populate: {path: "participants" , select: "userName email pfpUrl"}})
        res.json({
            success: true ,
            messages: messages
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {sendMessage ,getConversations ,getMessages}
