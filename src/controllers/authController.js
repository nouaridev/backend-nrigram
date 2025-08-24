const bcrypt = require('bcrypt')
const {User} = require("../models/User");
const signUp = async(req , res)=>{
    try{
        let data = req.body; 
        let user = new User({
            email : data.email , 
            userName: data.userName, 
            password: data.password
        })
        let savedUser= await user.save() ;
        res.json({
            succes: true  , 
            user: savedUser 
        })
        console.log('new user' + savedUser);
    }catch(err){
        console.log("error in the signUp controller " +err);
         res.status(400).json({succes: false })
    }
}

module.exports = {signUp}