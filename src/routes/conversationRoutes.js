const express = require('express') ; 
const Router = express.Router() ; 

const multerUpload = require('../config/multer') ; 
const checkAuth = require('../middlewares/authMiddleware')

const {sendMessage ,getConversation, getConversations ,getMessages ,getSearchResults ,checkConversationExists, getUserInfo} = require('../controllers/conversationsController')

// check if conversation exists between two users
Router.route('/conversation/exists/:recipientId').get(checkAuth , checkConversationExists) ;

// get single conversation by id
Router.route('/conversation/:id').get(checkAuth , getConversation) ;

// get all conversations of user
Router.route('/conversations').get(checkAuth , getConversations)

// send message to conversation if exists or create new conversation 
Router.route('/messages/:conversationId').post(checkAuth , sendMessage); 
Router.route('/messages').post(checkAuth , sendMessage); 

// get all messages  of conversation 
Router.route('/messages/:conversationId').get(checkAuth , getMessages) ; 



//search route: 
Router.route('/search').get(checkAuth , getSearchResults);

// get user info
Router.route('/user/:userId').get(checkAuth , getUserInfo);

module.exports = Router ;