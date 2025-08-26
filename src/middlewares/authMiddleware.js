const jwt = require('jsonwebtoken') ; 
require('dotenv').config() 

const checkAuth = async(req , res ,next)=>{
    let auth = req.headers['authorization']
    if(!auth) return next(new appError('no token is provided' ,401))

    let token = auth.split(' ')[1] ;
    if(!token) return next(new appError('invalid token format' ,401))
   
    try {
        const decoded =  jwt.verify(token , process.env.JWT_SECRET) 
        req.user = decoded ;
        next()
    } catch (err) {
        next(err)
    }
}

module.exports = checkAuth  