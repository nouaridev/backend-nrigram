const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateToken = (payload)=>{
        let token = jwt.sign(payload,process.env.JWT_SECRET) ;
        return token ;
}


module.exports = generateToken ;  