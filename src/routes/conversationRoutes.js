const express = require('express') ; 
const Router = express.Router() ; 

const multerUpload = require('../config/multer') ; 
const checkAuth = require('../middlewares/authMiddleware')

const {sendMessage , getConversations ,getMessages} = require('../controllers/conversationsController')

// get all conversations of user
Router.route('/conversations').get(checkAuth , getConversations)

// send message to conversation if exists or create new conversation 
Router.route('/messages/:conversationId').post(checkAuth , sendMessage); 
Router.route('/messages').post(checkAuth , sendMessage); 

// get all messages  of conversation 
Router.route('/messages/:conversationId').get(checkAuth , getMessages) ; 


module.exports = Router ;