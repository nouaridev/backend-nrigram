const { default: mongoose } = require("mongoose");
const { User } = require("../models/User");
const appError = require("../utils/apiError");
const bcrypt = require('bcrypt')


const editProfile =async (req , res ,next)=>{
    try {
            let user = req.user ; 
            console.log(req.body)
            let info = {
                name: req.body.name , 
                userName : req.body.userName , 
                bio: req.body.bio 
            }
            if(req.pfpUrl){
                info.pfpUrl = req.pfpUrl ; 
            }

            let userUpdate =await User.findByIdAndUpdate(user._id , info ,{new: true}) ;
            res.status(200).json({
                success: true , 
                user: userUpdate 
            }) 
    } catch (error) {
            next(error)
    }
}


const editEmail = async(req, res ,next )=>{
    try {
        let user = req.user ; 
        console.log(user)
        if(!req.body.email){
          return  next(new appError('no email is provided to update', 422))
        }

        let newData = {
            email : req.body.email 
        }; 
        console.log(newData)
        let updated = await User.findByIdAndUpdate(user._id, newData , {new: true})
        console.log(updated)
        res.status(200).json({
            success: true, 
            user: updated 
        })

    } catch (error) {
        next(error)
    }
}


const editPassword = async(req, res ,next )=>{
    try {
        let user = req.user ; 
        if(!req.body.password){
           return next(new appError('no password is provided to update', 422))
        }
        let newData = {
            password : req.body.password 
        }; 

        let updated = await User.findByIdAndUpdate(user._id, newData , {new: true})
        res.status(200).json({
            success: true, 
            user: updated 
        })

    } catch (error) {
        next(error)
    }
}


const updatePrivacy = async(req, res ,next)=>{
    try {
        const user = req.user ; 
        if(!req.body.privacyOptions){
          return  next(new appError('no privacy Options is provided to update', 422))
        }
        const options = req.body.privacyOptions ;
        let newOptions ={
            privacy:{
                showEmail: options.showEmail , 
                showNumber: options.showNumber , 
                shareData: options.shareData 
            }
        } 
        let updatedOptions = await User.findByIdAndUpdate(user._id , newOptions , {new: true})

        res.status(200).json({
            success: true , 
            user : updatedOptions 
        })
    } catch (error) {
        return next(error)
    }
}

const getProfileData = async(req,res,next)=>{
    try{
        const user = req.user ; 
        const userData = await User.findById(user._id , {password: 0}); 
        res.status(200).json(userData) 
    }catch(error){
        next(err)
    }
}




module.exports = {getProfileData ,editProfile , editEmail , editPassword , updatePrivacy}