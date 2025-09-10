const express = require('express') ; 
const router = express.Router() ; 

const {uploadPfp} = require('../middlewares/cloudinaryMiddleware')
const multerUpload = require('../config/multer') ;
const {signUp} = require('../controllers/authController')
router.route('/signup').post(multerUpload.single('file'),uploadPfp,signUp); 

const {signIn} = require('../controllers/authController') ; 
router.route('/signin').post(signIn) ; 

const checkAuth = require('../middlewares/authMiddleware')
const {refreshToken} = require('../controllers/authController') ; 
router.route('/refresh-token').get(checkAuth,refreshToken);
module.exports = router; 