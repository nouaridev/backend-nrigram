const  mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const {hash} = require('../middlewares/authMiddleware')
const userSchema = new mongoose.Schema({
    name: String , 
    userName: {type: String ,required: true,  unique: true} , 
    email: {type: String , required: true , unique: true } , 
    phoneNumber: String , 
    bio: String  ,
    pfpUrl: String , 
    privacy: {
        showEmail: { type: Boolean, default: true },
        showNumber: { type: Boolean, default: false },
        shareData: { type: Boolean, default: false }
    } ,
    badjes:[String] ,
    password: {type: String , required: true }
})

userSchema.pre('save' , async function(next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        console.log('Error while hashing password', err);
        next(err);
    }
})

const User =  mongoose.model('User' , userSchema) ;

module.exports = {User}  ;