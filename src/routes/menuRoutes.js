const express = require('express'); 
const Router = express.Router() ; 

const checkAuth = require('../middlewares/authMiddleware')
const {updatePfp} = require('../middlewares/cloudinaryMiddleware')
const {getProfileData ,editProfile , editEmail , editPassword , updatePrivacy} =require('../controllers/menuControllers');
const upload = require('../config/multer')

Router.route('/profile').get(checkAuth ,getProfileData) ;

Router.route('/profile/edit').put(checkAuth ,upload.single('file'),updatePfp ,editProfile)


Router.route('/profile/email').put(checkAuth  ,editEmail)


Router.route('/profile/password').put(checkAuth  ,editPassword)


Router.route('/profile/privacy').put(checkAuth , updatePrivacy)

module.exports = Router ; 