const  Message = require('../models/message') 
const  Conversation = require('../models/conversation') 

const { getIo } = require('../service/socket');
const {checkConversation , createConverstion ,checkBelongs} = require('../service/conversationService');
const { User } = require('../models/User');
const appError = require('../utils/apiError');

const sendMessage = async (req ,res ,next)=>{
    try{
        let conversationId = req.params.conversationId ; 
        const senderId = req.user._id ; 
        const recipientId = req.body.recipientId

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
        
        const io = getIo() ;
        console.log('emitting to room: ' + conversationId)
        io.to(String(conversationId)).emit('recieveMessage' , populateMessage) 

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
        let conversations =await Conversation.find({participants: id}).populate('participants' , 'userName email pfpUrl').populate('lastMessage' , 'content sender type readBy createdAt').sort({'updatedAt': -1}) ;
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
        .populate({path:"conversation" , populate: {path: "participants" , select: "userName email pfpUrl"}}).populate('sender' , 'userName email pfpUrl')
        res.json({
            success: true ,
            messages: messages
        })

        const userId = req.user._id ;
        await Message.updateMany({conversation: conversationId , sender: {$ne: userId} , readBy: {$ne: userId}},{
            $push:{readBy: userId }
        })
        
        const io = getIo() ; 
        io.to(conversationId).emit("conversationOpened" , conversationId) // hadi rigli 3la 7sabha 
    } catch (error) {
        next(error)
    }
}

const checkConversationExists = async (req , res ,next)=>{
    try {
        let userId = req.user._id ; 
        let recipientId = req.params.recipientId ;
        let conversation = await checkConversation(userId , recipientId) ; 
        if(conversation){
            return res.json({
                success: true ,
                conversation: conversation
            })
        }
        return res.json({
            success: true ,
            conversation: null 
        })
    } catch (error) {
        next(error)
    }
}

const getUserInfo = async(req ,res , next)=>{
    try {
        let user = req.params.userId ; 
        let userInfo = await User.findById(user).select('userName email pfpUrl') ;
        if(userInfo){
            res.json({
                success: true , 
                user: userInfo
            })
        }else{
            res.status(404).json({
                success: false ,
                error: 'User not found'
            })
        }
    } catch (error) {
        next(error)
    }
}

const getSearchResults = async (req ,res ,next)=>{
    try{
        let searchTerm = req.query.term.trim() ; 
        let type = req.query.type ;
        if(!searchTerm || searchTerm.trim() === ''){
            return res.json({
                success: false ,
                error: 'Invalid search term'
            })
        }
        if(type === 'people'){
            let users = await User.find({
                $or: [
                    { userName: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            });
            return res.json({
                success: true ,
                users: users
            })
        }else if(type === 'conversations')  {
            let conversations = await Conversation.aggregate([
                { $lookup:{from: 'users' , localField: 'participants' ,foreignField: '_id' , as: 'participants'}},
                { $lookup:{from:'messages' , localField: "lastMessage" , foreignField: '_id' , as: 'lastMessage'}},
                { $unwind:{ path: "$lastMessage" , preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                    $or: [
                        { "participants.userName": { $regex: searchTerm, $options: "i" } },
                        { "lastMessage.content": { $regex: searchTerm, $options: "i" } }
                    ]
                    }
                },
                { $project:{
                    participants:{userName:1 , email:1 ,pfpUrl:1},
                    lastMessage: {content: 1 , type: 1 ,readBy: 1 },
                    updatedAt: 1 
                }}
            ])
     
            return res.json({
                success: true ,
                conversations: conversations
            })
        }

    } catch (error) {
        next(error)
    }
}
module.exports = {sendMessage ,getConversations ,getMessages ,getSearchResults , checkConversationExists ,getUserInfo}
