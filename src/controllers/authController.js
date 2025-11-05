const bcrypt = require('bcrypt')
const {User} = require("../models/User");
const generateToken = require('../config/jwt');
const appError = require('../utils/apiError');



const signUp = async(req , res ,next)=>{
    try{
        let data = req.body; 
       
        let userData = {
            email : data.email , 
            userName: data.userName, 
            password: data.password ,
        } 
        if(req.pfpUrl) userData.pfpUrl= req.pfpUrl ;

        let user = new User(userData) ; 
        let savedUser= await user.save() ;

        const tkn = generateToken({
            _id: savedUser._id ,
            email: savedUser.email ,
            userName: savedUser.userName })
             
        res.json({
            succes: true  , 
            user: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                pfpUrl: user.pfpUrl , 
                privacy: user.privacy
            }  ,
            token: tkn
        })
        
    }catch(err){
      next(err)
    }
}

const signIn = async(req, res ,next) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return next(new appError('Invalid email or password' , 401))
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new appError('Invalid email or password' , 401))
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      userName: user.userName
    });

  
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        pfpUrl: user.pfpUrl, 
        privacy: user.privacy
      },
      token
    });

  } catch (err) {
    next(err)
  }
};

const refreshToken = async(req, res ,next) => {
    try{
        const user = req.user ;  
        const token = generateToken({
            _id: user._id,
            email: user.email,
            userName: user.userName
          });
        
        const userInfo = await User.findById(user._id).exec() ;
        res.json({
            success: true,
            token , 
            user: {
                id: userInfo._id,
                email: userInfo.email,
                userName: userInfo.userName,
                pfpUrl: userInfo.pfpUrl, 
                privacy: userInfo.privacy
            } 
        });
    } catch (err) {
        next(err)
    }
};

module.exports = {signUp , signIn , refreshToken}