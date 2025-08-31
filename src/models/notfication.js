const mongoose = require('mongoose') ; 

const notficationSchema = new mongoose.Schema({
    type: {type: String , enum:['friendRequest' , 'password' , 'compandy']} , 
    title: {type: String , required: true} , 
    body: {type: String , required: true} , 
    isNew: {type: Boolean , default: true} , 
    user : {type: mongoose.Schema.Types.ObjectId ,ref: "User" , required: true}
},{
    timestamps: true
}) ;

const Notfication = new mongoose.model('Notfication' , notficationSchema) ; 

module.exports = Notfication ;