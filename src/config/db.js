const mongoose = require('mongoose') ;

require('dotenv').config() ; 

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('data base connected ✔')
    }catch(err){
        console.log('error while connecting to data base') ; 
        process.exit(1)
    }
}

module.exports = connectDb ; 